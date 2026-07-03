import { useEffect, useState } from "react";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { copyText } from "../../utils/invoiceShare";

interface ShareModalProps {
  link: string;
  onClose: () => void;
}

export function ShareModal({ link, onClose }: ShareModalProps) {
  const { t } = useInvoiceI18n();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    await copyText(link);
    setCopied(true);
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-5 py-6 backdrop-blur-[2px] animate-[modalFade_200ms_ease-out]">
      <section className="w-full max-w-[560px] rounded-[18px] border border-line bg-card p-7 shadow-lg animate-[modalIn_200ms_ease-out]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink">{t("shareInvoice")}</h2>
            <p className="mt-1 text-sm leading-6 text-muted">{t("shareInvoiceHelp")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-line bg-card text-2xl font-medium leading-none text-muted transition hover:-translate-y-px hover:border-brand hover:text-ink hover:shadow-md"
          >
            x
          </button>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="share-link">
            {t("shareLink")}
          </label>
          <input
            id="share-link"
            className="min-h-12 w-full rounded-[12px] border border-line bg-surface px-4 py-3 font-mono text-sm text-muted outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft"
            value={link}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
          />
          <button
            type="button"
            onClick={handleCopy}
            className={
              copied
                ? "min-h-12 rounded-[12px] bg-positive px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md"
                : "min-h-12 rounded-[12px] bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
            }
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink transition hover:-translate-y-px hover:border-brand hover:shadow-md"
          >
            {t("close")}
          </button>
        </div>
      </section>
    </div>
  );
}
