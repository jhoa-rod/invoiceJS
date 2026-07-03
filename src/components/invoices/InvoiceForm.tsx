import type { ChangeEvent, FormEvent, ReactNode } from "react";
import type { InvoiceClient } from "../../types/client";
import type { Invoice, InvoiceParty, InvoiceStatus, ServiceLine } from "../../types/invoice";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency, parseNumberInput } from "../../utils/invoiceMath";
import {
  getInvoiceCurrencySymbol,
  getInvoiceRegionConfig,
  getInvoiceTaxIdLabel,
  getInvoiceTaxLabel,
  invoiceRegionConfigs,
  invoiceRegionOptions,
} from "../../utils/invoiceRegion";
import { createEmptyLine } from "../../utils/invoiceStorage";
import { Dropdown } from "../ui/Dropdown";

export type InvoiceErrors = Record<string, string>;

interface InvoiceFormProps {
  invoice: Invoice;
  errors: InvoiceErrors;
  mode: "create" | "edit";
  clients?: InvoiceClient[];
  onChange: (invoice: Invoice) => void;
  onSubmit: (invoice: Invoice) => void;
  onCancel: () => void;
  onSaveClient?: (client: InvoiceParty) => void | Promise<void>;
}

const inputClass =
  "min-h-11 w-full rounded-[12px] border border-line bg-card px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand-soft disabled:cursor-not-allowed disabled:bg-brand-soft/55 disabled:text-muted";

const labelClass = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted";

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <span className={labelClass}>{label}</span>
      {children}
      {error ? <span className="text-xs font-bold text-danger">{error}</span> : null}
    </div>
  );
}

