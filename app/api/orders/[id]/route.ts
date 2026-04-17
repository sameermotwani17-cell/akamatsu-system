import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const req = _;
  const { id } = await params;
  const url = new URL(req.url);
  const orderNumber = url.searchParams.get("orderNumber");

  if (!orderNumber) {
    return NextResponse.json({ error: "Missing orderNumber" }, { status: 400 });
  }

  const supabase = createAdminClient() as any;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { data: items, error: itemError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  if (itemError) {
    return NextResponse.json({ error: itemError.message }, { status: 500 });
  }

  return NextResponse.json({ order, items: items ?? [] });
}
