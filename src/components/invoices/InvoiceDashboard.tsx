import type { Invoice } from "../../types/invoice";
import { formatMessage, useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency } from "../../utils/invoiceMath";
import { getInvoiceCurrencySymbol } from "../../utils/invoiceRegion";

interface InvoiceDashboardProps {
  invoices: Invoice[];
  userEmail?: string;
  onCreate: () => void;
  onOpenArchive: () => void;
  onPreview: (invoice: Invoice) => void;
}

const statusStyles: Record<Invoice["status"], string> = {
  borrador: "bg-brand-soft text-brand-deep",
  enviada: "bg-[#ebe4f6] text-brand",
  pagada: "bg-gold-soft text-[#806128]",
};

const statusBarStyles: Record<Invoice["status"], string> = {
  borrador: "bg-line",
  enviada: "bg-brand",
  pagada: "bg-gold",
};

const getInitials = (name: string) => {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials || "IJ";
};

const getDisplayName = (email?: string) => {
  if (!email) return "InvoiceJS";
  const localPart = email.split("@")[0] ?? "";
  const firstName = localPart.split(/[._-]/)[0] ?? localPart;
  return firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : "InvoiceJS";
};

export function InvoiceDashboard({ invoices, userEmail, onCreate, onOpenArchive, onPreview }: InvoiceDashboardProps) {
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

  const statusCount = invoices.reduce<Record<Invoice["status"], number>>(
    (acc, invoice) => {
      acc[invoice.status] += 1;
      return acc;
    },
    { borrador: 0, enviada: 0, pagada: 0 },
  );

  const latestInvoices = [...invoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  const summaryCurrencySymbol = invoices[0] ? getInvoiceCurrencySymbol(invoices[0]) : "€";
  const displayName = getDisplayName(userEmail);
  const hour = new Date().getHours();
  const greetingKey = hour < 12 ? "greetingMorning" : hour < 20 ? "greetingAfternoon" : "greetingEvening";
  const statusLabels: Array<{ status: Invoice["status"]; label: string }> = [
    { status: "borrador", label: t("drafts") },
    { status: "enviada", label: t("sent") },
    { status: "pagada", label: t("paid") },
  ];

  const totalStatus = Math.max(invoices.length, 1);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">{t("overview")}</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-5xl">
            {formatMessage(t(greetingKey), { name: displayName })}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex min-h-12 items-center justify-center rounded-[12px] bg-ink px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md"
        >
          + {t("newInvoice")}
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg bg-[linear-gradient(135deg,#1c1625,#352542)] p-6 text-white shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/60">{t("netTotal")}</p>
              <p className="mt-3 font-mono text-3xl font-bold tracking-[-0.04em]">{formatCurrency(totals.neto, summaryCurrencySymbol)}</p>
              <p className="mt-2 text-sm text-white/58">{formatMessage(t("acrossInvoices"), { count: invoices.length })}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-gold/20 font-mono text-lg font-bold text-gold">
              {summaryCurrencySymbol || "$"}
            </span>
          </div>
        </article>

        <article className="rounded-lg border border-line bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">{t("invoices")}</p>
              <p className="mt-3 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink">{invoices.length}</p>
              <p className="mt-2 text-sm text-muted">{t("allTime")}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-gold-soft font-mono text-lg font-bold text-gold">
              {invoices.length}
            </span>
          </div>
        </article>

        <article className="rounded-lg border border-line bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">{t("grossTotal")}</p>
              <p className="mt-3 font-mono text-3xl font-bold tracking-[-0.04em] text-ink">{formatCurrency(totals.bruto, summaryCurrencySymbol)}</p>
              <p className="mt-2 text-sm text-muted">{t("beforeTax")}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-gold-soft font-display text-lg font-extrabold text-gold">
              Σ
            </span>
          </div>
        </article>

        <article className="rounded-lg border border-line bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">{t("taxWithheld")}</p>
              <p className="mt-3 font-mono text-3xl font-bold tracking-[-0.04em] text-ink">{formatCurrency(totals.irpf, summaryCurrencySymbol)}</p>
              <p className="mt-2 text-sm text-muted">{t("combinedTax")}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-gold-soft font-display text-lg font-extrabold text-gold">
              %
            </span>
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-line bg-card p-6 shadow-sm">
        <h3 className="font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{t("statusBreakdown")}</h3>
        <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-brand-soft">
          {statusLabels.map(({ status }) => {
            const width = `${(statusCount[status] / totalStatus) * 100}%`;
            return <span key={status} className={statusBarStyles[status]} style={{ width }} aria-hidden="true" />;
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted">
          {statusLabels.map(({ status, label }) => (
            <span key={status} className="inline-flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${statusBarStyles[status]}`} aria-hidden="true" />
              {label} · {statusCount[status]}
            </span>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5">
          <h3 className="font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{t("latestInvoices")}</h3>
          <button
            type="button"
            onClick={onOpenArchive}
            className="text-sm font-extrabold text-brand transition hover:text-brand-deep"
          >
            {t("viewArchive")} →
          </button>
        </div>

        <div className="divide-y divide-line">
          {latestInvoices.map((invoice) => {
            const invoiceTotals = calculateTotals(invoice);
            const invoiceCurrencySymbol = getInvoiceCurrencySymbol(invoice);
            const statusLabel =
              invoice.status === "borrador" ? t("draftStatus") : invoice.status === "enviada" ? t("sentStatus") : t("paidStatus");
            return (
              <button
                key={invoice.id}
                type="button"
                onClick={() => onPreview(invoice)}
                className="grid w-full gap-4 px-6 py-5 text-left transition hover:bg-brand-soft/55 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-brand-soft font-display text-sm font-extrabold text-brand-deep">
                  {getInitials(invoice.client.name)}
                </span>
                <span>
                  <span className="block font-mono text-base font-bold text-ink">{invoice.invoiceNumber}</span>
                  <span className="mt-1 block text-sm font-medium text-muted">{invoice.client.name}</span>
                </span>
                <span className="sm:text-right">
                  <span className="block font-mono text-base font-bold text-ink">{formatCurrency(invoiceTotals.totalNeto, invoiceCurrencySymbol)}</span>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[invoice.status]}`}>
                    {statusLabel}
                  </span>
                </span>
              </button>
            );
          })}
          {latestInvoices.length === 0 ? <p className="px-6 py-8 text-center text-sm font-bold text-muted">{t("noInvoicesFound")}</p> : null}
        </div>
      </section>
    </div>
  );
}
