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
  onSignUp: (email: string, password: string, fullName?: string) => void;
  onGoogleSignIn: () => void;
  onPasswordResetRequest: (email: string) => Promise<void>;
}

type AuthMode = "signIn" | "signUp";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const inputClass =
  "min-h-12 w-full rounded-[12px] border border-line bg-card px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand-soft disabled:cursor-not-allowed disabled:bg-brand-soft/55 disabled:text-muted";

const labelClass = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.37c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.37 12 5.37z" />
    </svg>
  );
}

export function EmailLogin({
  isConfigured,
  isSubmitting,
  error,
  message,
  onSignIn,
  onSignUp,
  onGoogleSignIn,
  onPasswordResetRequest,
}: EmailLoginProps) {
  const { t } = useInvoiceI18n();
  const [mode, setMode] = useState<AuthMode>("signUp");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);

  const isSignUp = mode === "signUp";
  const benefits = [
    t("authBenefitNoCard"),
    t("authBenefitFastCreation"),
    t("authBenefitPdfCsv"),
    t("authBenefitClientManagement"),
    t("authBenefitShareLinks"),
  ];

  const clearLocalError = () => setFieldError("");

  const validate = () => {
    if (isSignUp && !fullName.trim()) return t("fullName");
    if (!isValidEmail(email)) return t("enterEmail");
    if (!password.trim()) return t("enterPassword");
    if (isSignUp && password.length < 6) return t("passwordLength");
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
      onSignUp(normalizedEmail, password, fullName);
      return;
    }
    onSignIn(normalizedEmail, password);
  };

  const switchMode = () => {
    setMode(isSignUp ? "signIn" : "signUp");
    setFieldError("");
  };

  const openResetModal = () => {
    setResetEmail(email);
    setResetError("");
    setResetMessage("");
    setResetModalOpen(true);
  };

  const handleResetSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResetError("");
    setResetMessage("");

    const normalizedEmail = resetEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setResetError(t("enterEmail"));
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      setResetError(t("enterEmail"));
      return;
    }

    setResetSubmitting(true);
    try {
      await onPasswordResetRequest(normalizedEmail);
      setResetMessage(t("resetEmailSent"));
    } catch (resetRequestError) {
      setResetError(resetRequestError instanceof Error ? resetRequestError.message : t("authGenericError"));
    } finally {
      setResetSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-card text-ink lg:grid lg:grid-cols-[1.02fr_0.98fr]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1c1625_0%,#2a1f3a_48%,#4a3866_100%)] px-6 py-8 text-white sm:px-10 lg:flex lg:min-h-screen lg:items-center lg:px-16">
        <div className="absolute -left-28 top-14 h-72 w-72 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-2xl">
          <BrandLogo inverted />

          <div className="mt-16 max-w-xl lg:mt-24">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold">InvoiceJS</p>
            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              {t("authHeroTitle")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/68">{t("authHeroText")}</p>
          </div>

          <ul className="mt-10 grid gap-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-base font-bold text-white/88">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-ink shadow-sm">✓</span>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-12 max-w-xl rounded-[20px] border border-white/12 bg-white/8 p-5 shadow-lg backdrop-blur">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-gold-soft text-2xl font-extrabold text-brand-deep">
                ✓
              </span>
              <p className="text-base leading-7 text-white/78">
                <strong className="text-gold">100% free.</strong> No trial limits, no card, no heavy accounting setup.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-card px-5 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-[560px]">
          <div className="mb-8 flex items-center justify-end">
            <LanguageSelector compact />
          </div>

          <main className="rounded-[20px] border border-line bg-card p-6 shadow-md sm:p-9">
            <div className="text-center">
              <img src="/invoicejs-logo.png" alt="" className="mx-auto h-16 w-16 rounded-[16px] object-contain" />
              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink">
                {isSignUp ? t("authCardTitleSignUp") : t("authCardTitleSignIn")}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted">{t("authSubtitle")}</p>
            </div>

            {!isConfigured ? (
              <div className="mt-7 rounded-[14px] border border-line bg-brand-soft p-5">
                <p className="font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{t("configurationRequired")}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{t("configurationHelp")}</p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={onGoogleSignIn}
              disabled={!isConfigured || isSubmitting}
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[12px] border border-line bg-card px-5 py-3 text-base font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55"
            >
              <GoogleIcon />
              {t("continueWithGoogle")}
            </button>

            <div className="my-7 flex items-center gap-4 text-sm font-bold text-muted">
              <span className="h-px flex-1 bg-line" />
              <span>{t("continueWithEmail")}</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              {isSignUp ? (
                <label className="grid gap-2">
                  <span className={labelClass}>{t("fullName")}</span>
                  <input
                    className={inputClass}
                    type="text"
                    autoComplete="name"
                    placeholder={t("fullName")}
                    value={fullName}
                    onChange={(event) => {
                      setFullName(event.target.value);
                      clearLocalError();
                    }}
                    disabled={!isConfigured || isSubmitting}
                  />
                </label>
              ) : null}

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
                <span className="flex items-center justify-between gap-3">
                  <span className={labelClass}>{t("password")}</span>
                  {!isSignUp ? (
                    <button
                      type="button"
                      onClick={openResetModal}
                      className="text-xs font-extrabold text-brand underline decoration-line underline-offset-4 transition hover:text-brand-deep"
                    >
                      {t("forgotPassword")}
                    </button>
                  ) : null}
                </span>
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

            <p className="mt-6 text-center text-sm leading-6 text-muted">
              {t("legalAgreementPrefix")}{" "}
              <a className="font-bold text-ink underline decoration-line underline-offset-4 hover:text-brand" href="https://invoicejs.com/terms" target="_blank" rel="noreferrer">
                {t("termsAndConditions")}
              </a>
              ,{" "}
              <a className="font-bold text-ink underline decoration-line underline-offset-4 hover:text-brand" href="https://invoicejs.com/privacy" target="_blank" rel="noreferrer">
                {t("privacyPolicy")}
              </a>{" "}
              {t("and")}{" "}
              <a
                className="font-bold text-ink underline decoration-line underline-offset-4 hover:text-brand"
                href="https://invoicejs.com/legal-notice"
                target="_blank"
                rel="noreferrer"
              >
                {t("legalNotice")}
              </a>
              .
            </p>

            <div className="-mx-6 -mb-6 mt-7 rounded-b-[20px] border-t border-line bg-surface px-6 py-5 text-center sm:-mx-9 sm:-mb-9 sm:px-9">
              <button type="button" onClick={switchMode} className="font-extrabold text-ink underline decoration-line underline-offset-4 transition hover:text-brand">
                {isSignUp ? t("switchToSignIn") : t("switchToSignUp")}
              </button>
            </div>
          </main>
        </div>
      </section>

      {resetModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-5 py-6 backdrop-blur-[2px] animate-[modalFade_200ms_ease-out]">
          <section className="w-full max-w-[460px] rounded-[20px] border border-line bg-card p-7 shadow-lg animate-[modalIn_200ms_ease-out]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink">{t("resetPassword")}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{t("resetPasswordHelp")}</p>
              </div>
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                aria-label={t("close")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-line bg-card text-2xl font-medium leading-none text-muted transition hover:-translate-y-px hover:border-brand hover:text-ink hover:shadow-md"
              >
                x
              </button>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleResetSubmit}>
              <label className="grid gap-2">
                <span className={labelClass}>{t("email")}</span>
                <input
                  className={inputClass}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(event) => {
                    setResetEmail(event.target.value);
                    setResetError("");
                    setResetMessage("");
                  }}
                  disabled={resetSubmitting}
                />
              </label>

              {resetError ? (
                <p className="rounded-[12px] border border-danger/25 bg-danger/10 px-4 py-3 text-sm font-bold text-danger">{resetError}</p>
              ) : null}

              {resetMessage ? (
                <p className="rounded-[12px] border border-positive/20 bg-positive/10 px-4 py-3 text-sm font-bold text-positive">{resetMessage}</p>
              ) : null}

              <div className="mt-2 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="min-h-11 rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="min-h-11 rounded-[12px] bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {resetSubmitting ? t("loading") : t("sendResetLink")}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
