import type { FormEvent } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { HandledChatFormValues } from "../types/handledChat";
interface HandledChatFormProps {
  values: HandledChatFormValues;
  errors: Partial<Record<keyof HandledChatFormValues, string>>;
  onChange: (field: keyof HandledChatFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function HandledChatForm({
  values,
  errors,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
}: HandledChatFormProps) {
  const { t } = useLanguage();

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          {t("clientName")}
          <input
            value={values.clientName}
            onChange={(event) => onChange("clientName", event.target.value)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
          {errors.clientName ? <span className="text-xs text-rose-500">{errors.clientName}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          {t("intercomLink")}
          <input
            value={values.intercomLink}
            onChange={(event) => onChange("intercomLink", event.target.value)}
            placeholder={t("defaultChatPlaceholder")}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
          {errors.intercomLink ? <span className="text-xs text-rose-500">{errors.intercomLink}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          {t("handledAt")}
          <input
            type="datetime-local"
            value={values.handledAt}
            onChange={(event) => onChange("handledAt", event.target.value)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          {t("status")}
          <select
            value={values.status}
            onChange={(event) => onChange("status", event.target.value)}
            className="rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          >
            <option value="open">{t("open")}</option>
            <option value="closed">{t("closed")}</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-4">
          {t("notes")}
          <textarea
            value={values.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            className="min-h-28 rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </label>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-line px-5 py-3 text-sm font-semibold text-ink"
          >
            {t("cancel")}
          </button>
        ) : null}
        <button type="submit" className="rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-white">
          {isEditing ? t("editHandledChat") : t("addHandledChat")}
        </button>
      </div>
    </form>
  );
}
