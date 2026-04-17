import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const authClient = await createClient();
  const { data: authData } = await authClient.auth.getUser();

  if (!authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient() as any;

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, email, total, payment_status, order_status, created_at")
    .eq("payment_status", "pending")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: data ?? [],
    note: "Payment provider integration skeleton route. Replace with provider-backed source later.",
  });
}
