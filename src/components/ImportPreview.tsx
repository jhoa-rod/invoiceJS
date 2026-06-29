import type { ReactNode } from "react";
import { useLanguage } from "../hooks/useLanguage";

interface ImportPreviewProps {
  title: string;
  rowsToImport: number;
  rowsWithErrors: number;
  ignoredRows: number;
  onConfirm: () => void;
  confirmLabel: string;
  children: ReactNode;
}

export function ImportPreview({
  title,
  rowsToImport,
  rowsWithErrors,
  ignoredRows,
  onConfirm,
  confirmLabel,
  children,
}: ImportPreviewProps) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-ink">{title}</h3>
          <p className="text-sm text-muted">{t("importPreviewHint")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white px-4 py-3 text-sm">
            <p className="text-slate-500">{t("rowsToImport")}</p>
            <p className="mt-1 text-xl font-bold text-ink">{rowsToImport}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm">
            <p className="text-slate-500">{t("rowsWithErrors")}</p>
            <p className="mt-1 text-xl font-bold text-ink">{rowsWithErrors}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm">
            <p className="text-slate-500">{t("ignoredRows")}</p>
            <p className="mt-1 text-xl font-bold text-ink">{ignoredRows}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">{children}</div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
