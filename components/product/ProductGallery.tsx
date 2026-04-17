"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const safeImages = images?.length > 0 ? images : ["/placeholder-product.jpg"];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const prev = () =>
    setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setActiveIndex((i) => (i + 1) % safeImages.length);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-square overflow-hidden rounded-2xl bg-brand-cream cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={safeImages[activeIndex]}
          alt={`${productName} — image ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className={cn(
            "object-cover transition-transform duration-300",
            isZoomed && "scale-150"
          )}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }
              : undefined
          }
        />

        {/* Navigation arrows for multiple images */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {safeImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === activeIndex
                    ? "w-4 bg-brand-red"
                    : "w-1.5 bg-white/70 hover:bg-white"
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative flex-shrink-0 h-16 w-16 overflow-hidden rounded-lg border-2 transition-all",
                i === activeIndex
                  ? "border-brand-red"
                  : "border-transparent hover:border-brand-cream-dark"
              )}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
