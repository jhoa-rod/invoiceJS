import type { ChangeEvent, FormEvent, ReactNode } from "react";
import type { Invoice, InvoiceParty, InvoiceStatus, ServiceLine } from "../../types/invoice";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency, parseNumberInput } from "../../utils/invoiceMath";
import { createEmptyLine } from "../../utils/invoiceStorage";

export type InvoiceErrors = Record<string, string>;

interface InvoiceFormProps {
  invoice: Invoice;
  errors: InvoiceErrors;
  mode: "create" | "edit";
  onChange: (invoice: Invoice) => void;
  onSubmit: (invoice: Invoice) => void;
  onCancel: () => void;
}

const inputClass =
  "min-h-10 w-full rounded-md border border-app-border bg-white px-3 py-2 text-sm text-app-text outline-none transition placeholder:text-app-muted/60 focus:border-app-accent focus:ring-2 focus:ring-app-soft";

const labelClass = "text-xs font-bold uppercase text-app-muted";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1">
      <span className={labelClass}>{label}</span>
      {children}
      {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
    </label>
  );
}

export function InvoiceForm({ invoice, errors, mode, onChange, onSubmit, onCancel }: InvoiceFormProps) {
  const { t } = useInvoiceI18n();
  const totals = calculateTotals(invoice);

  const updateInvoice = (patch: Partial<Invoice>) => onChange({ ...invoice, ...patch });

  const updateIssuer = (field: keyof InvoiceParty, value: string) => {
    onChange({ ...invoice, issuer: { ...invoice.issuer, [field]: value } });
  };

  const updateClient = (field: keyof InvoiceParty, value: string) => {
    onChange({ ...invoice, client: { ...invoice.client, [field]: value } });
  };

  const updateLine = (lineId: string, patch: Partial<ServiceLine>) => {
    onChange({
      ...invoice,
      lines: invoice.lines.map((line) => (line.id === lineId ? { ...line, ...patch } : line)),
    });
  };

  const addLine = () => {
    onChange({ ...invoice, lines: [...invoice.lines, createEmptyLine()] });
  };

  const removeLine = (lineId: string) => {
    onChange({ ...invoice, lines: invoice.lines.filter((line) => line.id !== lineId) });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(invoice);
  };

  const handleIrpfChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateInvoice({ irpfRate: parseNumberInput(event.target.value) });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <section className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-app-text">
              {mode === "create" ? t("createInvoice") : t("editInvoice")}
            </h2>
            <p className="mt-1 text-sm text-app-muted">{t("invoiceFormHelp")}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-10 rounded-md border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text hover:border-app-accent hover:bg-app-bg"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="min-h-10 rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white hover:bg-app-accentStrong"
            >
              {t("saveInvoice")}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
        <h3 className="text-base font-bold text-app-text">{t("invoiceData")}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t("invoiceNumber")} error={errors.invoiceNumber}>
            <input
              className={inputClass}
              value={invoice.invoiceNumber}
              onChange={(event) => updateInvoice({ invoiceNumber: event.target.value })}
              aria-invalid={Boolean(errors.invoiceNumber)}
            />
          </Field>
          <Field label={t("date")} error={errors.date}>
            <input
              className={inputClass}
              type="date"
              value={invoice.date}
              onChange={(event) => updateInvoice({ date: event.target.value })}
              aria-invalid={Boolean(errors.date)}
            />
          </Field>
          <Field label={t("irpfPercent")} error={errors.irpfRate}>
            <input
              className={inputClass}
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={Number.isFinite(invoice.irpfRate) ? invoice.irpfRate : ""}
              onChange={handleIrpfChange}
              aria-invalid={Boolean(errors.irpfRate)}
            />
          </Field>
          <Field label={t("status")}>
            <select
              className={inputClass}
              value={invoice.status}
              onChange={(event) => updateInvoice({ status: event.target.value as InvoiceStatus })}
            >
              <option value="borrador">{t("draftStatus")}</option>
              <option value="enviada">{t("sentStatus")}</option>
              <option value="pagada">{t("paidStatus")}</option>
            </select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label={t("period")}>
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={invoice.period}
              onChange={(event) => updateInvoice({ period: event.target.value })}
            />
          </Field>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-base font-bold text-app-text">{t("issuerData")}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={t("fullName")}>
              <input className={inputClass} value={invoice.issuer.name} onChange={(event) => updateIssuer("name", event.target.value)} />
            </Field>
            <Field label={t("taxNumber")}>
              <input className={inputClass} value={invoice.issuer.taxId} onChange={(event) => updateIssuer("taxId", event.target.value)} />
            </Field>
            <Field label={t("address")}>
              <input className={inputClass} value={invoice.issuer.address} onChange={(event) => updateIssuer("address", event.target.value)} />
            </Field>
            <Field label={t("cityPostal")}>
              <input
                className={inputClass}
                value={invoice.issuer.cityPostal}
                onChange={(event) => updateIssuer("cityPostal", event.target.value)}
              />
            </Field>
            <Field label={t("email")}>
              <input className={inputClass} type="email" value={invoice.issuer.email ?? ""} onChange={(event) => updateIssuer("email", event.target.value)} />
            </Field>
            <Field label={t("bankAccount")}>
              <input className={inputClass} value={invoice.issuer.iban ?? ""} onChange={(event) => updateIssuer("iban", event.target.value)} />
            </Field>
          </div>
        </div>

        <div className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-base font-bold text-app-text">{t("clientData")}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={t("clientName")} error={errors.clientName}>
              <input
                className={inputClass}
                value={invoice.client.name}
                onChange={(event) => updateClient("name", event.target.value)}
                aria-invalid={Boolean(errors.clientName)}
              />
            </Field>
            <Field label={t("taxId")}>
              <input className={inputClass} value={invoice.client.taxId} onChange={(event) => updateClient("taxId", event.target.value)} />
            </Field>
            <Field label={t("address")}>
              <input className={inputClass} value={invoice.client.address} onChange={(event) => updateClient("address", event.target.value)} />
            </Field>
            <Field label={t("cityPostal")}>
              <input
                className={inputClass}
                value={invoice.client.cityPostal}
                onChange={(event) => updateClient("cityPostal", event.target.value)}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-app-text">{t("serviceLines")}</h3>
            {errors.lines ? <p className="mt-1 text-xs font-semibold text-red-600">{errors.lines}</p> : null}
          </div>
          <button
            type="button"
            onClick={addLine}
            className="min-h-10 rounded-md border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text hover:border-app-accent hover:bg-app-bg"
          >
            {t("addLine")}
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[820px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-app-soft text-left text-app-text">
                <th className="border border-app-border px-3 py-2">{t("description")}</th>
                <th className="border border-app-border px-3 py-2">{t("daysDates")}</th>
                <th className="border border-app-border px-3 py-2">{t("hours")}</th>
                <th className="border border-app-border px-3 py-2">{t("amount")}</th>
                <th className="w-28 border border-app-border px-3 py-2">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((line) => (
                <tr key={line.id}>
                  <td className="border border-app-border p-2 align-top">
                    <input
                      className={inputClass}
                      value={line.description}
                      onChange={(event) => updateLine(line.id, { description: event.target.value })}
                    />
                  </td>
                  <td className="border border-app-border p-2 align-top">
                    <input className={inputClass} value={line.dates} onChange={(event) => updateLine(line.id, { dates: event.target.value })} />
                  </td>
                  <td className="border border-app-border p-2 align-top">
                    <input className={inputClass} value={line.hours ?? ""} onChange={(event) => updateLine(line.id, { hours: event.target.value })} />
                  </td>
                  <td className="border border-app-border p-2 align-top">
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      step="0.01"
                      value={Number.isFinite(line.amount) ? line.amount : ""}
                      onChange={(event) => updateLine(line.id, { amount: parseNumberInput(event.target.value) })}
                      aria-invalid={Boolean(errors[`line.${line.id}.amount`])}
                    />
                    {errors[`line.${line.id}.amount`] ? (
                      <span className="mt-1 block text-xs font-semibold text-red-600">{errors[`line.${line.id}.amount`]}</span>
                    ) : null}
                  </td>
                  <td className="border border-app-border p-2 align-top">
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      disabled={invoice.lines.length === 1}
                      className="min-h-10 w-full rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {t("remove")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-3 rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm sm:grid-cols-3">
        <div>
          <p className="text-xs font-bold uppercase text-app-muted">{t("grossTotal")}</p>
          <p className="mt-1 text-2xl font-black text-app-text">{formatCurrency(totals.totalBruto)}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-app-muted">
            {t("irpf")} {Number.isFinite(invoice.irpfRate) ? invoice.irpfRate : 0}%
          </p>
          <p className="mt-1 text-2xl font-black text-app-text">{formatCurrency(totals.irpf)}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-app-muted">{t("netTotal")}</p>
          <p className="mt-1 text-2xl font-black text-app-positive">{formatCurrency(totals.totalNeto)}</p>
        </div>
      </section>
    </form>
  );
}
