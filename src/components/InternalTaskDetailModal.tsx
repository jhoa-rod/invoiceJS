import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { InternalTask, InternalTaskFormValues } from "../types/internalTask";
import { getCompletionTimingLabel, getInternalTaskStatusTranslationKey, getPriorityTranslationKey, normalizeInternalTaskStatus, normalizeText } from "../utils/taskHelpers";
import { InternalTaskForm } from "./InternalTaskForm";

interface InternalTaskDetailModalProps {
  task: InternalTask | null;
  availableStatuses: string[];
  onClose: () => void;
  onSave: (task: InternalTask) => void;
}

const emptyValues: InternalTaskFormValues = {
  title: "",
  clientName: "",
  intercomLink: "",
  taskType: "",
  description: "",
  category: "",
  priority: "",
  status: "to do",
  assignee: "",
  dueDate: "",
  estimatedCompletionDate: "",
  completedAt: "",
  notes: "",
  relatedLink: "",
};

export function InternalTaskDetailModal({ task, availableStatuses, onClose, onSave }: InternalTaskDetailModalProps) {
  const { language, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<InternalTaskFormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof InternalTaskFormValues, string>>>({});

  useEffect(() => {
    if (!task) {
      setIsEditing(false);
      setValues(emptyValues);
      setErrors({});
      return;
    }

    setIsEditing(false);
    setValues({
      title: task.title,
      clientName: "",
      intercomLink: "",
      taskType: task.taskType ?? "",
      description: task.description ?? task.notes ?? "",
      category: "",
      priority: task.priority ?? "",
      status: task.status,
      assignee: "",
      dueDate: task.estimatedCompletionDate ?? task.dueDate ?? "",
      estimatedCompletionDate: task.estimatedCompletionDate ?? task.dueDate ?? "",
      completedAt: task.completedAt ?? "",
      notes: "",
      relatedLink: "",
    });
    setErrors({});
  }, [task]);

  if (!task) return null;

  const locale = language === "es" ? "es-ES" : "en-US";
  const statusKey = getInternalTaskStatusTranslationKey(task.status);
  const priorityKey = getPriorityTranslationKey(task.priority ?? "");
  const timingKey = getCompletionTimingLabel(task.estimatedCompletionDate ?? task.dueDate, task.completedAt);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof InternalTaskFormValues, string>> = {};
    if (!normalizeText(values.title)) nextErrors.title = t("taskTitleRequired");
    if (!normalizeText(values.status)) nextErrors.status = t("statusRequired");

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const estimatedCompletionDate = values.estimatedCompletionDate || values.dueDate || undefined;
    const status = normalizeInternalTaskStatus(values.status);
    const completedAt = status === "done" ? task.completedAt ?? new Date().toISOString() : undefined;

    onSave({
      ...task,
      title: normalizeText(values.title),
      clientName: undefined,
      intercomLink: undefined,
      taskType: normalizeText(values.taskType) || undefined,
      description: normalizeText(values.description) || undefined,
      priority: normalizeText(values.priority) || undefined,
      status,
      dueDate: estimatedCompletionDate,
      estimatedCompletionDate,
      completedAt,
      notes: normalizeText(values.description) || undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    setValues({
      title: task.title,
      clientName: "",
      intercomLink: "",
      taskType: task.taskType ?? "",
      description: task.description ?? task.notes ?? "",
      category: "",
      priority: task.priority ?? "",
      status: task.status,
      assignee: "",
      dueDate: task.estimatedCompletionDate ?? task.dueDate ?? "",
      estimatedCompletionDate: task.estimatedCompletionDate ?? task.dueDate ?? "",
      completedAt: task.completedAt ?? "",
      notes: "",
      relatedLink: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              {t("details")}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-ink">{task.title}</h2>
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
          <InternalTaskForm
            values={values}
            errors={errors}
            availableStatuses={availableStatuses}
            onChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            isEditing
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("status")}</p>
              <p className="mt-2 font-semibold text-ink">{statusKey ? t(statusKey) : task.status}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("priority")}</p>
              <p className="mt-2 font-semibold text-ink">{priorityKey ? t(priorityKey) : task.priority ?? "—"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("taskType")}</p>
              <p className="mt-2 font-semibold text-ink">{task.taskType ?? "—"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("createdAt")}</p>
              <p className="mt-2 font-semibold text-ink">{new Date(task.createdAt).toLocaleDateString(locale)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("estimatedCompletionDate")}</p>
              <p className="mt-2 font-semibold text-ink">{task.estimatedCompletionDate ?? task.dueDate ? new Date(task.estimatedCompletionDate ?? task.dueDate ?? "").toLocaleDateString(locale) : "—"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("completedAt")}</p>
              <p className="mt-2 font-semibold text-ink">{task.completedAt ? new Date(task.completedAt).toLocaleDateString(locale) : "—"}</p>
            </div>
            {task.description ? (
              <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("description")}</p>
                <p className="mt-2 text-sm text-ink">{task.description}</p>
              </div>
            ) : null}
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
