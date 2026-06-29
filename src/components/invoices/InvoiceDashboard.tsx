import type { Invoice } from "../../types/invoice";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency, formatInvoiceDate } from "../../utils/invoiceMath";

interface InvoiceDashboardProps {
  invoices: Invoice[];
  onCreate: () => void;
  onOpenArchive: () => void;
  onPreview: (invoice: Invoice) => void;
}

export function InvoiceDashboard({ invoices, onCreate, onOpenArchive, onPreview }: InvoiceDashboardProps) {
  const { t } = useInvoiceI18n();
  const totals = invoices.reduce(
    (acc, invoice) => {
      const invoiceTotals = calculateTotals(invoice);
      return {
        bruto: acc.bruto + invoiceTotals.totalBruto,
        irpf: acc.irpf + invoiceTotals.irpf,
        neto: acc.neto + invoiceTotals.totalNeto,
      };
    },
    { bruto: 0, irpf: 0, neto: 0 },
  );

  const statusCount = invoices.reduce<Record<string, number>>((acc, invoice) => {
    acc[invoice.status] = (acc[invoice.status] ?? 0) + 1;
    return acc;
  }, {});

  const latestInvoices = [...invoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  const statusLabels = [
    { status: "borrador", label: t("drafts") },
    { status: "enviada", label: t("sent") },
    { status: "pagada", label: t("paid") },
  ];

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 className="text-2xl font-black text-app-text">{t("summary")}</h2>
          <p className="mt-1 text-sm text-app-muted">{t("summaryDescription")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenArchive}
            className="min-h-10 rounded-md border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text hover:border-app-accent hover:bg-app-bg"
          >
            {t("archive")}
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="min-h-10 rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white hover:bg-app-accentStrong"
          >
            {t("createInvoice")}
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-app-muted">{t("invoices")}</p>
          <p className="mt-2 text-3xl font-black text-app-text">{invoices.length}</p>
        </div>
        <div className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-app-muted">{t("grossTotal")}</p>
          <p className="mt-2 text-3xl font-black text-app-text">{formatCurrency(totals.bruto)}</p>
        </div>
        <div className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-app-muted">{t("irpf")}</p>
          <p className="mt-2 text-3xl font-black text-app-text">{formatCurrency(totals.irpf)}</p>
        </div>
        <div className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-app-muted">{t("netTotal")}</p>
          <p className="mt-2 text-3xl font-black text-app-positive">{formatCurrency(totals.neto)}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-base font-bold text-app-text">{t("status")}</h3>
          <div className="mt-4 grid gap-3">
            {statusLabels.map(({ status, label }) => (
              <div key={status} className="flex items-center justify-between border-b border-app-border-subtle pb-3 last:border-0 last:pb-0">
                <span className="text-sm font-semibold text-app-muted">{label}</span>
                <strong className="text-lg text-app-text">{statusCount[status] ?? 0}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-base font-bold text-app-text">{t("latestInvoices")}</h3>
          <div className="mt-4 grid gap-2">
            {latestInvoices.map((invoice) => {
              const invoiceTotals = calculateTotals(invoice);
              return (
                <button
                  key={invoice.id}
                  type="button"
                  onClick={() => onPreview(invoice)}
                  className="grid gap-2 rounded-md border border-app-border-subtle p-3 text-left transition hover:border-app-accent hover:bg-app-bg sm:grid-cols-[1fr_auto]"
                >
                  <span>
                    <span className="block font-bold text-app-text">{invoice.invoiceNumber}</span>
                    <span className="block text-sm text-app-muted">{invoice.client.name}</span>
                  </span>
                  <span className="text-sm font-semibold text-app-muted sm:text-right">
                    {formatInvoiceDate(invoice.date)}
                    <span className="block text-app-text">{formatCurrency(invoiceTotals.totalNeto)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
