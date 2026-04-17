"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import type { NutritionData } from "@/types/database";
import { CertBadges } from "./CertBadges";
import { getDailyValuePercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

type NutritionPanelProps = {
  nutrition: NutritionData;
  ingredientsEn: string;
  ingredientsJa: string;
  certifications: string[];
  servingSize?: string;
  productName: string;
};

type NutrientRow = {
  key: keyof NutritionData;
  labelEn: string;
  labelJa: string;
  unit: string;
  color: string;
  indent?: boolean;
};

const NUTRIENT_ROWS: NutrientRow[] = [
  { key: "fat_g", labelEn: "Total Fat", labelJa: "脂質", unit: "g", color: "bg-amber-400" },
  { key: "saturated_fat_g", labelEn: "Saturated Fat", labelJa: "飽和脂肪酸", unit: "g", color: "bg-amber-300", indent: true },
  { key: "trans_fat_g", labelEn: "Trans Fat", labelJa: "トランス脂肪酸", unit: "g", color: "bg-amber-200", indent: true },
  { key: "carbs_g", labelEn: "Total Carbohydrate", labelJa: "炭水化物", unit: "g", color: "bg-red-400" },
  { key: "fiber_g", labelEn: "Dietary Fiber", labelJa: "食物繊維", unit: "g", color: "bg-blue-400", indent: true },
  { key: "sugars_g", labelEn: "Total Sugars", labelJa: "糖質", unit: "g", color: "bg-red-300", indent: true },
  { key: "protein_g", labelEn: "Protein", labelJa: "タンパク質", unit: "g", color: "bg-green-500" },
  { key: "sodium_mg", labelEn: "Sodium", labelJa: "ナトリウム", unit: "mg", color: "bg-purple-400" },
  { key: "potassium_mg", labelEn: "Potassium", labelJa: "カリウム", unit: "mg", color: "bg-blue-500" },
  { key: "iron_mg", labelEn: "Iron", labelJa: "鉄分", unit: "mg", color: "bg-orange-500" },
];

const MACRO_PILLS = [
  { key: "carbs_g" as keyof NutritionData, labelEn: "Carbs", labelJa: "炭水化物", color: "bg-red-400/20 border-red-300 text-red-700", bar: "bg-red-400" },
  { key: "protein_g" as keyof NutritionData, labelEn: "Protein", labelJa: "タンパク質", color: "bg-green-400/20 border-green-300 text-green-700", bar: "bg-green-500" },
  { key: "fat_g" as keyof NutritionData, labelEn: "Fat", labelJa: "脂質", color: "bg-amber-400/20 border-amber-300 text-amber-700", bar: "bg-amber-400" },
  { key: "fiber_g" as keyof NutritionData, labelEn: "Fiber", labelJa: "食物繊維", color: "bg-blue-400/20 border-blue-300 text-blue-700", bar: "bg-blue-400" },
];

function NutrientBar({
  value,
  max,
  color,
  delay,
  animate,
}: {
  value: number;
  max: number;
  color: string;
  delay: number;
  animate: boolean;
}) {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div className="h-1.5 w-full rounded-full bg-black/5 overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", color)}
        style={{
          width: animate ? `${pct}%` : "0%",
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}

export function NutritionPanel({
  nutrition,
  ingredientsEn,
  ingredientsJa,
  certifications,
  servingSize,
  productName,
}: NutritionPanelProps) {
  const t = useTranslations("nutrition");
  const [isOpen, setIsOpen] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Delay bar animation slightly after panel opens
      const timer = setTimeout(() => setAnimateBars(true), 150);
      return () => clearTimeout(timer);
    } else {
      setAnimateBars(false);
    }
  }, [isOpen]);

  const getMaxForKey = (key: string): number => {
    const maxMap: Record<string, number> = {
      fat_g: 78,
      saturated_fat_g: 20,
      trans_fat_g: 5,
      carbs_g: 275,
      fiber_g: 28,
      sugars_g: 50,
      protein_g: 50,
      sodium_mg: 2300,
      potassium_mg: 4700,
      iron_mg: 18,
    };
    return maxMap[key] ?? 100;
  };

  // Highlight organic ingredients in green
  const renderIngredients = (text: string) => {
    if (!text) return null;
    const organicPattern = /(\*[^,*]+\*|有機[^\s、,]+)/g;
    const parts = text.split(organicPattern);
    return parts.map((part, i) => {
      if (organicPattern.test(part) || part.startsWith("*") || part.startsWith("有機")) {
        return (
          <span key={i} className="text-green-700 font-medium">
            {part.replace(/\*/g, "")}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className="rounded-xl overflow-hidden border-l-4 border-brand-red"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-black/[0.02] transition-colors"
        aria-expanded={isOpen}
        aria-controls="nutrition-panel-content"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-serif text-sm font-semibold text-foreground">
              {t("title_en")} / {t("title")}
            </span>
            {servingSize && (
              <span className="font-sans text-xs text-muted-foreground">
                1回分: {servingSize}
              </span>
            )}
          </div>
          {certifications?.length > 0 && (
            <CertBadges certifications={certifications} compact />
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-brand-red shrink-0 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {/* Expandable content */}
      <div
        id="nutrition-panel-content"
        ref={panelRef}
        className={cn(
          "overflow-hidden transition-all duration-500",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        <div className="px-4 pb-5 space-y-5 border-t border-black/[0.06]">
          {/* Calories row */}
          <div className="pt-4">
            <div className="flex items-end justify-between border-b-4 border-t-4 border-foreground py-2">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-wide text-foreground/60">
                  {t("calories")} / カロリー
                </span>
                <div
                  className="font-serif font-bold text-foreground leading-none"
                  style={{ fontSize: "36px" }}
                >
                  {nutrition.calories}
                </div>
              </div>
              <span className="font-sans text-xs text-muted-foreground mb-1">
                {servingSize ? `Per ${servingSize}` : "Per serving"}
              </span>
            </div>
          </div>

          {/* Macro pills */}
          <div className="grid grid-cols-4 gap-2">
            {MACRO_PILLS.map((macro) => {
              const value = nutrition[macro.key] as number | undefined;
              if (value === undefined || value === null) return null;
              return (
                <div
                  key={macro.key}
                  className={cn(
                    "rounded-lg border p-2 text-center relative overflow-hidden",
                    macro.color
                  )}
                >
                  <div className="font-serif text-lg font-bold leading-none">
                    {value}
                    <span className="font-sans text-xs font-normal ml-0.5">
                      {macro.key === "sodium_mg" ? "mg" : "g"}
                    </span>
                  </div>
                  <div className="font-sans text-[10px] mt-1 font-medium leading-tight">
                    <div>{macro.labelEn}</div>
                    <div className="opacity-70">{macro.labelJa}</div>
                  </div>
                  {/* Color bar at bottom */}
                  <div className={cn("absolute bottom-0 left-0 right-0 h-1", macro.bar)} />
                </div>
              );
            })}
          </div>

          {/* Full nutrient table */}
          <div className="space-y-2">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground/50 border-b border-black/10 pb-1.5">
              Nutritional Details
            </h4>
            <div className="space-y-2">
              {NUTRIENT_ROWS.map((row, idx) => {
                const value = nutrition[row.key] as number | undefined;
                if (value === undefined || value === null) return null;
                const max = getMaxForKey(row.key as string);
                const dvPct = getDailyValuePercent(value, row.key as string);

                return (
                  <div
                    key={row.key}
                    className={cn("space-y-1", row.indent && "pl-4")}
                  >
                    <div className="flex items-center justify-between">
                      <div className={cn("flex flex-col", row.indent && "opacity-80")}>
                        <span className="font-sans text-xs font-semibold text-foreground">
                          {row.labelEn}{" "}
                          <span className="font-normal text-muted-foreground">
                            {row.labelJa}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-sans text-xs font-semibold text-foreground">
                          {value}
                          {row.unit}
                        </span>
                        {dvPct !== null ? (
                          <span className="font-sans text-xs text-muted-foreground w-10 text-right">
                            {dvPct}%
                          </span>
                        ) : (
                          <span className="font-sans text-xs text-brand-gold w-10 text-right flex items-center justify-end gap-0.5">
                            <Star className="h-2.5 w-2.5 fill-current" />
                          </span>
                        )}
                      </div>
                    </div>
                    <NutrientBar
                      value={value}
                      max={max}
                      color={row.color}
                      delay={idx * 55}
                      animate={animateBars}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active compounds */}
          {nutrition.active_compounds && nutrition.active_compounds.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground/50 border-b border-black/10 pb-1.5 flex items-center gap-1">
                <Star className="h-3 w-3 fill-brand-gold text-brand-gold" />
                {t("active_compounds")}
              </h4>
              <div className="space-y-1.5">
                {nutrition.active_compounds.map((compound, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5 border-b border-black/5 last:border-0"
                  >
                    <div>
                      <span className="font-sans text-xs font-semibold text-foreground">
                        {compound.name_en}
                      </span>
                      <span className="font-sans text-xs text-muted-foreground ml-1.5">
                        {compound.name_ja}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans text-xs font-semibold">
                        {compound.amount}
                        {compound.unit}
                      </span>
                      {compound.is_key && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-gold/20 border border-brand-gold/40 px-1.5 py-0.5 text-[10px] font-medium text-brand-stone">
                          <Star className="h-2.5 w-2.5 fill-brand-gold text-brand-gold" />
                          KEY
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          <div className="space-y-2">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground/50 border-b border-black/10 pb-1.5">
              {t("ingredients_list")} / 原材料
            </h4>
            <p className="font-sans text-xs text-foreground/70 leading-relaxed">
              {renderIngredients(ingredientsJa || ingredientsEn)}
            </p>
            <p className="font-sans text-[10px] text-muted-foreground italic mt-1">
              * = 有機原材料 / organic ingredient
            </p>
            <p className="font-sans text-xs text-foreground/60 font-medium">
              {t("no_additives")}
            </p>
          </div>

          {/* Certification badges */}
          {certifications?.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground/50">
                {t("certifications")}
              </h4>
              <CertBadges certifications={certifications} />
            </div>
          )}

          {/* Daily value footnote */}
          <p className="font-sans text-[10px] text-muted-foreground leading-relaxed border-t border-black/10 pt-3">
            * % Daily Values are based on a 2,000 calorie diet.
            ★ No established Daily Value.
            <br />
            1日の摂取目安は2,000kcalを基準としています。
          </p>
        </div>
      </div>
    </div>
  );
}
