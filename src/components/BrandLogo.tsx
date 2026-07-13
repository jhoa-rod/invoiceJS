interface BrandLogoProps {
  compact?: boolean;
  inverted?: boolean;
}

export function BrandLogo({ compact = false, inverted = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-brand-soft shadow-sm ring-1 ring-line">
        <img src="/invoicejs-logo.png" alt="" className="h-full w-full object-contain p-1" aria-hidden="true" />
      </div>
      {!compact ? (
        <span className={inverted ? "font-display text-xl font-bold tracking-[-0.03em] text-white" : "font-display text-xl font-bold tracking-[-0.03em] text-ink"}>
          InvoiceJS
        </span>
      ) : null}
    </div>
  );
}
