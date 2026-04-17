import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 text-center gap-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-red/10">
        <Leaf className="h-10 w-10 text-brand-red" />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-6xl font-bold text-brand-red">404</h1>
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          ページが見つかりません
        </h2>
        <p className="font-sans text-sm text-muted-foreground">
          Page Not Found — The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-primary px-8 py-3">
          ホームへ戻る / Home
        </Link>
        <Link href="/shop" className="btn-secondary px-8 py-3">
          ショップ / Shop
        </Link>
      </div>
    </div>
  );
}
