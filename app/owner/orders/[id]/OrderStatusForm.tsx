"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  orderId: string;
  initialOrderStatus: "confirmed" | "ready" | "completed" | "cancelled";
  initialPaymentStatus: "pending" | "paid" | "failed" | "refunded";
  initialArchived: boolean;
};

export function OrderStatusForm({
  orderId,
  initialOrderStatus,
  initialPaymentStatus,
  initialArchived,
}: Props) {
  const t = useTranslations("ownerStatus");
  const [orderStatus, setOrderStatus] = useState(initialOrderStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [isArchived, setIsArchived] = useState(initialArchived);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const quickAction = async (next: {
    orderStatus?: Props["initialOrderStatus"];
    paymentStatus?: Props["initialPaymentStatus"];
    archiveAction?: "archive" | "reopen";
  }) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("updateFailed"));
      if (next.orderStatus) setOrderStatus(next.orderStatus);
      if (next.paymentStatus) setPaymentStatus(next.paymentStatus);
      if (typeof json?.order?.archived_at !== "undefined") {
        setIsArchived(Boolean(json.order.archived_at));
      }
      setMessage(t("statusUpdated"));
    } catch (error) {
      const msg = error instanceof Error ? error.message : t("updateFailed");
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  const onSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("updateFailed"));
      if (typeof json?.order?.archived_at !== "undefined") {
        setIsArchived(Boolean(json.order.archived_at));
      }
      setMessage(t("statusUpdated"));
    } catch (error) {
      const msg = error instanceof Error ? error.message : t("updateFailed");
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-brand-cream-dark bg-white p-4 space-y-3">
      <h3 className="font-serif text-lg font-semibold text-foreground">{t("updateStatus")}</h3>
      <p className="font-sans text-xs text-muted-foreground">
        {t("archiveState")}: {isArchived ? t("archived") : t("active")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="font-sans text-sm text-foreground">
          <span className="block mb-1.5">{t("orderStatus")}</span>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value as Props["initialOrderStatus"])}
            className="w-full rounded-lg border border-brand-cream-dark bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-red"
          >
            <option value="confirmed">{t("orderStatusConfirmed")}</option>
            <option value="ready">{t("orderStatusReady")}</option>
            <option value="completed">{t("orderStatusCompleted")}</option>
            <option value="cancelled">{t("orderStatusCancelled")}</option>
          </select>
        </label>

        <label className="font-sans text-sm text-foreground">
          <span className="block mb-1.5">{t("paymentStatus")}</span>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as Props["initialPaymentStatus"])}
            className="w-full rounded-lg border border-brand-cream-dark bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-red"
          >
            <option value="pending">{t("paymentStatusPending")}</option>
            <option value="paid">{t("paymentStatusPaid")}</option>
            <option value="failed">{t("paymentStatusFailed")}</option>
            <option value="refunded">{t("paymentStatusRefunded")}</option>
          </select>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? t("saving") : t("save")}
        </button>
        {message && (
          <p className="font-sans text-sm text-muted-foreground">{message}</p>
        )}
      </div>

      <div className="pt-2 border-t border-brand-cream-dark">
        <p className="font-sans text-sm font-medium text-foreground mb-2">{t("quickActions")}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => quickAction({ orderStatus: "ready" })}
            disabled={saving}
            className="btn-secondary"
          >
            {t("markPacked")}
          </button>
          <button
            onClick={() => quickAction({ orderStatus: "completed" })}
            disabled={saving}
            className="btn-secondary"
          >
            {t("markDelivered")}
          </button>
          <button
            onClick={() => quickAction({ paymentStatus: "paid" })}
            disabled={saving}
            className="btn-secondary"
          >
            {t("markPaid")}
          </button>
          {!isArchived ? (
            <button
              onClick={() => quickAction({ archiveAction: "archive" })}
              disabled={saving}
              className="btn-secondary"
            >
              {t("archive")}
            </button>
          ) : (
            <button
              onClick={() => quickAction({ archiveAction: "reopen" })}
              disabled={saving}
              className="btn-secondary"
            >
              {t("reopen")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
