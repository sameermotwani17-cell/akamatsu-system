import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isOwnerUser } from "@/lib/auth/owner";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Params) {
  const authClient = await createClient();
  const { data: authData } = await authClient.auth.getUser();
  if (!authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isOwnerUser(authData.user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const payload = (await req.json()) as {
    orderStatus?: "confirmed" | "ready" | "completed" | "cancelled";
    paymentStatus?: "pending" | "paid" | "failed" | "refunded";
    archiveAction?: "archive" | "reopen";
    pickedUp?: boolean;
  }; 

  if (!payload.orderStatus && !payload.paymentStatus && !payload.archiveAction && typeof payload.pickedUp !== "boolean") {
    return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
  }

  const updateData: Record<string, string | null> = {};
  const nowIso = new Date().toISOString();
  // TODO: Replace with strict table typings after regenerating `types/database.ts`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;

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

  if (payload.archiveAction === "archive") {
    updateData.archived_at = nowIso;
  }

  if (payload.archiveAction === "reopen") {
    updateData.archived_at = null;
    const { data: currentOrder } = await supabase
      .from("orders")
      .select("order_status")
      .eq("id", id)
      .maybeSingle();

    if (currentOrder && ["completed", "cancelled"].includes(currentOrder.order_status)) {
      updateData.order_status = "confirmed";
      updateData.delivered_at = null;
    }
  }

  if (payload.pickedUp === true) {
    updateData.delivered_at = nowIso;
    updateData.order_status = "completed";
    updateData.archived_at = nowIso;
  }

  if (payload.pickedUp === false) {
    updateData.delivered_at = null;
    updateData.archived_at = null;

    const { data: currentOrder } = await supabase
      .from("orders")
      .select("order_status")
      .eq("id", id)
      .maybeSingle();

    if (currentOrder?.order_status === "completed") {
      updateData.order_status = "ready";
    }
  }

  updateData.updated_at = nowIso;

  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", id)
    .select("id, order_number, order_status, payment_status, archived_at, packed_at, delivered_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (payload.paymentStatus === "paid") {
    const { data: existingPaidTx } = await supabase
      .from("payment_transactions")
      .select("id")
      .eq("order_id", id)
      .eq("status", "paid")
      .limit(1);

    const { data: currentOrder } = await supabase
      .from("orders")
      .select("id, total")
      .eq("id", id)
      .maybeSingle();

    if (currentOrder && !existingPaidTx?.length) {
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
