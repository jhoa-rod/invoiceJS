import { useEffect, useMemo, useState } from "react";
import type { Invoice } from "../../types/invoice";
import { formatMessage, useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency, formatInvoiceDate } from "../../utils/invoiceMath";
import { getInvoiceCurrencySymbol, getInvoiceDateFormat } from "../../utils/invoiceRegion";

interface InvoiceArchiveProps {
  invoices: Invoice[];
  onCreate: () => void;
  onPreview: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onShare: (invoice: Invoice) => void;
  onDownloadPdf: (invoice: Invoice) => void;
  onDownloadSelectedCsv: (invoices: Invoice[]) => void;
  onExportArchiveCsv: () => void;
  onDeleteSelected: (invoices: Invoice[]) => void;
}

const inputClass =
  "min-h-12 w-full rounded-[12px] border border-line bg-card px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand-soft";

const labelClass = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted";

const actionButtonClass =
  "min-h-11 rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line disabled:hover:shadow-sm";

const statusStyles: Record<Invoice["status"], string> = {
  borrador: "bg-brand-soft text-brand-deep",
  enviada: "bg-[#ebe4f6] text-brand",
  pagada: "bg-gold-soft text-[#806128]",
};

export function InvoiceArchive({
  invoices,
  onCreate,
  onPreview,
  onEdit,
  onShare,
  onDownloadPdf,
  onDownloadSelectedCsv,
  onExportArchiveCsv,
  onDeleteSelected,
}: InvoiceArchiveProps) {
  const { t } = useInvoiceI18n();
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredInvoices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return invoices
      .filter((invoice) => {
        const searchText = [
          invoice.invoiceNumber,
          invoice.client.name,
          invoice.client.taxId,
          formatInvoiceDate(invoice.date, getInvoiceDateFormat(invoice)),
          invoice.date,
        ]
          .join(" ")
          .toLowerCase();
        const matchesQuery = normalizedQuery ? searchText.includes(normalizedQuery) : true;
        const matchesDate = date ? invoice.date === date : true;
        const matchesFrom = fromDate ? invoice.date >= fromDate : true;
        const matchesTo = toDate ? invoice.date <= toDate : true;
        return matchesQuery && matchesDate && matchesFrom && matchesTo;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [date, fromDate, invoices, query, toDate]);

  useEffect(() => {
    const availableIds = new Set(invoices.map((invoice) => invoice.id));
    setSelectedIds((current) => current.filter((id) => availableIds.has(id)));
  }, [invoices]);

  const selectedInvoices = useMemo(
    () => selectedIds.map((id) => invoices.find((invoice) => invoice.id === id)).filter((invoice): invoice is Invoice => Boolean(invoice)),
    [invoices, selectedIds],
  );
  const selectedInvoice = selectedInvoices.length === 1 ? selectedInvoices[0] : null;
  const filteredIds = filteredInvoices.map((invoice) => invoice.id);
  const allVisibleSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((current) => current.filter((id) => !filteredIds.includes(id)));
      return;
    }
    setSelectedIds((current) => Array.from(new Set([...current, ...filteredIds])));
  };

  const toggleInvoice = (invoiceId: string) => {
    setSelectedIds((current) => (current.includes(invoiceId) ? current.filter((id) => id !== invoiceId) : [...current, invoiceId]));
  };

  const statusLabel = (status: Invoice["status"]) => {
    if (status === "borrador") return t("draftStatus");
    if (status === "enviada") return t("sentStatus");
    return t("paidStatus");
  };

  const selectionLabel =
    selectedInvoices.length === 0
      ? t("noInvoicesSelected")
      : selectedInvoices.length === 1
        ? t("oneInvoiceSelected")
        : formatMessage(t("manyInvoicesSelected"), { count: selectedInvoices.length });

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-ink">{t("savedInvoices")}</h2>
          <p className="mt-2 text-lg text-muted">{formatMessage(t("results"), { filtered: filteredInvoices.length, total: invoices.length })}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onExportArchiveCsv}
            className="min-h-12 rounded-[12px] border border-line bg-card px-5 py-3 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
          >
            {t("exportArchiveCsv")}
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="min-h-12 rounded-[12px] bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
          >
            {t("createInvoice")}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="grid gap-2">
            <span className={labelClass}>{t("search")}</span>
            <input className={inputClass} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchPlaceholder")} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("date")}</span>
            <input className={inputClass} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("from")}</span>
            <input className={inputClass} type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("to")}</span>
            <input className={inputClass} type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-brand-soft p-5 shadow-sm">
        <p className="mr-auto font-display text-xl font-extrabold tracking-[-0.03em] text-brand-deep">{selectionLabel}</p>
        <button type="button" className={actionButtonClass} disabled={!selectedInvoice} onClick={() => selectedInvoice && onPreview(selectedInvoice)}>
          {t("view")}
        </button>
        <button type="button" className={actionButtonClass} disabled={!selectedInvoice} onClick={() => selectedInvoice && onEdit(selectedInvoice)}>
          {t("edit")}
        </button>
        <button type="button" className={actionButtonClass} disabled={!selectedInvoice} onClick={() => selectedInvoice && onShare(selectedInvoice)}>
          {t("share")}
        </button>
        <button type="button" className={actionButtonClass} disabled={!selectedInvoice} onClick={() => selectedInvoice && onDownloadPdf(selectedInvoice)}>
          {t("pdf")}
        </button>
        <button
          type="button"
          className={actionButtonClass}
          disabled={selectedInvoices.length === 0}
          onClick={() => onDownloadSelectedCsv(selectedInvoices)}
        >
          {t("csv")}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-[12px] border border-danger/25 bg-card px-5 py-2.5 text-sm font-extrabold text-danger shadow-sm transition hover:-translate-y-px hover:border-danger hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-danger/25 disabled:hover:shadow-sm"
          disabled={selectedInvoices.length === 0}
          onClick={() => onDeleteSelected(selectedInvoices)}
        >
          {t("delete")}
        </button>
      </div>
      <p className="-mt-3 text-sm text-muted">{t("selectionHelp")}</p>

      <div className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface text-left text-muted">
                <th className="w-16 border-b border-line px-6 py-4">
                  <label className="flex items-center">
                    <span className="sr-only">{t("selectAllInvoices")}</span>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      className="h-[18px] w-[18px] rounded border-line accent-brand"
                    />
                  </label>
                </th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("invoiceNumber")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("client")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("date")}</th>
                <th className="border-b border-line px-4 py-4 text-right text-[11px] font-extrabold uppercase tracking-[0.14em]">
                  {t("grossTotal")}
                </th>
                <th className="border-b border-line px-4 py-4 text-right text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("tax")}</th>
                <th className="border-b border-line px-4 py-4 text-right text-[11px] font-extrabold uppercase tracking-[0.14em]">
                  {t("netTotal")}
                </th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const totals = calculateTotals(invoice);
                const currencySymbol = getInvoiceCurrencySymbol(invoice);
                const dateFormat = getInvoiceDateFormat(invoice);
                const isSelected = selectedIds.includes(invoice.id);
                return (
                  <tr key={invoice.id} className={isSelected ? "bg-brand-soft align-top" : "align-top transition hover:bg-surface"}>
                    <td className="border-b border-line px-6 py-5">
                      <label className="flex items-center">
                        <span className="sr-only">{formatMessage(t("selectInvoice"), { number: invoice.invoiceNumber })}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleInvoice(invoice.id)}
                          className="h-[18px] w-[18px] rounded border-line accent-brand"
                        />
                      </label>
                    </td>
                    <td className="border-b border-line px-4 py-5 font-mono text-lg font-bold text-ink">{invoice.invoiceNumber}</td>
                    <td className="border-b border-line px-4 py-5">
                      <span className="block font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{invoice.client.name}</span>
                      <span className="mt-1 block text-sm text-muted">{invoice.client.taxId}</span>
                    </td>
                    <td className="border-b border-line px-4 py-5 text-base text-ink">{formatInvoiceDate(invoice.date, dateFormat)}</td>
                    <td className="border-b border-line px-4 py-5 text-right font-mono text-base font-bold text-ink">
                      {formatCurrency(totals.totalBruto, currencySymbol)}
                    </td>
                    <td className="border-b border-line px-4 py-5 text-right font-mono text-base text-ink">
                      {formatCurrency(totals.irpf, currencySymbol)}
                    </td>
                    <td className="border-b border-line px-4 py-5 text-right font-mono text-lg font-bold text-brand-deep">
                      {formatCurrency(totals.totalNeto, currencySymbol)}
                    </td>
                    <td className="border-b border-line px-4 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[invoice.status]}`}>
                        {statusLabel(invoice.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredInvoices.length === 0 ? <div className="p-10 text-center text-sm font-bold text-muted">{t("noInvoicesFound")}</div> : null}
      </div>
    </section>
  );
}
