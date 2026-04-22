import Link from "next/link";
import { useTranslations } from "next-intl";
import { Leaf } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export function Footer() {
  const tf = useTranslations("footer");
  const tt = useTranslations("trust");

  return (
    <footer style={{ background: "#231810" }} className="text-white">
      <div className="container-padded py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: "#7A5235" }}
              >
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-serif text-xl font-semibold text-white leading-none">
                  赤松
                </span>
                <span className="block font-sans text-[10px] text-white/60 uppercase tracking-widest leading-none mt-0.5">
                  自然食品・調味料
                </span>
              </div>
            </div>
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              {tf("tagline")}
              <br />
              {tf("tagline_en")}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label={tf("instagram")}
                className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label={tf("twitter")}
                className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              商品カテゴリ
            </h3>
            <ul className="space-y-2.5">
              {["health", "beauty", "supplements", "wellness", "lifestyle"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/shop?category=${cat}`}
                    className="font-sans text-sm text-white/60 transition-colors hover:text-brand-gold"
                  >
                    {cat === "health" && "みそ・発酵食品"}
                    {cat === "beauty" && "醤油・塩"}
                    {cat === "supplements" && "だし・調味料"}
                    {cat === "wellness" && "油・酢"}
                    {cat === "lifestyle" && "甘酒・飲料"}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Information
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/legal/tokusho"
                  className="font-sans text-sm text-white/60 hover:text-brand-gold transition-colors"
                >
                  {tf("tokusho")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="font-sans text-sm text-white/60 hover:text-brand-gold transition-colors"
                >
                  {tf("privacy_policy")}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@akamatsu-shizen.jp"
                  className="font-sans text-sm text-white/60 hover:text-brand-gold transition-colors"
                >
                  {tf("contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              店舗情報
            </h3>
            <div className="space-y-2 font-sans text-sm text-white/60">
              <p>{tf("store_address")}</p>
              <p className="mt-3">{tf("store_hours")}</p>
              <p>{tf("store_closed")}</p>
              <p className="mt-3">{tf("store_tel")}</p>
            </div>
          </div>
        </div>

        {/* Trust badges + copyright */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white/75 border border-white/15" style={{ background: "rgba(122,82,53,0.3)" }}>
              🌿 無添加・自然食品
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white/75 border border-white/15" style={{ background: "rgba(45,90,39,0.3)" }}>
              🏡 地域密着85年
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white/75 border border-white/15" style={{ background: "rgba(45,90,39,0.25)" }}>
              🚚 ゆうパック全国発送
            </span>
          </div>
          <p className="font-sans text-xs text-white/40">
            {tf("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
