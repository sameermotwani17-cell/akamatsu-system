"use client";

import { useState } from "react";

type Props = {
  orderId: string;
  initialOrderStatus: "confirmed" | "ready" | "completed" | "cancelled";
  initialPaymentStatus: "pending" | "paid" | "failed" | "refunded";
};

export function OrderStatusForm({
  orderId,
  initialOrderStatus,
  initialPaymentStatus,
}: Props) {
  const [orderStatus, setOrderStatus] = useState(initialOrderStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      if (!res.ok) throw new Error(json.error || "Update failed");
      setMessage("Status updated");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Update failed";
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-brand-cream-dark bg-white p-4 space-y-3">
      <h3 className="font-serif text-lg font-semibold text-foreground">Update Status</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="font-sans text-sm text-foreground">
          <span className="block mb-1.5">Order Status</span>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value as Props["initialOrderStatus"])}
            className="w-full rounded-lg border border-brand-cream-dark bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-red"
          >
            <option value="confirmed">confirmed</option>
            <option value="ready">ready</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </label>

        <label className="font-sans text-sm text-foreground">
          <span className="block mb-1.5">Payment Status</span>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as Props["initialPaymentStatus"])}
            className="w-full rounded-lg border border-brand-cream-dark bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-red"
          >
            <option value="pending">pending</option>
            <option value="paid">paid</option>
            <option value="failed">failed</option>
            <option value="refunded">refunded</option>
          </select>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {message && (
          <p className="font-sans text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}
