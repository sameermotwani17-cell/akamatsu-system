import { Star, StarHalf } from "lucide-react";

type StarRatingProps = {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
};

export function StarRating({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
}: StarRatingProps) {
  const sizeMap = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  const textMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`${rating} out of 5 stars${reviewCount ? `, ${reviewCount} reviews` : ""}`}
    >
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${sizeMap[size]} fill-brand-gold text-brand-gold`}
            aria-hidden="true"
          />
        ))}
        {hasHalf && (
          <StarHalf
            className={`${sizeMap[size]} fill-brand-gold text-brand-gold`}
            aria-hidden="true"
          />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${sizeMap[size]} fill-muted text-muted-foreground/30`}
            aria-hidden="true"
          />
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className={`${textMap[size]} text-muted-foreground font-sans`}>
          ({reviewCount.toLocaleString("ja-JP")})
        </span>
      )}
    </div>
  );
}
