import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";

export default async function OwnerPaymentsPage() {
  const t = await getTranslations("owner");
  const supabase = createAdminClient() as any;

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, email, total, payment_status, created_at")
    .eq("payment_status", "pending")
    .order("created_at", { ascending: false })
    .limit(300);

  return (
    <div className="min-h-screen bg-brand-cream py-8">
      <div className="container-padded max-w-6xl">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-foreground">{t("pendingPayments")}</h1>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            {t("paymentsSubtitle")}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link href="/owner/transactions" className="btn-secondary">
              {t("financeDashboard")}
            </Link>
          </div>
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
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("order")}</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("customer")}</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("total")}</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((item: any) => (
                  <tr key={item.id} className="border-b border-brand-cream-dark last:border-0 hover:bg-brand-cream/30">
                    <td className="px-4 py-3">
                      <Link href={`/owner/orders/${item.id}`} className="font-sans text-sm font-semibold text-brand-red hover:underline">
                        {item.order_number ?? item.id}
                      </Link>
                      <p className="font-sans text-xs text-muted-foreground mt-0.5">
                        {new Date(item.created_at).toLocaleString("ja-JP")}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-sans text-sm font-medium text-foreground">{item.customer_name}</p>
                      <p className="font-sans text-xs text-muted-foreground">{item.email}</p>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm font-semibold text-foreground">
                      {formatPrice(item.total ?? 0)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 font-sans text-xs text-blue-700">
                        {t(`paymentStatus_${item.payment_status}`)}
                      </span>
                    </td>
                  </tr>
                ))}
                {(data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center">
                      <p className="font-sans text-sm text-muted-foreground">{t("noPendingPayments")}</p>
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
