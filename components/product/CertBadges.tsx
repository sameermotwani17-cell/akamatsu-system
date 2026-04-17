type CertBadgesProps = {
  certifications: string[];
  compact?: boolean;
};

const CERT_CONFIG: Record<
  string,
  { label: string; className: string; icon: string }
> = {
  organic: {
    label: "有機",
    className: "badge-organic",
    icon: "🌿",
  },
  gluten_free: {
    label: "グルテンフリー",
    className: "badge-gluten-free",
    icon: "🌾",
  },
  vegan: {
    label: "ビーガン",
    className: "badge-vegan",
    icon: "🌱",
  },
  no_additives: {
    label: "無添加",
    className: "badge-no-additives",
    icon: "✓",
  },
};

export function CertBadges({ certifications, compact = false }: CertBadgesProps) {
  const valid = certifications.filter((c) => CERT_CONFIG[c]);
  if (valid.length === 0) return null;

  // In compact mode, show only first 2
  const shown = compact ? valid.slice(0, 2) : valid;

  return (
    <div className="flex flex-wrap gap-1" aria-label="Product certifications">
      {shown.map((cert) => {
        const config = CERT_CONFIG[cert];
        return (
          <span key={cert} className={config.className}>
            <span aria-hidden="true">{config.icon}</span>
            {config.label}
          </span>
        );
      })}
      {compact && valid.length > 2 && (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          +{valid.length - 2}
        </span>
      )}
    </div>
  );
}
