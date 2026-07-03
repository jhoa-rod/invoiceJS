import type { Language } from "../../i18n/invoiceI18n";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { Dropdown } from "../ui/Dropdown";

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useInvoiceI18n();

  return (
    <div className={compact ? "min-w-36" : "grid gap-1"}>
      <Dropdown
        label={compact ? undefined : t("language")}
        value={language}
        options={[
          { value: "en", label: t("english") },
          { value: "es", label: t("spanish") },
        ]}
        onChange={(value) => setLanguage(value as Language)}
      />
    </div>
  );
}
