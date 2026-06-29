import { useMemo, useState } from "react";
import type { Invoice } from "../../types/invoice";
import { formatMessage, useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency, formatInvoiceDate } from "../../utils/invoiceMath";

interface InvoiceArchiveProps {
  invoices: Invoice[];
  onCreate: () => void;
  onPreview: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onShare: (invoice: Invoice) => void;
  onDownloadPdf: (invoice: Invoice) => void;
  onDownloadCsv: (invoice: Invoice) => void;
  onExportArchiveCsv: () => void;
}

const inputClass =
  "min-h-10 w-full rounded-md border border-app-border bg-white px-3 py-2 text-sm text-app-text outline-none transition placeholder:text-app-muted/60 focus:border-app-accent focus:ring-2 focus:ring-app-soft";

const actionClass =
  "min-h-9 rounded-md border border-app-border bg-white px-3 py-1.5 text-xs font-bold text-app-text transition hover:border-app-accent hover:bg-app-bg";

export function InvoiceArchive({
  invoices,
  onCreate,
  onPreview,
  onEdit,
  onDelete,
  onShare,
  onDownloadPdf,
  onDownloadCsv,
  onExportArchiveCsv,
}: InvoiceArchiveProps) {
  const { t } = useInvoiceI18n();
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredInvoices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return invoices
      .filter((invoice) => {
        const searchText = [
          invoice.invoiceNumber,
          invoice.client.name,
          invoice.client.taxId,
          formatInvoiceDate(invoice.date),
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

  const statusLabel = (status: Invoice["status"]) => {
    if (status === "borrador") return t("draftStatus");
    if (status === "enviada") return t("sentStatus");
    return t("paidStatus");
  };

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 className="text-2xl font-black text-app-text">{t("savedInvoices")}</h2>
          <p className="mt-1 text-sm text-app-muted">
            {formatMessage(t("results"), { filtered: filteredInvoices.length, total: invoices.length })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onExportArchiveCsv}
            className="min-h-10 rounded-md border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text hover:border-app-accent hover:bg-app-bg"
          >
            {t("exportArchiveCsv")}
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="min-h-10 rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white hover:bg-app-accentStrong"
          >
            {t("createInvoice")}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-app-muted">{t("search")}</span>
            <input
              className={inputClass}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-app-muted">{t("date")}</span>
            <input className={inputClass} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-app-muted">{t("from")}</span>
            <input className={inputClass} type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-app-muted">{t("to")}</span>
            <input className={inputClass} type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-app-border-subtle bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-app-soft text-left text-app-text">
                <th className="border-b border-app-border px-4 py-3">{t("invoiceNumber")}</th>
                <th className="border-b border-app-border px-4 py-3">{t("client")}</th>
                <th className="border-b border-app-border px-4 py-3">{t("date")}</th>
                <th className="border-b border-app-border px-4 py-3 text-right">{t("grossTotal")}</th>
                <th className="border-b border-app-border px-4 py-3 text-right">{t("irpf")}</th>
                <th className="border-b border-app-border px-4 py-3 text-right">{t("netTotal")}</th>
                <th className="border-b border-app-border px-4 py-3">{t("status")}</th>
                <th className="border-b border-app-border px-4 py-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const totals = calculateTotals(invoice);
                return (
                  <tr key={invoice.id} className="align-top hover:bg-app-bg">
                    <td className="border-b border-app-border-subtle px-4 py-3 font-bold text-app-text">{invoice.invoiceNumber}</td>
                    <td className="border-b border-app-border-subtle px-4 py-3">
                      <span className="block font-semibold text-app-text">{invoice.client.name}</span>
                      <span className="text-xs text-app-muted">{invoice.client.taxId}</span>
                    </td>
                    <td className="border-b border-app-border-subtle px-4 py-3 text-app-muted">{formatInvoiceDate(invoice.date)}</td>
                    <td className="border-b border-app-border-subtle px-4 py-3 text-right font-semibold">{formatCurrency(totals.totalBruto)}</td>
                    <td className="border-b border-app-border-subtle px-4 py-3 text-right font-semibold">{formatCurrency(totals.irpf)}</td>
                    <td className="border-b border-app-border-subtle px-4 py-3 text-right font-bold text-app-positive">
                      {formatCurrency(totals.totalNeto)}
                    </td>
                    <td className="border-b border-app-border-subtle px-4 py-3">
                      <span className="rounded-md border border-app-border bg-app-bg px-2 py-1 text-xs font-bold capitalize text-app-text">
                        {statusLabel(invoice.status)}
                      </span>
                    </td>
                    <td className="border-b border-app-border-subtle px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className={actionClass} onClick={() => onPreview(invoice)}>
                          {t("view")}
                        </button>
                        <button type="button" className={actionClass} onClick={() => onEdit(invoice)}>
                          {t("edit")}
                        </button>
                        <button type="button" className={actionClass} onClick={() => onShare(invoice)}>
                          {t("share")}
                        </button>
                        <button type="button" className={actionClass} onClick={() => onDownloadPdf(invoice)}>
                          PDF
                        </button>
                        <button type="button" className={actionClass} onClick={() => onDownloadCsv(invoice)}>
                          CSV
                        </button>
                        <button
                          type="button"
                          className="min-h-9 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-700 transition hover:border-red-400"
                          onClick={() => onDelete(invoice)}
                        >
                          {t("delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredInvoices.length === 0 ? (
          <div className="p-8 text-center text-sm font-semibold text-app-muted">{t("noInvoicesFound")}</div>
        ) : null}
      </div>
    </section>
  );
}
