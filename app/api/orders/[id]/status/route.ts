import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Params) {
  const authClient = await createClient();
  const { data: authData } = await authClient.auth.getUser();
  if (!authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = (await req.json()) as {
    orderStatus?: "confirmed" | "ready" | "completed" | "cancelled";
    paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  };

  if (!payload.orderStatus && !payload.paymentStatus) {
    return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
  }

  const updateData: Record<string, string | null> = {};
  const nowIso = new Date().toISOString();

  if (payload.orderStatus) updateData.order_status = payload.orderStatus;
  if (payload.paymentStatus) updateData.payment_status = payload.paymentStatus;
  if (payload.orderStatus === "ready") {
    updateData.packed_at = nowIso;
    updateData.archived_at = null;
  }
  if (payload.orderStatus === "completed") {
    updateData.delivered_at = nowIso;
    updateData.archived_at = nowIso;
  }
  if (payload.orderStatus === "cancelled") {
    updateData.archived_at = nowIso;
  }
  updateData.updated_at = nowIso;

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

  if (payload.paymentStatus === "paid") {
    const { data: currentOrder } = await supabase
      .from("orders")
      .select("id, total")
      .eq("id", id)
      .maybeSingle();

    if (currentOrder) {
      await supabase.from("payment_transactions").insert({
        order_id: currentOrder.id,
        provider: "manual",
        method: "admin_mark_paid",
        status: "paid",
        amount: currentOrder.total,
        currency: "JPY",
        reference: `manual-${currentOrder.id}`,
        processed_at: nowIso,
        metadata: { source: "owner-dashboard" },
        updated_at: nowIso,
      });
    }
  }

  return NextResponse.json({ order: data });
}
