import type { FormEvent } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { InternalTaskFormValues } from "../types/internalTask";
import {
  DEFAULT_INTERNAL_TASK_STATUSES,
  INTERNAL_TASK_PRIORITY_OPTIONS,
  getInternalTaskStatusTranslationKey,
  getPriorityTranslationKey,
} from "../utils/taskHelpers";

interface InternalTaskFormProps {
  values: InternalTaskFormValues;
  errors: Partial<Record<keyof InternalTaskFormValues, string>>;
  availableStatuses: string[];
  onChange: (field: keyof InternalTaskFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function InternalTaskForm({
  values,
  errors,
  availableStatuses,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
}: InternalTaskFormProps) {
  const { t } = useLanguage();
  const statusOptions = Array.from(new Set([...DEFAULT_INTERNAL_TASK_STATUSES, ...availableStatuses]));

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2 xl:col-span-4">
          {t("title")}
          <input
            value={values.title}
            onChange={(event) => onChange("title", event.target.value)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
          {errors.title ? <span className="text-xs text-rose-500">{errors.title}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          {t("taskType")}
          <input
            value={values.taskType}
            onChange={(event) => onChange("taskType", event.target.value)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          {t("priority")}
          <select
            value={values.priority}
            onChange={(event) => onChange("priority", event.target.value)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          >
            <option value="">{t("allPriorities")}</option>
            {INTERNAL_TASK_PRIORITY_OPTIONS.map((priority) => {
              const key = getPriorityTranslationKey(priority);
              return (
                <option key={priority} value={priority}>
                  {key ? t(key) : priority}
                </option>
              );
            })}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          {t("status")}
          <input
            list="internal-task-status-options"
            value={values.status}
            onChange={(event) => onChange("status", event.target.value)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
          {errors.status ? <span className="text-xs text-rose-500">{errors.status}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          {t("estimatedCompletionDate")}
          <input
            type="date"
            value={values.estimatedCompletionDate}
            onChange={(event) => onChange("estimatedCompletionDate", event.target.value)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2 xl:col-span-4">
          {t("description")}
          <textarea
            value={values.description}
            onChange={(event) => onChange("description", event.target.value)}
            className="min-h-24 rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </label>
      </div>

      <datalist id="internal-task-status-options">
        {statusOptions.map((status) => {
          const key = getInternalTaskStatusTranslationKey(status);
          return (
            <option key={status} value={status}>
              {key ? t(key) : status}
            </option>
          );
        })}
      </datalist>

      <div className="flex flex-wrap justify-end gap-3">
        {isEditing ? (
          <button type="button" onClick={onCancel} className="rounded-2xl border border-line px-5 py-3 text-sm font-semibold text-ink">
            {t("cancel")}
          </button>
        ) : null}
        <button type="submit" className="rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-white">
          {isEditing ? t("editInternalTask") : t("addInternalTask")}
        </button>
      </div>
    </form>
  );
}
