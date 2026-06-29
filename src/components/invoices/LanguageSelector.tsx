import type { Language } from "../../i18n/invoiceI18n";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useInvoiceI18n();

  return (
    <label className={compact ? "flex items-center gap-2 text-sm font-semibold text-app-muted" : "grid gap-1"}>
      {!compact ? <span className="text-xs font-bold uppercase text-app-muted">{t("language")}</span> : null}
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="min-h-10 rounded-md border border-app-border bg-white px-3 py-2 text-sm font-semibold text-app-text outline-none transition focus:border-app-accent focus:ring-2 focus:ring-app-soft"
      >
        <option value="en">{t("english")}</option>
        <option value="es">{t("spanish")}</option>
      </select>
    </label>
  );
}
