import type { Invoice } from "../../types/invoice";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency, formatInvoiceDate } from "../../utils/invoiceMath";

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
        ? "inline-flex min-h-10 items-center justify-center rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-app-accentStrong"
        : "inline-flex min-h-10 items-center justify-center rounded-md border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:border-app-accent hover:bg-app-bg"
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
  const statusLabel =
    invoice.status === "borrador" ? t("draftStatus") : invoice.status === "enviada" ? t("sentStatus") : t("paidStatus");

  return (
    <section className="grid gap-4">
      {!readOnly ? (
        <div className="no-print flex flex-wrap items-center justify-end gap-2">
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

      <article className="invoice-sheet mx-auto w-full max-w-4xl rounded-lg border border-app-border-subtle bg-white p-5 shadow-sm sm:p-8">
        <header className="grid gap-6 border-b-2 border-app-strong pb-5 sm:grid-cols-[1fr_auto]">
          <div>
            <h1 className="text-3xl font-black text-app-text sm:text-4xl">{t("invoice").toUpperCase()}</h1>
            <div className="mt-5 text-sm leading-6 text-app-text">
              <p className="font-bold text-app-text">{invoice.issuer.name}</p>
              <p>{invoice.issuer.taxId}</p>
              <p>{invoice.issuer.address}</p>
              <p>{invoice.issuer.cityPostal}</p>
              {invoice.issuer.email ? <p>{invoice.issuer.email}</p> : null}
            </div>
          </div>

          <dl className="grid content-start gap-2 text-sm sm:min-w-52 sm:text-right">
            <div>
              <dt className="font-semibold text-app-muted">{t("invoiceNumber")}</dt>
              <dd className="font-bold text-app-text">{invoice.invoiceNumber}</dd>
            </div>
            <div>
              <dt className="font-semibold text-app-muted">{t("date")}</dt>
              <dd className="font-bold text-app-text">{formatInvoiceDate(invoice.date)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-app-muted">{t("status")}</dt>
              <dd className="font-bold text-app-text">{statusLabel}</dd>
            </div>
          </dl>
        </header>

        <section className="grid gap-6 py-6 text-sm leading-6 text-app-text md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-app-muted">{t("client")}</p>
            <p className="font-bold text-app-text">{invoice.client.name}</p>
            <p>{invoice.client.taxId}</p>
            <p>{invoice.client.address}</p>
            <p>{invoice.client.cityPostal}</p>
          </div>

          <div className="grid content-start gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase text-app-muted">{t("bankAccountLabel")}</p>
              <p className="font-semibold text-app-text">{invoice.issuer.iban}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase text-app-muted">{t("periodLabel")}</p>
              <p>{invoice.period}</p>
            </div>
          </div>
        </section>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-app-soft text-left text-app-text">
                <th className="border border-app-border px-3 py-2 font-bold">{t("serviceProvided")}</th>
                <th className="border border-app-border px-3 py-2 font-bold">{t("daysDates")}</th>
                <th className="border border-app-border px-3 py-2 text-right font-bold">{t("hours")}</th>
                <th className="border border-app-border px-3 py-2 text-right font-bold">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((line) => (
                <tr key={line.id}>
                  <td className="border border-app-border px-3 py-2 font-semibold text-app-text">{line.description}</td>
                  <td className="border border-app-border px-3 py-2 text-app-text">{line.dates}</td>
                  <td className="border border-app-border px-3 py-2 text-right text-app-text">{line.hours}</td>
                  <td className="border border-app-border px-3 py-2 text-right font-semibold text-app-text">
                    {formatCurrency(line.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="ml-auto mt-6 w-full max-w-sm overflow-hidden rounded-md border border-app-border text-sm">
          <div className="flex items-center justify-between border-b border-app-border-subtle px-4 py-3">
            <span className="font-semibold text-app-muted">{t("grossTotal")}</span>
            <strong className="text-app-text">{formatCurrency(totals.totalBruto)}</strong>
          </div>
          <div className="flex items-center justify-between border-b border-app-border-subtle px-4 py-3">
            <span className="font-semibold text-app-muted">
              {t("irpf")} {invoice.irpfRate}%
            </span>
            <strong className="text-app-text">{formatCurrency(totals.irpf)}</strong>
          </div>
          <div className="flex items-center justify-between bg-app-strong px-4 py-3 text-white">
            <span className="font-bold">{t("netTotal")}</span>
            <strong>{formatCurrency(totals.totalNeto)}</strong>
          </div>
        </section>
      </article>
    </section>
  );
}
