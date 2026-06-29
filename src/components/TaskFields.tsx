import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { TaskFormValues } from "../types/task";
import { getStatusTranslationKey } from "../utils/taskHelpers";

interface TaskFieldsProps {
  values: TaskFormValues;
  errors: Partial<Record<keyof TaskFormValues, string>>;
  setValues: Dispatch<SetStateAction<TaskFormValues>>;
  availableStatuses: string[];
  clientSuggestions: string[];
}

export function TaskFields({
  values,
  errors,
  setValues,
  availableStatuses,
  clientSuggestions,
}: TaskFieldsProps) {
  const { t } = useLanguage();

  const handleChange =
    (field: keyof TaskFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
    };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        {t("clientName")}
        <input
          value={values.clientName}
          onChange={handleChange("clientName")}
          placeholder={t("searchClientPlaceholder")}
          list="client-suggestions"
          className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
        />
        {errors.clientName ? <span className="text-xs text-rose-500">{errors.clientName}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        {t("intercomLink")}
        <input
          value={values.intercomLink}
          onChange={handleChange("intercomLink")}
          placeholder={t("defaultChatPlaceholder")}
          className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
        />
        {errors.intercomLink ? <span className="text-xs text-rose-500">{errors.intercomLink}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
        {t("specifications")}
        <textarea
          value={values.taskDetails}
          onChange={handleChange("taskDetails")}
          placeholder={t("notes")}
          className="min-h-28 rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
        />
        {errors.taskDetails ? <span className="text-xs text-rose-500">{errors.taskDetails}</span> : null}
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        {t("taskType")}
        <input
          value={values.taskType}
          onChange={handleChange("taskType")}
          placeholder={t("taskType")}
          className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        {t("estimatedCompletionDate")}
        <input
          type="date"
          value={values.estimatedCompletionDate}
          onChange={handleChange("estimatedCompletionDate")}
          className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        {t("status")}
        <select
          value={values.status}
          onChange={handleChange("status")}
          className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
        >
          {availableStatuses.map((status) => {
            const translationKey = getStatusTranslationKey(status);
            return (
              <option key={status} value={status}>
                {translationKey ? t(translationKey) : status}
              </option>
            );
          })}
        </select>
      </label>

      <datalist id="client-suggestions">
        {clientSuggestions.map((client) => (
          <option key={client} value={client} />
        ))}
      </datalist>
    </div>
  );
}
