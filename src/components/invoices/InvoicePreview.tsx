import type { Invoice } from "../../types/invoice";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency, formatInvoiceDate } from "../../utils/invoiceMath";
import { getInvoiceCurrencySymbol, getInvoiceDateFormat, getInvoiceTaxIdLabel, getInvoiceTaxLabel } from "../../utils/invoiceRegion";

interface InvoicePreviewProps {
  invoice: Invoice;
  readOnly?: boolean;
  onEdit?: (invoice: Invoice) => void;
  onShare?: (invoice: Invoice) => void;
  onDownloadPdf?: (invoice: Invoice) => void;
  onDownloadCsv?: (invoice: Invoice) => void;
}

const ActionButton = ({
  children,
  onClick,
  variant = "secondary",
}: {
  children: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) => (
  <button
    type="button"
    onClick={onClick}
    className={
      variant === "primary"
        ? "inline-flex min-h-11 items-center justify-center rounded-[12px] bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
        : "inline-flex min-h-11 items-center justify-center rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
    }
  >
    {children}
  </button>
);

export function InvoicePreview({
  invoice,
  readOnly = false,
  onEdit,
  onShare,
  onDownloadPdf,
  onDownloadCsv,
}: InvoicePreviewProps) {
  const { t } = useInvoiceI18n();
  const totals = calculateTotals(invoice);
  const currencySymbol = getInvoiceCurrencySymbol(invoice);
  const dateFormat = getInvoiceDateFormat(invoice);
  const taxLabel = getInvoiceTaxLabel(invoice);
  const taxIdLabel = getInvoiceTaxIdLabel(invoice);
  const statusLabel =
    invoice.status === "borrador" ? t("draftStatus") : invoice.status === "enviada" ? t("sentStatus") : t("paidStatus");

  return (
    <section className="grid gap-4">
      {!readOnly ? (
        <div className="no-print flex flex-wrap items-center justify-end gap-3">
          {onEdit ? <ActionButton onClick={() => onEdit(invoice)}>{t("edit")}</ActionButton> : null}
          {onShare ? <ActionButton onClick={() => onShare(invoice)}>{t("share")}</ActionButton> : null}
          {onDownloadCsv ? <ActionButton onClick={() => onDownloadCsv(invoice)}>{t("csv")}</ActionButton> : null}
          {onDownloadPdf ? (
            <ActionButton onClick={() => onDownloadPdf(invoice)} variant="primary">
              {t("pdf")}
            </ActionButton>
          ) : null}
        </div>
      ) : null}

      <article className="invoice-sheet mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-line bg-card shadow-md">
        <div className="invoice-print-band bg-brand px-6 py-5 text-white sm:px-8">
          <p className="font-display text-2xl font-extrabold uppercase tracking-[-0.02em]">INVOICE</p>
        </div>

        <div className="p-6 sm:p-8">
          <header className="grid gap-6 border-b border-ink pb-7 sm:grid-cols-[1fr_auto]">
            <div>
              <h1 className="font-display text-5xl font-extrabold uppercase leading-none tracking-[-0.05em] text-ink">{t("invoice")}</h1>
              <div className="mt-6 text-sm leading-6 text-ink">
                <p className="font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{invoice.issuer.name}</p>
                <p>
                  <span className="font-bold text-muted">{taxIdLabel}: </span>
                  {invoice.issuer.taxId}
                </p>
                <p>{invoice.issuer.address}</p>
                <p>{invoice.issuer.cityPostal}</p>
                {invoice.issuer.email ? <p>{invoice.issuer.email}</p> : null}
              </div>
            </div>

            <dl className="grid content-start gap-4 rounded-[14px] bg-surface p-5 text-sm sm:min-w-60">
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{t("invoiceNumber")}</dt>
                <dd className="mt-1 font-mono text-lg font-bold text-ink">{invoice.invoiceNumber}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{t("date")}</dt>
                <dd className="mt-1 font-mono text-lg font-bold text-ink">{formatInvoiceDate(invoice.date, dateFormat)}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{t("status")}</dt>
                <dd className="mt-1 font-bold text-brand-deep">{statusLabel}</dd>
              </div>
            </dl>
          </header>

          <section className="grid gap-5 py-7 text-sm leading-6 text-ink md:grid-cols-[1fr_1fr]">
            <div className="rounded-[14px] bg-brand-soft p-5">
              <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-deep">{t("client")}</p>
              <p className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{invoice.client.name}</p>
              <p>
                <span className="font-bold text-muted">{taxIdLabel}: </span>
                {invoice.client.taxId}
              </p>
              <p>{invoice.client.address}</p>
              <p>{invoice.client.cityPostal}</p>
            </div>

            <div className="grid content-start gap-4 rounded-[14px] border border-line bg-card p-5">
              <div>
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{t("bankAccountLabel")}</p>
                <p className="font-mono font-bold text-ink">{invoice.issuer.iban}</p>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{t("periodLabel")}</p>
                <p>{invoice.period}</p>
              </div>
            </div>
          </section>

          <div className="overflow-hidden rounded-[14px] border border-line">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-brand-soft text-left text-brand-deep">
                    <th className="border-b border-line px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("serviceProvided")}</th>
                    <th className="border-b border-line px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("daysDates")}</th>
                    <th className="border-b border-line px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("hours")}</th>
                    <th className="border-b border-line px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("amount")}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="border-b border-line px-4 py-3 font-bold text-ink">{line.description}</td>
                      <td className="border-b border-line px-4 py-3 text-ink">{line.dates}</td>
                      <td className="border-b border-line px-4 py-3 text-right text-ink">{line.hours}</td>
                      <td className="border-b border-line px-4 py-3 text-right font-mono font-bold text-ink">
                        {formatCurrency(line.amount, currencySymbol)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <section className="ml-auto mt-7 w-full max-w-sm overflow-hidden rounded-[14px] border border-line text-sm shadow-sm">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-bold text-muted">{t("grossTotal")}</span>
              <strong className="font-mono text-ink">{formatCurrency(totals.totalBruto, currencySymbol)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-bold text-muted">
                {taxLabel} {invoice.irpfRate}%
              </span>
              <strong className="font-mono text-ink">{formatCurrency(totals.irpf, currencySymbol)}</strong>
            </div>
            <div className="bg-app-strong flex items-center justify-between px-5 py-4 text-white">
              <span className="font-display text-lg font-extrabold tracking-[-0.03em]">{t("netTotal")}</span>
              <strong className="font-mono text-lg font-bold">{formatCurrency(totals.totalNeto, currencySymbol)}</strong>
            </div>
          </section>
        </div>
      </article>
    </section>
  );
}
