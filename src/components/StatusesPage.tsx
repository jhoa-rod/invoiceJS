import { useLanguage } from "../hooks/useLanguage";
import { getInternalTaskStatusTranslationKey, getStatusTranslationKey } from "../utils/taskHelpers";

interface StatusesPageProps {
  taskStatuses: string[];
  internalTaskStatuses: string[];
}

export function StatusesPage({ taskStatuses, internalTaskStatuses }: StatusesPageProps) {
  const { t } = useLanguage();

  return (
    <section className="grid gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-ink">{t("statuses")}</h2>
        <p className="mt-2 text-sm text-muted">{t("statusesDescription")}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-soft">
          <h3 className="text-xl font-extrabold text-ink">{t("clientTaskStatuses")}</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {taskStatuses.map((status) => {
              const key = getStatusTranslationKey(status);
              return (
                <span key={status} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-ink">
                  {key ? t(key) : status}
                </span>
              );
            })}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-soft">
          <h3 className="text-xl font-extrabold text-ink">{t("internalTaskStatuses")}</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {internalTaskStatuses.map((status) => {
              const key = getInternalTaskStatusTranslationKey(status);
              return (
                <span key={status} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-ink">
                  {key ? t(key) : status}
                </span>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
