import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const payload = (await req.json()) as {
    orderStatus?: "confirmed" | "ready" | "completed" | "cancelled";
    paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  };

  if (!payload.orderStatus && !payload.paymentStatus) {
    return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
  }

  const updateData: Record<string, string> = {};
  if (payload.orderStatus) updateData.order_status = payload.orderStatus;
  if (payload.paymentStatus) updateData.payment_status = payload.paymentStatus;
  updateData.updated_at = new Date().toISOString();

  const supabase = createAdminClient() as any;
  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", id)
    .select("id, order_number, order_status, payment_status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order: data });
}
