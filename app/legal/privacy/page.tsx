import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "赤松 Health & Lifestyle のプライバシーポリシーページです。",
};

export default function PrivacyPolicyPage() {
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

        <div className="rounded-2xl bg-white border border-brand-cream-dark p-8 shadow-sm space-y-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
              プライバシーポリシー
            </h1>
            <p className="font-sans text-sm text-muted-foreground">
              Privacy Policy — 最終更新: 2024年1月1日
            </p>
          </div>

          {[
            {
              title: "1. 個人情報の収集について",
              content: `赤松 Health & Lifestyle 株式会社（以下「当社」）は、お客様から以下の個人情報を収集します。

• 氏名（姓・名）
• メールアドレス
• 電話番号
• 注文情報（ご購入商品・金額・受取日時）
• 決済情報（カード番号はトークン化され、当社サーバーには保存されません）`,
            },
            {
              title: "2. 個人情報の利用目的",
              content: `収集した個人情報は、以下の目的に限り利用します。

• 注文処理・確認メールの送信
• 店舗受取の手続き
• お客様サポートへの対応
• 当社サービスの改善・分析
• 法令に基づく対応`,
            },
            {
              title: "3. 個人情報の第三者提供",
              content: `当社は、以下の場合を除き、お客様の個人情報を第三者に提供しません。

• お客様の同意がある場合
• 法令に基づく場合
• 決済処理業者（AirPay）への必要最低限の情報提供（PCI DSS準拠）`,
            },
            {
              title: "4. 個人情報の安全管理",
              content: `当社は、個人情報の漏洩・紛失・改ざん等を防止するため、適切なセキュリティ措置を講じます。SSL暗号化通信の使用、アクセス権限の管理、定期的なセキュリティ監査を実施しています。`,
            },
            {
              title: "5. Cookieの使用について",
              content: `当社ウェブサイトでは、ショッピングカートの機能維持・サービス改善のためにCookieを使用します。ブラウザの設定によりCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。`,
            },
            {
              title: "6. 個人情報の開示・訂正・削除",
              content: `お客様は、当社が保有する個人情報の開示・訂正・削除を求めることができます。ご請求はinfo@akamatsu-health.jp までメールにてお問い合わせください。本人確認後、合理的な期間内に対応いたします。`,
            },
            {
              title: "7. 未成年者の個人情報",
              content: `当社のサービスは、18歳未満の方のご利用に際して、保護者の同意が必要です。18歳未満の方から個人情報を収集した場合、保護者の方にご確認の上、適切に対応します。`,
            },
            {
              title: "8. プライバシーポリシーの変更",
              content: `当社は、法令の変更やサービス内容の変更に伴い、本ポリシーを改定することがあります。改定後はウェブサイトに掲載し、重要な変更の場合は登録メールアドレスにご通知します。`,
            },
            {
              title: "9. お問い合わせ",
              content: `個人情報の取扱いに関するお問い合わせは、下記までご連絡ください。\n\n赤松 Health & Lifestyle 株式会社 個人情報担当\ninfo@akamatsu-health.jp\n〒150-0001 東京都渋谷区神宮前1-2-3`,
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-base font-semibold text-foreground mb-3">
                {section.title}
              </h2>
              <p className="font-sans text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
