import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";

export default async function OwnerOrdersPage() {
  const supabase = createAdminClient() as any;

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, email, pickup_date, pickup_slot, total, payment_status, order_status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="min-h-screen bg-brand-cream py-8">
      <div className="container-padded max-w-6xl">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-foreground">Owner Orders</h1>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            Incoming orders dashboard (skeleton admin view)
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 mb-4">
            <p className="font-sans text-sm text-red-700">{error.message}</p>
          </div>
        )}

        <div className="rounded-2xl border border-brand-cream-dark bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-brand-cream border-b border-brand-cream-dark">
                <tr>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pickup</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {(orders ?? []).map((order: any) => (
                  <tr key={order.id} className="border-b border-brand-cream-dark last:border-0 hover:bg-brand-cream/30">
                    <td className="px-4 py-3">
                      <Link href={`/owner/orders/${order.id}`} className="font-sans text-sm font-semibold text-brand-red hover:underline">
                        {order.order_number ?? order.id}
                      </Link>
                      <p className="font-sans text-xs text-muted-foreground mt-0.5">
                        {new Date(order.created_at).toLocaleString("ja-JP")}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-sans text-sm font-medium text-foreground">{order.customer_name}</p>
                      <p className="font-sans text-xs text-muted-foreground">{order.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-sans text-sm text-foreground">{order.pickup_date ?? "-"}</p>
                      <p className="font-sans text-xs text-muted-foreground">{order.pickup_slot ?? "-"}</p>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm font-semibold text-foreground">
                      {formatPrice(order.total ?? 0)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 font-sans text-xs text-blue-700">
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 font-sans text-xs text-amber-700">
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(orders ?? []).length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center">
                      <p className="font-sans text-sm text-muted-foreground">No orders yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
