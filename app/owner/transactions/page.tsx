import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";

type Tx = {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  provider: string;
  method: string | null;
  reference: string | null;
  processed_at: string | null;
  created_at: string;
};

type Bucket = {
  label: string;
  amount: number;
};

function toDateIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

function weekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildDailyBuckets(txs: Tx[], days: number): Bucket[] {
  const map = new Map<string, number>();
  const now = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = toDateIso(d);
    map.set(key, 0);
  }

  for (const tx of txs) {
    if (tx.status !== "paid") continue;
    const d = new Date(tx.processed_at ?? tx.created_at);
    const key = toDateIso(d);
    if (!map.has(key)) continue;
    map.set(key, (map.get(key) ?? 0) + tx.amount);
  }

  return Array.from(map.entries()).map(([label, amount]) => ({ label, amount }));
}

function buildWeeklyBuckets(txs: Tx[], weeks: number): Bucket[] {
  const map = new Map<string, number>();
  const now = new Date();
  const currentStart = weekStart(now);

  for (let i = weeks - 1; i >= 0; i -= 1) {
    const d = new Date(currentStart);
    d.setDate(currentStart.getDate() - i * 7);
    const key = toDateIso(d);
    map.set(key, 0);
  }

  for (const tx of txs) {
    if (tx.status !== "paid") continue;
    const d = weekStart(new Date(tx.processed_at ?? tx.created_at));
    const key = toDateIso(d);
    if (!map.has(key)) continue;
    map.set(key, (map.get(key) ?? 0) + tx.amount);
  }

  return Array.from(map.entries()).map(([label, amount]) => ({ label, amount }));
}

function buildMonthlyBuckets(txs: Tx[], months: number): Bucket[] {
  const map = new Map<string, number>();
  const now = new Date();

  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    map.set(monthKey(d), 0);
  }

  for (const tx of txs) {
    if (tx.status !== "paid") continue;
    const d = new Date(tx.processed_at ?? tx.created_at);
    const key = monthKey(d);
    if (!map.has(key)) continue;
    map.set(key, (map.get(key) ?? 0) + tx.amount);
  }

  return Array.from(map.entries()).map(([label, amount]) => ({ label, amount }));
}

