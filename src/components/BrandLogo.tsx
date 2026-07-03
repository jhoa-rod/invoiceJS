interface BrandLogoProps {
  compact?: boolean;
}

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-[linear-gradient(135deg,#6b5590,#4a3866)] shadow-sm">
        <span className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-gold" aria-hidden="true" />
        <span className="relative font-display text-sm font-extrabold tracking-[-0.03em] text-white">IJS</span>
      </div>
      {!compact ? <span className="font-display text-xl font-bold tracking-[-0.03em] text-ink">InvoiceJS</span> : null}
    </div>
  );
}
