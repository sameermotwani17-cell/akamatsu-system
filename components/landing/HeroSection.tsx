"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    bg: "linear-gradient(145deg, #2C1A08 0%, #4A2E14 45%, #7A5235 100%)",
    tag: "創業85年 · 地域密着の自然食品店",
    headline: ["この町の", "いいもの。"],
    body: "地元のお客様に愛され続けて85年。信頼できる自然食品と調味料を、毎日の食卓へお届けします。",
    cta: { label: "商品を見る", href: "/shop" },
    ctaSub: { label: "店舗情報", href: "#store" },
    accentColor: "#C9A84C",
  },
  {
    bg: "linear-gradient(145deg, #0D2B0A 0%, #1F4A1B 45%, #2D6B28 100%)",
    tag: "みそ · 醤油 · 塩 · だし · 発酵食品",
    headline: ["本物の味を、", "あなたの台所へ。"],
    body: "厳選された国産素材と伝統製法。日常に寄り添う調味料を、丁寧に取り揃えています。",
    cta: { label: "調味料を見る", href: "/shop?category=health" },
    ctaSub: { label: "商品一覧へ", href: "/shop" },
    accentColor: "#A8D4A0",
  },
  {
    bg: "linear-gradient(145deg, #2C0F05 0%, #5C2810 45%, #8B3A20 100%)",
    tag: "店頭受取 · 地域配達 · 全国発送（ゆうパック）",
    headline: ["毎日の食卓に、", "安心を。"],
    body: "地元のお客様には店頭受取・配達で。遠方のお客様にはゆうパックでお届けします。",
    cta: { label: "ご注文はこちら", href: "/shop" },
    ctaSub: { label: "配送について", href: "/shop" },
    accentColor: "#E8C76A",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const currentRef = useRef(0);

  const goTo = (index: number) => {
    if (index === currentRef.current) return;
    setVisible(false);
    setTimeout(() => {
      setCurrent(index);
      currentRef.current = index;
      setVisible(true);
    }, 360);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (currentRef.current + 1) % SLIDES.length;
      goTo(next);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section
      className="relative flex min-h-[88vh] items-center overflow-hidden"
      aria-label="Hero"
      style={{ background: slide.bg, transition: "background 0.9s ease" }}
    >
      {/* Wood-grain texture overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ opacity: 0.05 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="woodgrain" x="0" y="0" width="100" height="6" patternUnits="userSpaceOnUse">
              <line x1="0" y1="1" x2="100" y2="2.5" stroke="white" strokeWidth="0.8" />
              <line x1="0" y1="3.5" x2="100" y2="4.8" stroke="white" strokeWidth="1.2" />
              <line x1="0" y1="5.5" x2="100" y2="5.8" stroke="white" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#woodgrain)" />
        </svg>
      </div>

      {/* Decorative circle rings */}
      <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none" aria-hidden="true" style={{ opacity: 0.08 }}>
        <svg viewBox="0 0 600 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <circle cx="500" cy="200" r="350" stroke="white" strokeWidth="1" />
          <circle cx="400" cy="500" r="280" stroke="white" strokeWidth="1" />
          <circle cx="300" cy="150" r="200" stroke="white" strokeWidth="1" />
          <circle cx="550" cy="620" r="220" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Slide content */}
      <div
        className="relative z-10 container-padded w-full py-24 lg:py-32"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.45s ease, transform 0.45s ease",
        }}
      >
        <div className="max-w-2xl">
          {/* Tag pill */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
            }}
          >
            <span className="font-sans text-xs font-medium tracking-wide text-white/90">
              {slide.tag}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif font-bold text-white leading-tight"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 1.15 }}
          >
            {slide.headline[0]}
            <br />
            {slide.headline[1]}
          </h1>

          {/* Accent bar */}
          <div
            className="mt-6 mb-6 h-0.5 w-16 rounded-full"
            style={{ background: slide.accentColor }}
          />

          {/* Body */}
          <p className="font-sans text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
            {slide.body}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href={slide.cta.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-sans font-semibold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{ background: "#FFFDF9", color: "#5C3D20" }}
            >
              {slide.cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={slide.ctaSub.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-sans font-medium text-sm text-white transition-all hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{ border: "2px solid rgba(255,255,255,0.35)" }}
            >
              {slide.ctaSub.label}
            </Link>
          </div>
        </div>
      </div>

      {/* Prev arrow */}
      <button
        onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-2.5 text-white/60 transition-all hover:bg-white/15 hover:text-white focus-visible:outline-none"
        aria-label="前のスライド"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Next arrow */}
      <button
        onClick={() => goTo((current + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-2.5 text-white/60 transition-all hover:bg-white/15 hover:text-white focus-visible:outline-none"
        aria-label="次のスライド"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
            style={{
              width: i === current ? "2rem" : "0.5rem",
              height: "0.5rem",
              background: i === current ? "#FFFDF9" : "rgba(255,255,255,0.38)",
            }}
            aria-label={`スライド ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
          />
        ))}
      </div>

      {/* Bottom wave — matches new background */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F6F0E8" />
        </svg>
      </div>
    </section>
  );
}
