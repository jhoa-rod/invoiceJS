import { useLanguage } from "../hooks/useLanguage";
import type { Task, TaskStatus } from "../types/task";
import { isIntercomUrl, isValidUrl, normalizeUrl, openExternalUrl } from "../utils/links";
import { getStatusTranslationKey, getTaskAgeInDays, isDoingLikeStatus } from "../utils/taskHelpers";

interface TaskCardProps {
  task: Task;
  clientTaskCount: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (taskId: string, status: TaskStatus) => void;
}

const statusStyles = [
  "bg-sky-100 text-sky-700",
  "bg-indigo-100 text-indigo-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function getStatusClass(status: string) {
  const key = getStatusTranslationKey(status);
  if (key === "toDo") return "bg-todo/10 text-todo";
  if (key === "doing") return "bg-amber-100 text-amber-700";
  if (key === "done") return "bg-emerald-100 text-emerald-700";

  const hash = status.split("").reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0);
  return statusStyles[hash % statusStyles.length];
}

export function TaskCard({ task, clientTaskCount, onEdit, onDelete, onMove }: TaskCardProps) {
  const { t, language } = useLanguage();
  const statusKey = getStatusTranslationKey(task.status);
  const daysInProgress = isDoingLikeStatus(task.status) ? getTaskAgeInDays(task.updatedAt) : 0;
  const showSlowBadge = isDoingLikeStatus(task.status) && daysInProgress >= 3;
  const locale = language === "es" ? "es-ES" : "en-US";
  const chatUrl = task.intercomLink ?? task.chatLink ?? "";
  const taskDetails = task.taskDetails ?? task.details;
  const openLabel = isIntercomUrl(chatUrl) ? t("openIntercom") : t("openChat");

  const handleOpenChat = () => {
    if (!isValidUrl(chatUrl)) {
      window.alert(t("invalidLink"));
      return;
    }
    openExternalUrl(chatUrl);
  };

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-ink">{task.clientName}</p>
          <p className="mt-1 text-sm text-muted">{task.taskTitle ?? task.taskDescription}</p>
          {task.taskType ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{task.taskType}</p> : null}
          {taskDetails ? <p className="mt-2 text-sm text-slate-500">{taskDetails}</p> : null}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(task.status)}`}>
          {statusKey ? t(statusKey) : task.status}
        </span>
      </div>

      <div className="grid gap-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-3">
          <span>{t("clientTasksLabel")}</span>
          <span className="font-semibold text-ink">{clientTaskCount}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>{t("createdAt")}</span>
          <span className="font-semibold text-ink">
            {new Date(task.createdAt).toLocaleDateString(locale, { day: "2-digit", month: "short" })}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>{t("completedAt")}</span>
          <span className="font-semibold text-ink">
            {task.completedAt
              ? new Date(task.completedAt).toLocaleDateString(locale, { day: "2-digit", month: "short" })
              : "—"}
          </span>
        </div>
      </div>

      {showSlowBadge ? (
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
          {t("doingTooLong")} · {daysInProgress} {t("daysInProgress")}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {chatUrl ? (
          <a
            href={isValidUrl(chatUrl) ? normalizeUrl(chatUrl) : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              event.preventDefault();
              handleOpenChat();
            }}
            className="rounded-2xl border border-line px-3 py-2 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
          >
            {openLabel}
          </a>
        ) : null}

        {statusKey === "toDo" ? (
          <button
            type="button"
            onClick={() => onMove(task.id, "doing")}
            className="rounded-2xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
          >
            {t("moveToDoing")}
          </button>
        ) : null}

        {statusKey === "doing" ? (
          <button
            type="button"
            onClick={() => onMove(task.id, "done")}
            className="rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
          >
            {t("moveToDone")}
          </button>
        ) : null}

        {statusKey === "done" ? (
          <button
            type="button"
            onClick={() => onMove(task.id, "doing")}
            className="rounded-2xl bg-slate-700 px-3 py-2 text-sm font-semibold text-white"
          >
            {t("moveBackToDoing")}
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="flex-1 rounded-2xl border border-line px-3 py-2 text-sm font-semibold text-ink"
        >
          {t("edit")}
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="flex-1 rounded-2xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600"
        >
          {t("delete")}
        </button>
      </div>
    </article>
  );
}
