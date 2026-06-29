import { useLanguage } from "../hooks/useLanguage";
import type { Task } from "../types/task";
import { isIntercomUrl, isValidUrl, normalizeUrl, openExternalUrl } from "../utils/links";
import { getCompletionTimingLabel, getStatusTranslationKey } from "../utils/taskHelpers";

interface TaskTableProps {
  tasks: Task[];
  onSelect: (task: Task) => void;
}

export function TaskTable({ tasks, onSelect }: TaskTableProps) {
  const { language, t } = useLanguage();
  const locale = language === "es" ? "es-ES" : "en-US";

  if (!tasks.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-line bg-white/60 px-5 py-10 text-center text-sm text-muted">
        {t("noTasks")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[24px] border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3">{t("clientName")}</th>
            <th className="px-4 py-3">{t("intercomLink")}</th>
            <th className="px-4 py-3">{t("status")}</th>
            <th className="px-4 py-3">{t("createdAt")}</th>
            <th className="px-4 py-3">{t("estimatedCompletionDate")}</th>
            <th className="px-4 py-3">{t("taskType")}</th>
            <th className="px-4 py-3">{t("completedAt")}</th>
            <th className="px-4 py-3">{t("details")}</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const link = task.intercomLink ?? task.chatLink ?? "";
            const statusKey = getStatusTranslationKey(task.status);
            const timingKey = getCompletionTimingLabel(task.estimatedCompletionDate, task.completedAt);

            return (
              <tr
                key={task.id}
                onClick={() => onSelect(task)}
                className="cursor-pointer border-t border-slate-100 align-top transition hover:bg-slate-50"
              >
                <td className="px-4 py-4 font-semibold text-ink">{task.clientName}</td>
                <td className="px-4 py-4 text-slate-600">
                  {link ? (
                    <a
                      href={isValidUrl(link) ? normalizeUrl(link) : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        if (!isValidUrl(link)) {
                          window.alert(t("invalidLink"));
                          return;
                        }
                        openExternalUrl(link);
                      }}
                      className="rounded-2xl border border-line px-3 py-2 text-sm font-semibold text-ink"
                    >
                      {isIntercomUrl(link) ? t("openIntercom") : t("openChat")}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-4 text-slate-600">{statusKey ? t(statusKey) : task.status}</td>
                <td className="px-4 py-4 text-slate-600">{new Date(task.createdAt).toLocaleDateString(locale)}</td>
                <td className="px-4 py-4 text-slate-600">{task.estimatedCompletionDate ? new Date(task.estimatedCompletionDate).toLocaleDateString(locale) : "—"}</td>
                <td className="px-4 py-4 text-slate-600">{task.taskType ?? "—"}</td>
                <td className="px-4 py-4 text-slate-600">{task.completedAt ? new Date(task.completedAt).toLocaleDateString(locale) : "—"}</td>
                <td className="px-4 py-4 text-slate-600">
                  {timingKey ? (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${timingKey === "onTime" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {t(timingKey)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
