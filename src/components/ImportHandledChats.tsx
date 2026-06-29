import { useMemo, useState, type ChangeEvent } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { HandledChatImportPreviewRow } from "../types/import";
import type { HandledChat } from "../types/handledChat";
import { parseImportFile } from "../utils/fileParser";
import { commitHandledChatRows, normalizeHandledChatImportRows } from "../utils/importNormalizer";
import { isIntercomUrl, isValidUrl, openExternalUrl } from "../utils/links";
import { normalizeText } from "../utils/taskHelpers";
import { ImportPreview } from "./ImportPreview";

interface ImportHandledChatsProps {
  userId?: string;
  onImport: (chats: HandledChat[]) => void;
}

export function ImportHandledChats({ userId, onImport }: ImportHandledChatsProps) {
  const { language, t } = useLanguage();
  const [rows, setRows] = useState<HandledChatImportPreviewRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const rowsToImport = rows.filter((row) => row.include && row.errors.length === 0).length;
    const rowsWithErrors = rows.filter((row) => row.errors.length > 0).length;
    const ignoredRows = rows.filter((row) => !row.include).length;
    return { rowsToImport, rowsWithErrors, ignoredRows };
  }, [rows]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsedRows = await parseImportFile(file);
      const normalized = normalizeHandledChatImportRows(parsedRows, language);
      setRows(normalized.rows);
      setFileName(file.name);
      setError("");
    } catch {
      setError(t("importParseError"));
    }
  };

  const updateRow = (rowId: string, field: keyof HandledChatImportPreviewRow, value: string | boolean) => {
    setRows((current) => current.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)));
  };

  const handleConfirm = () => {
    onImport(commitHandledChatRows(rows, userId));
    setRows([]);
    setFileName("");
  };

  return (
    <div className="grid gap-5">
      <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-extrabold text-ink">{t("handledChats")}</h3>
          <p className="text-sm text-muted">{t("forBestResults")}</p>
        </div>
        <label className="mt-5 flex cursor-pointer flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-5 transition hover:border-slate-300">
          <span className="text-sm font-semibold text-ink">{t("uploadFile")}</span>
          <span className="text-sm text-muted">{t("supportedFormatsTasks")}</span>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="text-sm text-slate-600" />
        </label>
        {fileName ? <p className="mt-3 text-sm font-semibold text-ink">{fileName}</p> : null}
        {error ? <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p> : null}
      </div>

      {rows.length ? (
        <ImportPreview
          title={t("handledChatsPreview")}
          rowsToImport={stats.rowsToImport}
          rowsWithErrors={stats.rowsWithErrors}
          ignoredRows={stats.ignoredRows}
          onConfirm={handleConfirm}
          confirmLabel={t("importHandledChats")}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">{t("includeRow")}</th>
                  <th className="px-4 py-3">{t("clientName")}</th>
                  <th className="px-4 py-3">{t("intercomLink")}</th>
                  <th className="px-4 py-3">{t("handledAt")}</th>
                  <th className="px-4 py-3">{t("status")}</th>
                  <th className="px-4 py-3">{t("notes")}</th>
                  <th className="px-4 py-3">{t("issues")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const issues = [...row.errors, ...row.warnings];
                  return (
                    <tr key={row.id} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-3"><input type="checkbox" checked={row.include} onChange={(event) => updateRow(row.id, "include", event.target.checked)} className="h-4 w-4 rounded border-slate-300" /></td>
                      <td className="px-4 py-3"><input value={row.clientName} onChange={(event) => updateRow(row.id, "clientName", event.target.value)} className="w-40 rounded-xl border border-line px-3 py-2" /></td>
                      <td className="px-4 py-3"><input value={row.intercomLink} onChange={(event) => updateRow(row.id, "intercomLink", event.target.value)} className="w-44 rounded-xl border border-line px-3 py-2" />{row.intercomLink ? <button type="button" onClick={() => isValidUrl(row.intercomLink) ? openExternalUrl(row.intercomLink) : window.alert(t("invalidLink"))} className="mt-2 rounded-xl border border-line px-2 py-1 text-xs font-semibold text-ink">{isIntercomUrl(row.intercomLink) ? t("openIntercom") : t("openChat")}</button> : null}</td>
                      <td className="px-4 py-3"><input value={row.handledAt} onChange={(event) => updateRow(row.id, "handledAt", event.target.value)} className="w-36 rounded-xl border border-line px-3 py-2" /></td>
                      <td className="px-4 py-3"><input value={row.status} onChange={(event) => updateRow(row.id, "status", event.target.value)} className="w-36 rounded-xl border border-line px-3 py-2" /></td>
                      <td className="px-4 py-3"><textarea value={row.notes} onChange={(event) => updateRow(row.id, "notes", normalizeText(event.target.value))} className="min-h-20 w-48 rounded-xl border border-line px-3 py-2" /></td>
                      <td className="px-4 py-3">
                        {issues.length ? issues.map((issue) => <span key={issue} className={`mb-1 block rounded-full px-2 py-1 text-xs font-semibold ${row.errors.includes(issue) ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700"}`}>{issue}</span>) : <span className="text-slate-400">{t("noIssues")}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ImportPreview>
      ) : null}
    </div>
  );
}