export function InvoiceForm({
  invoice,
  errors,
  mode,
  clients = [],
  onChange,
  onSubmit,
  onCancel,
  onSaveClient,
}: InvoiceFormProps) {
  const { t } = useInvoiceI18n();
  const totals = calculateTotals(invoice);
  const regionConfig = getInvoiceRegionConfig(invoice.issuer);
  const taxLabel = getInvoiceTaxLabel(invoice);
  const taxIdLabel = getInvoiceTaxIdLabel(invoice);
  const currencySymbol = getInvoiceCurrencySymbol(invoice);

  const updateInvoice = (patch: Partial<Invoice>) => onChange({ ...invoice, ...patch });

  const updateIssuer = (field: keyof InvoiceParty, value: string) => {
    onChange({ ...invoice, issuer: { ...invoice.issuer, [field]: value } });
  };

  const updateRegion = (region: InvoiceParty["region"]) => {
    if (!region) return;
    const nextConfig = invoiceRegionConfigs[region];
    onChange({
      ...invoice,
      issuer: {
        ...invoice.issuer,
        region,
        currencySymbol: nextConfig.currencyEditable ? invoice.issuer.currencySymbol ?? "" : nextConfig.defaultCurrencySymbol,
      },
    });
  };

  const updateClient = (field: keyof InvoiceParty, value: string) => {
    onChange({ ...invoice, client: { ...invoice.client, [field]: value } });
  };

  const applySavedClient = (clientId: string) => {
    const savedClient = clients.find((client) => client.id === clientId);
    if (!savedClient) return;
    onChange({
      ...invoice,
      client: {
        ...invoice.client,
        name: savedClient.name,
        taxId: savedClient.taxId,
        address: savedClient.address,
        cityPostal: savedClient.cityPostal,
        email: savedClient.email,
      },
    });
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

  const statusOptions = [
    { value: "borrador", label: t("draftStatus") },
    { value: "enviada", label: t("sentStatus") },
    { value: "pagada", label: t("paidStatus") },
  ];

  const regionOptions = invoiceRegionOptions.map((option) => ({
    value: option.id,
    label: t(option.labelKey),
    description: option.taxLabel,
  }));

  const clientOptions = [
    { value: "", label: t("selectSavedClient") },
    ...clients.map((client) => ({
      value: client.id,
      label: client.name,
      description: client.taxId,
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <section className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">{t("invoiceData")}</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink">
              {mode === "create" ? t("createInvoice") : t("editInvoice")}
            </h2>
            <p className="mt-2 text-lg text-muted">{t("invoiceFormHelp")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-12 rounded-[12px] border border-line bg-card px-5 py-3 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="min-h-12 rounded-[12px] bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
            >
              {t("saveInvoice")}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-card p-5 shadow-sm">
        <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{t("invoiceData")}</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
          <Field label={`${taxLabel} (%)`} error={errors.irpfRate}>
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
            <Dropdown value={invoice.status} options={statusOptions} onChange={(value) => updateInvoice({ status: value as InvoiceStatus })} />
          </Field>
          <Field label={t("billingRegion")}>
            <Dropdown value={regionConfig.id} options={regionOptions} onChange={(value) => updateRegion(value as InvoiceParty["region"])} />
          </Field>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label={t("currencySymbol")}>
            <input
              className={inputClass}
              value={invoice.issuer.currencySymbol ?? currencySymbol}
              onChange={(event) => updateIssuer("currencySymbol", event.target.value)}
              disabled={!regionConfig.currencyEditable}
              placeholder={regionConfig.currencyEditable ? "$" : regionConfig.defaultCurrencySymbol}
            />
          </Field>
        </div>
        <div className="mt-5">
          <Field label={t("period")}>
            <textarea
              className={`${inputClass} min-h-28 resize-y`}
              value={invoice.period}
              onChange={(event) => updateInvoice({ period: event.target.value })}
            />
          </Field>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-card p-5 shadow-sm">
          <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{t("issuerData")}</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label={t("fullName")}>
              <input className={inputClass} value={invoice.issuer.name} onChange={(event) => updateIssuer("name", event.target.value)} />
            </Field>
            <Field label={taxIdLabel}>
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

        <div className="rounded-lg border border-line bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{t("clientData")}</h3>
            {onSaveClient ? (
              <button
                type="button"
                onClick={() => void onSaveClient(invoice.client)}
                disabled={!invoice.client.name.trim()}
                className="min-h-10 rounded-[11px] border border-line bg-card px-4 py-2 text-xs font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {t("saveAsClient")}
              </button>
            ) : null}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {clients.length > 0 ? (
              <div className="sm:col-span-2">
                <Field label={t("savedClient")}>
                  <Dropdown value="" options={clientOptions} placeholder={t("selectSavedClient")} onChange={applySavedClient} />
                </Field>
              </div>
            ) : null}
            <Field label={t("clientName")} error={errors.clientName}>
              <input
                className={inputClass}
                value={invoice.client.name}
                onChange={(event) => updateClient("name", event.target.value)}
                aria-invalid={Boolean(errors.clientName)}
              />
            </Field>
            <Field label={taxIdLabel}>
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

      <section className="rounded-lg border border-line bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{t("serviceLines")}</h3>
            {errors.lines ? <p className="mt-1 text-xs font-bold text-danger">{errors.lines}</p> : null}
          </div>
          <button
            type="button"
            onClick={addLine}
            className="min-h-11 rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
          >
            {t("addLine")}
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface text-left text-muted">
                <th className="border border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("description")}</th>
                <th className="border border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("daysDates")}</th>
                <th className="border border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("hours")}</th>
                <th className="border border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("amount")}</th>
                <th className="w-32 border border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((line) => (
                <tr key={line.id}>
                  <td className="border border-line p-2 align-top">
                    <input className={inputClass} value={line.description} onChange={(event) => updateLine(line.id, { description: event.target.value })} />
                  </td>
                  <td className="border border-line p-2 align-top">
                    <input className={inputClass} value={line.dates} onChange={(event) => updateLine(line.id, { dates: event.target.value })} />
                  </td>
                  <td className="border border-line p-2 align-top">
                    <input className={inputClass} value={line.hours ?? ""} onChange={(event) => updateLine(line.id, { hours: event.target.value })} />
                  </td>
                  <td className="border border-line p-2 align-top">
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
                      <span className="mt-1 block text-xs font-bold text-danger">{errors[`line.${line.id}.amount`]}</span>
                    ) : null}
                  </td>
                  <td className="border border-line p-2 align-top">
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      disabled={invoice.lines.length === 1}
                      className="min-h-11 w-full rounded-[12px] border border-danger/25 bg-card px-3 py-2 text-sm font-extrabold text-danger transition hover:-translate-y-px hover:border-danger hover:shadow-sm disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
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

      <section className="grid gap-3 rounded-lg border border-line bg-card p-5 shadow-sm sm:grid-cols-3">
        <div>
          <p className={labelClass}>{t("grossTotal")}</p>
          <p className="mt-2 font-mono text-3xl font-bold tracking-[-0.04em] text-ink">{formatCurrency(totals.totalBruto, currencySymbol)}</p>
        </div>
        <div>
          <p className={labelClass}>
            {taxLabel} {Number.isFinite(invoice.irpfRate) ? invoice.irpfRate : 0}%
          </p>
          <p className="mt-2 font-mono text-3xl font-bold tracking-[-0.04em] text-ink">{formatCurrency(totals.irpf, currencySymbol)}</p>
        </div>
        <div className="rounded-[14px] bg-ink p-4 text-white">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/60">{t("netTotal")}</p>
          <p className="mt-2 font-mono text-3xl font-bold tracking-[-0.04em]">{formatCurrency(totals.totalNeto, currencySymbol)}</p>
        </div>
      </section>
    </form>
  );
}
