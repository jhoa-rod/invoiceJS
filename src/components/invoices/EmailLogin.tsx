import { useState, type FormEvent } from "react";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
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
    <div className="flex min-h-screen items-center justify-center bg-app-bg px-4 py-8 text-app-text">
      <main className="w-full max-w-md rounded-lg border border-app-border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-app-muted">{t("appEyebrow")}</p>
            <h1 className="mt-2 text-3xl font-black text-app-text">{t("appTitle")}</h1>
          </div>
          <LanguageSelector compact />
        </div>

        <p className="mt-3 text-sm leading-6 text-app-muted">{t("authSubtitle")}</p>

        {!isConfigured ? (
          <div className="mt-5 rounded-md border border-app-border bg-app-soft p-4">
            <p className="text-sm font-bold text-app-text">{t("configurationRequired")}</p>
            <p className="mt-1 text-sm leading-6 text-app-muted">{t("configurationHelp")}</p>
          </div>
        ) : null}

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-app-muted">{t("email")}</span>
            <input
              className="min-h-11 w-full rounded-md border border-app-border bg-white px-3 py-2 text-base text-app-text outline-none transition placeholder:text-app-muted/60 focus:border-app-accent focus:ring-2 focus:ring-app-soft"
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

          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-app-muted">{t("password")}</span>
            <input
              className="min-h-11 w-full rounded-md border border-app-border bg-white px-3 py-2 text-base text-app-text outline-none transition placeholder:text-app-muted/60 focus:border-app-accent focus:ring-2 focus:ring-app-soft"
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
            <label className="grid gap-1">
              <span className="text-xs font-bold uppercase text-app-muted">{t("confirmPassword")}</span>
              <input
                className="min-h-11 w-full rounded-md border border-app-border bg-white px-3 py-2 text-base text-app-text outline-none transition placeholder:text-app-muted/60 focus:border-app-accent focus:ring-2 focus:ring-app-soft"
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
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {fieldError || error}
            </p>
          ) : null}

          {message ? (
            <p className="rounded-md border border-app-border bg-app-soft px-3 py-2 text-sm font-semibold text-app-text">{message}</p>
          ) : null}

          <button
            type="submit"
            disabled={!isConfigured || isSubmitting}
            className="min-h-11 rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-app-accentStrong disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? t("loading") : isSignUp ? t("signUp") : t("signIn")}
          </button>
        </form>

        <button
          type="button"
          onClick={switchMode}
          className="mt-5 min-h-10 w-full rounded-md border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text hover:border-app-accent hover:bg-app-bg"
        >
          {isSignUp ? t("switchToSignIn") : t("switchToSignUp")}
        </button>
      </main>
    </div>
  );
}
