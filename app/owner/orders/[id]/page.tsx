import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";
import { OrderStatusForm } from "./OrderStatusForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OwnerOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient() as any;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { data: items, error: itemError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  if (orderError || !order) {
    return (
      <div className="min-h-screen bg-brand-cream py-8">
        <div className="container-padded max-w-3xl">
          <p className="font-sans text-red-600">
            {orderError?.message || "Order not found"}
          </p>
          <Link href="/owner/orders" className="btn-secondary inline-flex mt-4">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream py-8">
      <div className="container-padded max-w-5xl space-y-5">
        <Link href="/owner/orders" className="inline-flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-brand-red transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to orders
        </Link>

        <div className="rounded-2xl border border-brand-cream-dark bg-white p-6 shadow-sm">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {order.order_number ?? order.id}
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            Created: {new Date(order.created_at).toLocaleString("ja-JP")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div className="rounded-lg bg-brand-cream border border-brand-cream-dark p-3">
              <p className="font-sans text-xs text-muted-foreground">Customer</p>
              <p className="font-sans text-sm font-semibold text-foreground">{order.customer_name}</p>
              <p className="font-sans text-xs text-muted-foreground mt-1">{order.email}</p>
              <p className="font-sans text-xs text-muted-foreground">{order.phone}</p>
            </div>
            <div className="rounded-lg bg-brand-cream border border-brand-cream-dark p-3">
              <p className="font-sans text-xs text-muted-foreground">Pickup</p>
              <p className="font-sans text-sm font-semibold text-foreground">{order.pickup_date ?? "-"}</p>
              <p className="font-sans text-xs text-muted-foreground mt-1">{order.pickup_slot ?? "-"}</p>
            </div>
          </div>
        </div>

        <OrderStatusForm
          orderId={order.id}
          initialOrderStatus={order.order_status}
          initialPaymentStatus={order.payment_status}
        />

        <div className="rounded-2xl border border-brand-cream-dark bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Items</h2>

          {itemError && (
            <p className="font-sans text-sm text-red-600 mb-3">{itemError.message}</p>
          )}

          <div className="space-y-3">
            {(items ?? []).map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 border border-brand-cream-dark rounded-xl p-3">
                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-brand-cream shrink-0">
                  <Image
                    src={item.image_url || "/placeholder-product.jpg"}
                    alt={item.product_name_ja}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-sans text-sm font-semibold text-foreground">{item.product_name_ja}</p>
                  <p className="font-sans text-xs text-muted-foreground">{item.product_name_en}</p>
                  <p className="font-sans text-xs text-muted-foreground">
                    {formatPrice(item.unit_price)} x {item.quantity}
                  </p>
                </div>
                <p className="font-serif text-sm font-semibold text-brand-red">{formatPrice(item.line_total)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-brand-cream-dark pt-4 space-y-1.5">
            <div className="flex justify-between font-sans text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal ?? 0)}</span>
            </div>
            <div className="flex justify-between font-sans text-sm text-muted-foreground">
              <span>Delivery Fee</span>
              <span>{formatPrice(order.delivery_fee ?? 0)}</span>
            </div>
            <div className="flex justify-between font-sans text-sm text-muted-foreground">
              <span>Tax</span>
              <span>{formatPrice(order.tax ?? 0)}</span>
            </div>
            <div className="flex justify-between font-serif text-base font-bold pt-2 border-t border-brand-cream-dark">
              <span>Total</span>
              <span className="text-brand-red">{formatPrice(order.total ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
