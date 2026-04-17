import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "赤松 Health & Lifestyle の特定商取引法に基づく表記ページです。",
};

const ROWS = [
  { label: "販売業者名", value: "赤松 Health & Lifestyle 株式会社" },
  { label: "代表者名", value: "赤松 健太郎" },
  { label: "所在地", value: "〒150-0001 東京都渋谷区神宮前1-2-3 赤松ビル 1F" },
  { label: "電話番号", value: "03-XXXX-XXXX（受付時間：平日 10:00〜18:00）" },
  { label: "メールアドレス", value: "info@akamatsu-health.jp" },
  { label: "ウェブサイト", value: "https://akamatsu-health.jp" },
  { label: "販売価格", value: "各商品ページに記載の価格（消費税10%込み）" },
  { label: "販売価格以外の必要料金", value: "店舗受取の場合：配送料無料" },
  { label: "支払方法", value: "クレジットカード（VISA・Mastercard・JCB）/ AirPay" },
  { label: "支払時期", value: "注文確定時にご請求いたします。" },
  { label: "引渡し時期", value: "ご指定の受取日・時間帯に店舗にてお渡しします。" },
  { label: "返品・交換", value: "商品到着後7日以内に、商品不良・誤送品の場合のみ返品・交換を承ります。お客様都合による返品はお受けできません。" },
  { label: "返品送料", value: "商品不良・誤送品の場合：当社負担。お客様都合の場合：お客様負担。" },
  { label: "キャンセルポリシー", value: "注文確定後のキャンセルは原則お受けできません。ご不明な点はメールにてお問い合わせください。" },
  { label: "販売数量の制限", value: "一部商品については購入数量に上限を設ける場合があります。各商品ページをご確認ください。" },
  { label: "特別な販売条件", value: "なし" },
];

export default function TokushoPage() {
  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="container-padded max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-sans text-sm text-muted-foreground hover:text-brand-red transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          ホームへ戻る
        </Link>

        <div className="rounded-2xl bg-white border border-brand-cream-dark p-8 shadow-sm">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
            特定商取引法に基づく表記
          </h1>
          <p className="font-sans text-sm text-muted-foreground mb-8">
            Specified Commercial Transactions Act Disclosure
          </p>

          <div className="divide-y divide-brand-cream-dark">
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-4"
              >
                <dt className="font-sans text-sm font-semibold text-foreground sm:col-span-1">
                  {row.label}
                </dt>
                <dd className="font-sans text-sm text-foreground/80 sm:col-span-2 leading-relaxed">
                  {row.value}
                </dd>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-brand-cream border border-brand-cream-dark p-4">
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              本ページの内容は、特定商取引に関する法律第11条（通信販売についての広告）の規定に基づき記載しています。
              ご不明な点は下記メールアドレスまでお問い合わせください。
              <br />
              <a href="mailto:info@akamatsu-health.jp" className="text-brand-red hover:underline mt-1 inline-block">
                info@akamatsu-health.jp
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
