import { useMemo, useState, type ChangeEvent } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { Client } from "../types/client";
import type { ClientImportPreviewRow } from "../types/import";
import { parseImportFile } from "../utils/fileParser";
import { commitClientRows, normalizeClientImportRows } from "../utils/importNormalizer";
import { ImportPreview } from "./ImportPreview";

interface ImportClientsProps {
  existingClients: Client[];
  userId?: string;
  onImport: (clients: Client[]) => void;
}

export function ImportClients({ existingClients, userId, onImport }: ImportClientsProps) {
  const { language, t } = useLanguage();
  const [rows, setRows] = useState<ClientImportPreviewRow[]>([]);
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
      const normalized = normalizeClientImportRows(parsedRows, language, existingClients);
      setRows(normalized.rows);
      setFileName(file.name);
      setError("");
    } catch {
      setError(t("importParseError"));
    }
  };

  const updateRow = (rowId: string, field: keyof ClientImportPreviewRow, value: string | boolean) => {
    setRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    );
  };

  const handleConfirm = () => {
    onImport(commitClientRows(rows, userId));
    setRows([]);
    setFileName("");
  };

  return (
    <div className="grid gap-5">
      <div className="rounded-[24px] border border-dashed border-line bg-slate-50 p-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-extrabold text-ink">{t("importClients")}</h3>
          <p className="text-sm text-muted">{t("importClientsDescription")}</p>
        </div>

        <label className="mt-5 flex cursor-pointer flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-5 transition hover:border-brand/40">
          <span className="text-sm font-semibold text-ink">{t("uploadFile")}</span>
          <span className="text-sm text-muted">{t("supportedFormatsClients")}</span>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="text-sm text-slate-600" />
        </label>

        {fileName ? <p className="mt-3 text-sm font-semibold text-ink">{fileName}</p> : null}
        {error ? <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p> : null}
      </div>

      {rows.length ? (
        <ImportPreview
          title={t("clientsPreview")}
          rowsToImport={stats.rowsToImport}
          rowsWithErrors={stats.rowsWithErrors}
          ignoredRows={stats.ignoredRows}
          onConfirm={handleConfirm}
          confirmLabel={t("importClients")}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">{t("includeRow")}</th>
                  <th className="px-4 py-3">{t("clientName")}</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">{t("phone")}</th>
                  <th className="px-4 py-3">{t("company")}</th>
                  <th className="px-4 py-3">{t("chatLink")}</th>
                  <th className="px-4 py-3">{t("notes")}</th>
                  <th className="px-4 py-3">{t("issues")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const issues = [...row.errors, ...row.warnings];
                  return (
                    <tr key={row.id} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={row.include}
                          onChange={(event) => updateRow(row.id, "include", event.target.checked)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={row.name}
                          onChange={(event) => updateRow(row.id, "name", event.target.value)}
                          className="w-40 rounded-xl border border-line px-3 py-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={row.email}
                          onChange={(event) => updateRow(row.id, "email", event.target.value)}
                          className="w-44 rounded-xl border border-line px-3 py-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={row.phone}
                          onChange={(event) => updateRow(row.id, "phone", event.target.value)}
                          className="w-36 rounded-xl border border-line px-3 py-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={row.company}
                          onChange={(event) => updateRow(row.id, "company", event.target.value)}
                          className="w-40 rounded-xl border border-line px-3 py-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={row.chatLink}
                          onChange={(event) => updateRow(row.id, "chatLink", event.target.value)}
                          className="w-44 rounded-xl border border-line px-3 py-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <textarea
                          value={row.notes}
                          onChange={(event) => updateRow(row.id, "notes", event.target.value)}
                          className="min-h-20 w-48 rounded-xl border border-line px-3 py-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {issues.length ? (
                          <div className="grid gap-1">
                            {issues.map((issue) => (
                              <span
                                key={issue}
                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                  row.errors.includes(issue)
                                    ? "bg-rose-100 text-rose-600"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {issue}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">{t("noIssues")}</span>
                        )}
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
