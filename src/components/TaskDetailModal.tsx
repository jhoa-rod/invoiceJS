import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { Task, TaskFormValues } from "../types/task";
import { isIntercomUrl, isValidUrl, openExternalUrl } from "../utils/links";
import {
  getCompletionTimingLabel,
  getStatusTranslationKey,
  updateTaskRecord,
  validateTask,
} from "../utils/taskHelpers";
import { TaskFields } from "./TaskFields";

interface TaskDetailModalProps {
  task: Task | null;
  availableStatuses: string[];
  clientSuggestions: string[];
  onClose: () => void;
  onSave: (task: Task) => void;
}

const emptyValues: TaskFormValues = {
  clientName: "",
  chatLink: "",
  intercomLink: "",
  taskDescription: "",
  taskTitle: "",
  details: "",
  taskDetails: "",
  taskType: "",
  estimatedCompletionDate: "",
  completedAt: "",
  status: "to do",
};

export function TaskDetailModal({
  task,
  availableStatuses,
  clientSuggestions,
  onClose,
  onSave,
}: TaskDetailModalProps) {
  const { language, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<TaskFormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormValues, string>>>({});

  useEffect(() => {
    if (!task) {
      setIsEditing(false);
      setValues(emptyValues);
      setErrors({});
      return;
    }

    setIsEditing(false);
    setValues({
      clientName: task.clientName,
      chatLink: task.intercomLink ?? task.chatLink ?? "",
      intercomLink: task.intercomLink ?? task.chatLink ?? "",
      taskDescription: task.taskDetails ?? task.details ?? task.taskDescription,
      taskTitle: "",
      details: task.taskDetails ?? task.details ?? "",
      taskDetails: task.taskDetails ?? task.details ?? "",
      taskType: task.taskType ?? "",
      estimatedCompletionDate: task.estimatedCompletionDate ?? "",
      completedAt: task.completedAt ?? "",
      status: task.status,
    });
    setErrors({});
  }, [task]);

  if (!task) return null;

  const locale = language === "es" ? "es-ES" : "en-US";
  const link = task.intercomLink ?? task.chatLink ?? "";
  const statusKey = getStatusTranslationKey(task.status);
  const timingKey = getCompletionTimingLabel(task.estimatedCompletionDate, task.completedAt);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateTask(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(
        Object.fromEntries(
          Object.entries(nextErrors).map(([field, key]) => [field, key ? t(key) : ""]),
        ) as Partial<Record<keyof TaskFormValues, string>>,
      );
      return;
    }

    onSave(updateTaskRecord(task, values));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setValues({
      clientName: task.clientName,
      chatLink: task.intercomLink ?? task.chatLink ?? "",
      intercomLink: task.intercomLink ?? task.chatLink ?? "",
      taskDescription: task.taskDetails ?? task.details ?? task.taskDescription,
      taskTitle: "",
      details: task.taskDetails ?? task.details ?? "",
      taskDetails: task.taskDetails ?? task.details ?? "",
      taskType: task.taskType ?? "",
      estimatedCompletionDate: task.estimatedCompletionDate ?? "",
      completedAt: task.completedAt ?? "",
      status: task.status,
    });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              {t("details")}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-ink">{task.clientName}</h2>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white"
              >
                {t("edit")}
              </button>
            ) : null}
            <button type="button" onClick={onClose} className="rounded-2xl border border-line px-4 py-2 text-sm font-semibold text-ink">
              {t("close")}
            </button>
          </div>
        </div>

        {isEditing ? (
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <TaskFields
              values={values}
              errors={errors}
              setValues={setValues}
              availableStatuses={availableStatuses}
              clientSuggestions={clientSuggestions}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("createdAt")}</p>
                <p className="mt-2 text-sm font-semibold text-ink">{new Date(task.createdAt).toLocaleDateString(locale)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("completedAt")}</p>
                <p className="mt-2 text-sm font-semibold text-ink">{task.completedAt ? new Date(task.completedAt).toLocaleDateString(locale) : "—"}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-2xl border border-line px-5 py-3 text-sm font-semibold text-ink"
              >
                {t("cancel")}
              </button>
              <button type="submit" className="rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-white">
                {t("update")}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("clientName")}</p>
              <p className="mt-2 font-semibold text-ink">{task.clientName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("status")}</p>
              <p className="mt-2 font-semibold text-ink">{statusKey ? t(statusKey) : task.status}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("intercomLink")}</p>
              {link ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!isValidUrl(link)) {
                      window.alert(t("invalidLink"));
                      return;
                    }
                    openExternalUrl(link);
                  }}
                  className="mt-2 rounded-2xl border border-line px-4 py-2 text-sm font-semibold text-ink"
                >
                  {isIntercomUrl(link) ? t("openIntercom") : t("openChat")}
                </button>
              ) : (
                <p className="mt-2 text-sm text-muted">—</p>
              )}
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("specifications")}</p>
              <p className="mt-2 text-sm text-ink">{task.taskDetails ?? task.details ?? task.taskDescription}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("taskType")}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{task.taskType ?? "—"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("createdAt")}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{new Date(task.createdAt).toLocaleDateString(locale)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("estimatedCompletionDate")}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{task.estimatedCompletionDate ? new Date(task.estimatedCompletionDate).toLocaleDateString(locale) : "—"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("completedAt")}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{task.completedAt ? new Date(task.completedAt).toLocaleDateString(locale) : "—"}</p>
            </div>
            {timingKey ? (
              <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("details")}</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${timingKey === "onTime" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {t(timingKey)}
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
