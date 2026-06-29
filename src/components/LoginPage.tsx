import { useLanguage } from "../hooks/useLanguage";

interface LoginPageProps {
  onSignIn: () => Promise<void>;
}

export function LoginPage({ onSignIn }: LoginPageProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-5xl rounded-[36px] border border-white/70 bg-white/95 p-6 shadow-soft lg:grid lg:grid-cols-[1.15fr,0.85fr] lg:gap-8 lg:p-8">
        <div className="rounded-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(15,108,189,0.22),_transparent_35%),linear-gradient(145deg,_#0f172a_0%,_#1e293b_55%,_#172033_100%)] p-8 text-white">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-100">
            Client Task Manager
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight">{t("appTitle")}</h1>
          <p className="mt-4 max-w-xl text-base text-slate-200">{t("loginSubtitle")}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{t("pendingTasks")}</p>
              <p className="mt-2 text-lg font-bold">{t("loginFeatureBoard")}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{t("importData")}</p>
              <p className="mt-2 text-lg font-bold">{t("loginFeatureImport")}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{t("language")}</p>
              <p className="mt-2 text-lg font-bold">{t("loginFeatureLanguage")}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-6 lg:mt-0">
          <div className="flex items-center justify-end gap-3 rounded-2xl border border-line bg-slate-50 p-3">
            <label className="text-sm font-semibold text-slate-600">{t("language")}</label>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as "es" | "en")}
              className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-brand"
            >
              <option value="es">{t("spanish")}</option>
              <option value="en">{t("english")}</option>
            </select>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              Google Auth
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-ink">{t("loginTitle")}</h2>
            <p className="mt-3 text-sm text-muted">{t("loginDescription")}</p>

            <button
              type="button"
              onClick={onSignIn}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-base text-slate-900">
                G
              </span>
              {t("signInWithGoogle")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