function BarChart({ buckets, title }: { buckets: Bucket[]; title: string }) {
  const max = Math.max(1, ...buckets.map((b) => b.amount));

  return (
    <div className="rounded-xl border border-brand-cream-dark bg-white p-4 shadow-sm">
      <h3 className="font-serif text-base font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-2">
        {buckets.map((b) => (
          <div key={b.label} className="grid grid-cols-[84px_1fr_auto] items-center gap-2">
            <span className="font-sans text-xs text-muted-foreground">{b.label}</span>
            <div className="h-2.5 rounded-full bg-brand-cream overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-red"
                style={{ width: `${Math.max(2, (b.amount / max) * 100)}%` }}
              />
            </div>
            <span className="font-sans text-xs font-semibold text-foreground">{formatPrice(b.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function OwnerTransactionsPage() {
  const tOwner = await getTranslations("owner");
  const t = await getTranslations("ownerFinance");
  const supabase = createAdminClient() as any;

  const { data, error } = await supabase
    .from("payment_transactions")
    .select("id, order_id, amount, currency, status, provider, method, reference, processed_at, created_at")
    .order("created_at", { ascending: false })
    .limit(3000);

  const txs = (data ?? []) as Tx[];
  const orderIds = Array.from(new Set(txs.map((x) => x.order_id).filter(Boolean)));
  const { data: orderRows } = await supabase
    .from("orders")
    .select("id, order_number, customer_name")
    .in("id", orderIds.length ? orderIds : ["00000000-0000-0000-0000-000000000000"]);

  const orderMap = new Map<string, { order_number: string | null; customer_name: string | null }>();
  for (const o of orderRows ?? []) {
    orderMap.set(o.id, { order_number: o.order_number, customer_name: o.customer_name });
  }

  const paid = txs.filter((x) => x.status === "paid");
  const refunded = txs.filter((x) => x.status === "refunded");

  const grossPaid = paid.reduce((s, x) => s + x.amount, 0);
  const refundTotal = refunded.reduce((s, x) => s + x.amount, 0);
  const netRevenue = grossPaid - refundTotal;

  const now = new Date();
  const todayKey = toDateIso(now);
  const weekKey = toDateIso(weekStart(now));
  const monthNow = monthKey(now);

  const todayPaid = paid
    .filter((x) => toDateIso(new Date(x.processed_at ?? x.created_at)) === todayKey)
    .reduce((s, x) => s + x.amount, 0);
  const weekPaid = paid
    .filter((x) => toDateIso(weekStart(new Date(x.processed_at ?? x.created_at))) === weekKey)
    .reduce((s, x) => s + x.amount, 0);
  const monthPaid = paid
    .filter((x) => monthKey(new Date(x.processed_at ?? x.created_at)) === monthNow)
    .reduce((s, x) => s + x.amount, 0);

  const daily = buildDailyBuckets(txs, 14);
  const weekly = buildWeeklyBuckets(txs, 12);
  const monthly = buildMonthlyBuckets(txs, 12);

  return (
    <div className="min-h-screen bg-brand-cream py-8">
      <div className="container-padded max-w-7xl space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="font-sans text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link href="/owner/orders" className="btn-secondary">{tOwner("ordersTitle")}</Link>
            <Link href="/owner/payments" className="btn-secondary">{tOwner("pendingPayments")}</Link>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="font-sans text-sm text-red-700">{error.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="rounded-xl border border-brand-cream-dark bg-white p-4 shadow-sm">
            <p className="font-sans text-xs text-muted-foreground">{t("grossPaid")}</p>
            <p className="font-serif text-xl font-bold text-foreground mt-1">{formatPrice(grossPaid)}</p>
          </div>
          <div className="rounded-xl border border-brand-cream-dark bg-white p-4 shadow-sm">
            <p className="font-sans text-xs text-muted-foreground">{t("refunds")}</p>
            <p className="font-serif text-xl font-bold text-foreground mt-1">{formatPrice(refundTotal)}</p>
          </div>
          <div className="rounded-xl border border-brand-cream-dark bg-white p-4 shadow-sm">
            <p className="font-sans text-xs text-muted-foreground">{t("netRevenue")}</p>
            <p className="font-serif text-xl font-bold text-brand-red mt-1">{formatPrice(netRevenue)}</p>
          </div>
          <div className="rounded-xl border border-brand-cream-dark bg-white p-4 shadow-sm">
            <p className="font-sans text-xs text-muted-foreground">{t("today")}</p>
            <p className="font-serif text-xl font-bold text-foreground mt-1">{formatPrice(todayPaid)}</p>
          </div>
          <div className="rounded-xl border border-brand-cream-dark bg-white p-4 shadow-sm">
            <p className="font-sans text-xs text-muted-foreground">{t("thisMonth")}</p>
            <p className="font-serif text-xl font-bold text-foreground mt-1">{formatPrice(monthPaid)}</p>
            <p className="font-sans text-[11px] text-muted-foreground mt-1">{t("thisWeek")}: {formatPrice(weekPaid)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <BarChart buckets={daily} title={t("byDay")} />
          <BarChart buckets={weekly} title={t("byWeek")} />
          <BarChart buckets={monthly} title={t("byMonth")} />
        </div>

        <div className="rounded-2xl border border-brand-cream-dark bg-white overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-brand-cream-dark bg-brand-cream">
            <h2 className="font-serif text-lg font-semibold text-foreground">{t("recentTransactions")}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-brand-cream border-b border-brand-cream-dark">
                <tr>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("time")}</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("order")}</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("customer")}</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("amount")}</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("status")}</th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("provider")}</th>
                </tr>
              </thead>
              <tbody>
                {txs.slice(0, 200).map((tx) => {
                  const order = orderMap.get(tx.order_id);
                  return (
                    <tr key={tx.id} className="border-b border-brand-cream-dark last:border-0 hover:bg-brand-cream/30">
                      <td className="px-4 py-3">
                        <p className="font-sans text-sm text-foreground">
                          {new Date(tx.processed_at ?? tx.created_at).toLocaleString("ja-JP")}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/owner/orders/${tx.order_id}`} className="font-sans text-sm font-semibold text-brand-red hover:underline">
                          {order?.order_number ?? tx.order_id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-sans text-sm text-foreground">{order?.customer_name ?? "-"}</p>
                      </td>
                      <td className="px-4 py-3 font-sans text-sm font-semibold text-foreground">
                        {formatPrice(tx.amount ?? 0)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 font-sans text-xs text-blue-700">
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-sans text-xs text-muted-foreground">{tx.provider}{tx.method ? ` / ${tx.method}` : ""}</p>
                        {tx.reference ? <p className="font-sans text-[11px] text-muted-foreground mt-0.5">{tx.reference}</p> : null}
                      </td>
                    </tr>
                  );
                })}
                {txs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center">
                      <p className="font-sans text-sm text-muted-foreground">{t("noTransactions")}</p>
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
