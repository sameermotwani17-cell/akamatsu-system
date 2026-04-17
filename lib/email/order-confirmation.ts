type EmailOrderItem = {
  nameJa: string;
  quantity: number;
  lineTotal: number;
};

type SendOrderConfirmationInput = {
  to: string;
  customerName: string;
  orderNumber: string;
  pickupDate: string;
  pickupSlot: string;
  total: number;
  currency?: string;
  items: EmailOrderItem[];
};

function formatJpy(amount: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount);
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailText(input: SendOrderConfirmationInput) {
  const itemLines = input.items
    .map((item) => `- ${item.nameJa} x${item.quantity} (${formatJpy(item.lineTotal)})`)
    .join("\n");

  return [
    `${input.customerName} 様`,
    "",
    "ご注文ありがとうございます。",
    `注文番号: ${input.orderNumber}`,
    `受取日: ${input.pickupDate}`,
    `受取時間: ${input.pickupSlot}`,
    "",
    "ご注文内容:",
    itemLines,
    "",
    `合計: ${formatJpy(input.total)}`,
    "",
    "このメールは自動送信です。",
  ].join("\n");
}

function buildEmailHtml(input: SendOrderConfirmationInput) {
  const qrValue = encodeURIComponent(input.orderNumber);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrValue}`;
  const itemRows = input.items
    .map(
      (item) =>
        `<tr><td style=\"padding:8px 0;\">${escapeHtml(item.nameJa)} x${item.quantity}</td><td style=\"padding:8px 0;text-align:right;\">${formatJpy(item.lineTotal)}</td></tr>`
    )
    .join("");

  return `
  <div style="font-family: 'Noto Sans JP', system-ui, -apple-system, sans-serif; color: #2C2416; line-height: 1.6;">
    <h2 style="margin:0 0 12px; color:#C0392B;">ご注文ありがとうございます</h2>
    <p style="margin:0 0 8px;">${escapeHtml(input.customerName)} 様</p>
    <p style="margin:0 0 16px;">ご注文を受け付けました。</p>
    <div style="background:#FAF7F2; border:1px solid #EDE8DF; border-radius:12px; padding:12px 14px; margin-bottom:16px;">
      <p style="margin:0;"><strong>注文番号:</strong> ${escapeHtml(input.orderNumber)}</p>
      <p style="margin:0;"><strong>受取日:</strong> ${escapeHtml(input.pickupDate)}</p>
      <p style="margin:0;"><strong>受取時間:</strong> ${escapeHtml(input.pickupSlot)}</p>
    </div>
    <div style="margin:0 0 16px; border:1px solid #EDE8DF; border-radius:12px; padding:12px; text-align:center; background:#FFFFFF;">
      <p style="margin:0 0 8px; color:#7A6A58; font-size:13px;">店頭でこのQRコードをご提示ください / Show this QR code in-store</p>
      <img src="${qrImageUrl}" width="170" height="170" alt="Order QR ${escapeHtml(input.orderNumber)}" style="display:block; margin:0 auto 8px; border-radius:10px; border:1px solid #EDE8DF;" />
      <p style="margin:0; font-family: 'Courier New', monospace; font-weight:700; letter-spacing:1px;">${escapeHtml(input.orderNumber)}</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:12px;">
      <tbody>${itemRows}</tbody>
    </table>
    <p style="margin:0 0 10px;"><strong>合計:</strong> ${formatJpy(input.total)}</p>
    <p style="margin:0; font-size:12px; color:#7A6A58;">このメールは自動送信です。</p>
  </div>
  `.trim();
}

export async function sendOrderConfirmationEmail(input: SendOrderConfirmationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_CONFIRMATION_FROM || "Akamatsu <onboarding@resend.dev>";

  if (!apiKey) {
    return { sent: false as const, reason: "missing-config" as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: `【赤松】ご注文確認 ${input.orderNumber}`,
      text: buildEmailText(input),
      html: buildEmailHtml(input),
      reply_to: process.env.ORDER_CONFIRMATION_REPLY_TO || undefined,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error: ${response.status} ${body}`);
  }

  return { sent: true as const };
}
