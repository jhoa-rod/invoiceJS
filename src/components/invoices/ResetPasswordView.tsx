import { useState, type FormEvent } from "react";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { BrandLogo } from "../BrandLogo";
import { LanguageSelector } from "./LanguageSelector";

interface ResetPasswordViewProps {
  isConfigured: boolean;
  onUpdatePassword: (password: string) => Promise<void>;
}

const inputClass =
  "min-h-12 w-full rounded-[12px] border border-line bg-card px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand-soft disabled:cursor-not-allowed disabled:bg-brand-soft/55 disabled:text-muted";

const labelClass = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted";

export function ResetPasswordView({ isConfigured, onUpdatePassword }: ResetPasswordViewProps) {
  const { t } = useInvoiceI18n();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (newPassword.length < 8) return t("passwordResetLength");
    if (newPassword !== confirmPassword) return t("passwordsDoNotMatch");
    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdatePassword(newPassword);
      setMessage(t("passwordUpdated"));
      window.setTimeout(() => {
        window.location.assign("https://app.invoicejs.com");
      }, 1600);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t("authGenericError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-5 py-8 text-ink">
      <main className="w-full max-w-[560px] rounded-[20px] border border-line bg-card p-6 shadow-md sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BrandLogo />
          <LanguageSelector compact />
        </div>

        <div className="mt-10 text-center">
          <img src="/invoicejs-logo.png" alt="" className="mx-auto h-16 w-16 rounded-[16px] object-contain" />
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink">{t("setNewPassword")}</h1>
          <p className="mt-3 text-base leading-7 text-muted">{t("setNewPasswordHelp")}</p>
        </div>

        {!isConfigured ? (
          <div className="mt-7 rounded-[14px] border border-line bg-brand-soft p-5">
            <p className="font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{t("configurationRequired")}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{t("configurationHelp")}</p>
          </div>
        ) : null}

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className={labelClass}>{t("newPassword")}</span>
            <input
              className={inputClass}
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setError("");
                setMessage("");
              }}
              disabled={!isConfigured || isSubmitting}
            />
          </label>

          <label className="grid gap-2">
            <span className={labelClass}>{t("confirmNewPassword")}</span>
            <input
              className={inputClass}
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setError("");
                setMessage("");
              }}
              disabled={!isConfigured || isSubmitting}
            />
          </label>

          {error ? <p className="rounded-[12px] border border-danger/25 bg-danger/10 px-4 py-3 text-sm font-bold text-danger">{error}</p> : null}
          {message ? (
            <p className="rounded-[12px] border border-positive/20 bg-positive/10 px-4 py-3 text-sm font-bold text-positive">{message}</p>
          ) : null}

          <button
            type="submit"
            disabled={!isConfigured || isSubmitting}
            className="min-h-12 rounded-[12px] bg-brand px-5 py-3 text-base font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isSubmitting ? t("loading") : t("updatePassword")}
          </button>
        </form>

        <a
          href="https://app.invoicejs.com"
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
        >
          {t("backToSignIn")}
        </a>
      </main>
    </div>
  );
}
