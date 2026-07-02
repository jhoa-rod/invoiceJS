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
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-app-strong/45 px-4 py-6">
      <section className="w-full max-w-xl rounded-lg border border-app-border bg-white p-5 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-app-muted">{t("share")}</p>
            <h2 className="mt-1 text-xl font-black text-app-text">{t("shareInvoice")}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-app-border bg-white text-lg font-bold text-app-text hover:border-app-accent hover:bg-app-bg"
          >
            ×
          </button>
        </div>

        <label className="mt-5 grid gap-2 text-sm font-semibold text-app-text">
          {t("shareLink")}
          <input
            className="min-h-11 w-full rounded-md border border-app-border bg-app-bg px-3 py-2 text-sm text-app-text"
            value={link}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-md border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text hover:border-app-accent hover:bg-app-bg"
          >
            {t("close")}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-10 rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white hover:bg-app-accentStrong"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      </section>
    </div>
  );
}
