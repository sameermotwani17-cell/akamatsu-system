import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOrderNumber, isUuid } from "@/lib/orders";
import { sendOrderConfirmationEmail } from "@/lib/email/order-confirmation";

type CreateOrderItem = {
  productId: string;
  name_ja: string;
  name_en: string;
  quantity: number;
  price: number;
  image_url?: string;
  variant?: string;
};

type CreateOrderBody = {
  idempotencyKey: string;
  fulfillmentType?: "pickup" | "delivery";
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  pickup: {
    date: string;
    slot: string;
  };
  delivery?: {
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
    estimatedFee?: number;
  };
  items: CreateOrderItem[];
};

const ESTIMATED_DELIVERY_FEE = 600;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateOrderBody> & Record<string, unknown>;

    // Safety guard: raw card data must never hit our server until tokenized provider integration is added.
    if ("payment" in body || "cardNumber" in body || "cvv" in body || "expiry" in body) {
      return badRequest("Raw card data must not be sent to this API");
    }

    if (!body.idempotencyKey || body.idempotencyKey.length < 8) {
      return badRequest("Missing idempotencyKey");
    }
    if (!body.customer?.firstName || !body.customer?.lastName) {
      return badRequest("Missing customer name");
    }
    if (!body.customer?.email || !body.customer.email.includes("@")) {
      return badRequest("Invalid email");
    }
    if (!body.customer?.phone) {
      return badRequest("Missing phone");
    }
    const fulfillmentType = body.fulfillmentType === "delivery" ? "delivery" : "pickup";

    if (fulfillmentType === "pickup" && (!body.pickup?.date || !body.pickup?.slot)) {
      return badRequest("Missing pickup info");
    }

    if (fulfillmentType === "delivery") {
      if (
        !body.delivery?.postalCode ||
        !body.delivery?.prefecture ||
        !body.delivery?.city ||
        !body.delivery?.addressLine1
      ) {
        return badRequest("Missing delivery address");
      }
    }
    if (!body.items || body.items.length === 0) {
      return badRequest("Cart is empty");
    }

    const items = body.items.filter((i) => i.quantity > 0);
    if (items.length === 0) return badRequest("Invalid cart items");

    const supabase = createAdminClient() as any;

    const { data: existing, error: existingError } = await supabase
      .from("orders")
      .select("id, order_number")
      .eq("idempotency_key", body.idempotencyKey)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }
    if (existing) {
      return NextResponse.json({ id: existing.id, orderNumber: existing.order_number, duplicate: true });
    }

    const productIds = items.map((i) => i.productId).filter(isUuid);
    const productMap = new Map<string, any>();

    if (productIds.length > 0) {
      const { data: dbProducts, error: productError } = await supabase
        .from("products")
        .select("id, name_ja, name_en, price, sale_price, stock_quantity, image_urls, is_active")
        .in("id", productIds);

      if (productError) {
        return NextResponse.json({ error: productError.message }, { status: 500 });
      }

      for (const p of dbProducts ?? []) {
        productMap.set(p.id, p);
      }
    }

    for (const item of items) {
      const p = productMap.get(item.productId);
      if (p && p.stock_quantity < item.quantity) {
        return badRequest(`Out of stock for ${p.name_ja}`);
      }
    }

    const normalizedItems = items.map((item) => {
      const p = productMap.get(item.productId);
      const unitPrice = p ? (p.sale_price ?? p.price) : item.price;
      return {
        productId: p?.id ?? null,
        name_ja: p?.name_ja ?? item.name_ja,
        name_en: p?.name_en ?? item.name_en,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
        image_url: p?.image_urls?.[0] ?? item.image_url ?? "",
        variant: item.variant ?? null,
      };
    });

    const pickupDate = body.pickup?.date ?? "";
    const pickupSlot = body.pickup?.slot ?? "";

    const subtotal = normalizedItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const deliveryFee = fulfillmentType === "delivery"
      ? Math.max(0, Math.trunc(body.delivery?.estimatedFee ?? ESTIMATED_DELIVERY_FEE))
      : 0;
    const tax = 0;
    const total = subtotal + deliveryFee + tax;

    let orderNumber = generateOrderNumber();
    for (let i = 0; i < 5; i += 1) {
      const { data: existingOrderNo } = await supabase
        .from("orders")
        .select("id")
        .eq("order_number", orderNumber)
        .maybeSingle();
      if (!existingOrderNo) break;
      orderNumber = generateOrderNumber();
    }

    const orderInsert = {
      order_number: orderNumber,
      idempotency_key: body.idempotencyKey,
      customer_name: `${body.customer.lastName} ${body.customer.firstName}`,
      email: body.customer.email,
      phone: body.customer.phone,
      fulfillment_type: fulfillmentType,
      pickup_date: fulfillmentType === "pickup" ? pickupDate : null,
      pickup_slot: fulfillmentType === "pickup" ? pickupSlot : null,
      postal_code: fulfillmentType === "delivery" ? body.delivery?.postalCode : null,
      prefecture: fulfillmentType === "delivery" ? body.delivery?.prefecture : null,
      city: fulfillmentType === "delivery" ? body.delivery?.city : null,
      address_line1: fulfillmentType === "delivery" ? body.delivery?.addressLine1 : null,
      address_line2: fulfillmentType === "delivery" ? body.delivery?.addressLine2 ?? null : null,
      items: normalizedItems.map((i) => ({
        product_id: i.productId,
        name_ja: i.name_ja,
        name_en: i.name_en,
        quantity: i.quantity,
        unit_price: i.unitPrice,
        image_url: i.image_url,
        variant: i.variant,
      })),
      subtotal,
      delivery_fee: deliveryFee,
      tax,
      total,
      payment_status: "pending",
      order_status: "confirmed",
      currency: "JPY",
    };

    const { data: createdOrder, error: createOrderError } = await supabase
      .from("orders")
      .insert(orderInsert)
      .select("id, order_number")
      .single();

    if (createOrderError) {
      return NextResponse.json({ error: createOrderError.message }, { status: 500 });
    }

    const orderItemsInsert = normalizedItems.map((i) => ({
      order_id: createdOrder.id,
      product_id: i.productId,
      product_name_ja: i.name_ja,
      product_name_en: i.name_en,
      variant: i.variant,
      quantity: i.quantity,
      unit_price: i.unitPrice,
      line_total: i.lineTotal,
      image_url: i.image_url,
    }));

    const { error: createItemsError } = await supabase
      .from("order_items")
      .insert(orderItemsInsert);

    if (createItemsError) {
      return NextResponse.json({ error: createItemsError.message }, { status: 500 });
    }

    for (const item of items) {
      const p = productMap.get(item.productId);
      if (!p) continue;
      const newQty = Math.max(0, p.stock_quantity - item.quantity);
      await supabase.from("products").update({ stock_quantity: newQty }).eq("id", p.id);
    }

    try {
      await sendOrderConfirmationEmail({
        to: body.customer.email,
        customerName: `${body.customer.lastName} ${body.customer.firstName}`,
        orderNumber: createdOrder.order_number,
        pickupDate: fulfillmentType === "pickup" ? pickupDate : "配送予定",
        pickupSlot: fulfillmentType === "pickup" ? pickupSlot : "配送",
        total,
        currency: "JPY",
        items: normalizedItems.map((i) => ({
          nameJa: i.name_ja,
          quantity: i.quantity,
          lineTotal: i.lineTotal,
        })),
      });
    } catch (emailError) {
      // Do not fail order creation when email delivery fails.
      console.error("Order confirmation email failed", emailError);
    }

    return NextResponse.json({
      id: createdOrder.id,
      orderNumber: createdOrder.order_number,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
