import { useState, type FormEvent } from "react";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { BrandLogo } from "../BrandLogo";
import { LanguageSelector } from "./LanguageSelector";

interface EmailLoginProps {
  isConfigured: boolean;
  isSubmitting: boolean;
  error: string;
  message: string;
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string) => void;
}

type AuthMode = "signIn" | "signUp";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const inputClass =
  "min-h-12 w-full rounded-[12px] border border-line bg-card px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand-soft disabled:cursor-not-allowed disabled:bg-brand-soft/55 disabled:text-muted";

const labelClass = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted";

export function EmailLogin({ isConfigured, isSubmitting, error, message, onSignIn, onSignUp }: EmailLoginProps) {
  const { t } = useInvoiceI18n();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState("");

  const isSignUp = mode === "signUp";

  const clearLocalError = () => setFieldError("");

  const validate = () => {
    if (!isValidEmail(email)) return t("enterEmail");
    if (!password.trim()) return t("enterPassword");
    if (isSignUp && password.length < 6) return t("passwordLength");
    if (isSignUp && password !== confirmPassword) return t("passwordsDoNotMatch");
    return "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (isSignUp) {
      onSignUp(normalizedEmail, password);
      return;
    }
    onSignIn(normalizedEmail, password);
  };

  const switchMode = () => {
    setMode(isSignUp ? "signIn" : "signUp");
    setFieldError("");
    setConfirmPassword("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-8 text-ink">
      <main className="w-full max-w-[640px] rounded-lg border border-line bg-card p-7 shadow-md sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <BrandLogo />
          <LanguageSelector compact />
        </div>

        <div className="mt-9">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">{t("appEyebrow")}</p>
          <h1 className="mt-2 max-w-md font-display text-5xl font-extrabold leading-[0.96] tracking-[-0.04em] text-ink sm:text-6xl">
            {t("appTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{t("authSubtitle")}</p>
        </div>

        {!isConfigured ? (
          <div className="mt-7 rounded-[14px] border border-line bg-brand-soft p-5">
            <p className="font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{t("configurationRequired")}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{t("configurationHelp")}</p>
          </div>
        ) : null}

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className={labelClass}>{t("email")}</span>
            <input
              className={inputClass}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearLocalError();
              }}
              disabled={!isConfigured || isSubmitting}
            />
          </label>

          <label className="grid gap-2">
            <span className={labelClass}>{t("password")}</span>
            <input
              className={inputClass}
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearLocalError();
              }}
              disabled={!isConfigured || isSubmitting}
            />
          </label>

          {isSignUp ? (
            <label className="grid gap-2">
              <span className={labelClass}>{t("confirmPassword")}</span>
              <input
                className={inputClass}
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  clearLocalError();
                }}
                disabled={!isConfigured || isSubmitting}
              />
            </label>
          ) : null}

          {fieldError || error ? (
            <p className="rounded-[12px] border border-danger/25 bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
              {fieldError || error}
            </p>
          ) : null}

          {message ? (
            <p className="rounded-[12px] border border-positive/20 bg-positive/10 px-4 py-3 text-sm font-bold text-positive">{message}</p>
          ) : null}

          <button
            type="submit"
            disabled={!isConfigured || isSubmitting}
            className="min-h-12 rounded-[12px] bg-brand px-5 py-3 text-base font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isSubmitting ? t("loading") : isSignUp ? t("signUp") : t("signIn")}
          </button>
        </form>

        <button
          type="button"
          onClick={switchMode}
          className="mt-6 min-h-12 w-full rounded-[12px] border border-line bg-card px-5 py-3 text-base font-extrabold text-ink transition hover:-translate-y-px hover:border-brand hover:shadow-md"
        >
          {isSignUp ? t("switchToSignIn") : t("switchToSignUp")}
        </button>
      </main>
    </div>
  );
}
