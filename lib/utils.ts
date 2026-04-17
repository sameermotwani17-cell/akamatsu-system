import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, locale = "ja-JP"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  }).format(price);
}

export function calculateTax(subtotal: number, rate = 0.1): number {
  return Math.round(subtotal * rate);
}

export function getTaxIncluded(subtotal: number): number {
  return Math.round(subtotal * 1.1);
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AKM-${timestamp}-${random}`;
}

export function getStockStatus(
  quantity: number
): "in_stock" | "low_stock" | "out_of_stock" {
  if (quantity === 0) return "out_of_stock";
  if (quantity <= 5) return "low_stock";
  return "in_stock";
}

export function getDailyValuePercent(
  amount: number,
  nutrient: string
): number | null {
  const dailyValues: Record<string, number> = {
    fat_g: 78,
    saturated_fat_g: 20,
    carbs_g: 275,
    fiber_g: 28,
    protein_g: 50,
    sodium_mg: 2300,
    potassium_mg: 4700,
    iron_mg: 18,
  };
  const dv = dailyValues[nutrient];
  if (!dv) return null;
  return Math.round((amount / dv) * 100);
}

export function getBusinessDays(daysAhead = 14): Date[] {
  const days: Date[] = [];
  const today = new Date();
  let count = 0;
  let cursor = new Date(today);

  while (count < daysAhead) {
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      // Skip weekends
      days.push(new Date(cursor));
      count++;
    }
  }
  return days;
}
