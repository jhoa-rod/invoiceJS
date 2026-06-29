import { useLanguage } from "../hooks/useLanguage";
import type { InternalTask } from "../types/internalTask";
import { isIntercomUrl, isValidUrl, normalizeUrl, openExternalUrl } from "../utils/links";
import { getInternalTaskStatusTranslationKey, getPriorityTranslationKey } from "../utils/taskHelpers";

interface InternalTaskCardProps {
  task: InternalTask;
  onEdit: (task: InternalTask) => void;
  onDelete: (task: InternalTask) => void;
}

export function InternalTaskCard({ task, onEdit, onDelete }: InternalTaskCardProps) {
  const { t } = useLanguage();
  const priorityKey = getPriorityTranslationKey(task.priority ?? "");
  const statusKey = getInternalTaskStatusTranslationKey(task.status);
  const intercomLink = task.intercomLink ?? "";
  const completedOnTime =
    task.completedAt && task.estimatedCompletionDate
      ? new Date(task.completedAt).getTime() <= new Date(task.estimatedCompletionDate).getTime()
      : null;

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink">{task.title}</h3>
          {task.clientName ? <p className="mt-1 text-sm font-medium text-slate-600">{task.clientName}</p> : null}
          {task.taskType ? <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{task.taskType}</p> : null}
          <p className="mt-1 text-sm text-muted">{task.description || t("noDescription")}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {statusKey ? t(statusKey) : task.status}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        {task.priority ? <p>{priorityKey ? t(priorityKey) : task.priority}</p> : null}
        {task.estimatedCompletionDate ?? task.dueDate ? <p>{task.estimatedCompletionDate ?? task.dueDate}</p> : null}
        <p>{new Date(task.createdAt).toLocaleDateString()}</p>
        {task.completedAt ? <p>{new Date(task.completedAt).toLocaleDateString()}</p> : null}
        {completedOnTime !== null ? (
          <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${completedOnTime ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {completedOnTime ? t("onTime") : t("late")}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {intercomLink ? (
          <a
            href={isValidUrl(intercomLink) ? normalizeUrl(intercomLink) : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              event.preventDefault();
              if (!isValidUrl(intercomLink)) {
                window.alert(t("invalidLink"));
                return;
              }
              openExternalUrl(intercomLink);
            }}
            className="rounded-2xl border border-line px-3 py-2 text-sm font-semibold text-ink"
          >
            {isIntercomUrl(intercomLink) ? t("openIntercom") : t("openChat")}
          </a>
        ) : null}
        <button type="button" onClick={() => onEdit(task)} className="rounded-2xl border border-line px-3 py-2 text-sm font-semibold text-ink">
          {t("edit")}
        </button>
        <button type="button" onClick={() => onDelete(task)} className="rounded-2xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600">
          {t("delete")}
        </button>
      </div>
    </article>
  );
}
