import type { Invoice } from "../types/invoice";
import { calculateTotals, formatCurrency, formatInvoiceDate } from "./invoiceMath";

export interface InvoiceExportLabels {
  invoiceTitle: string;
  invoiceNumber: string;
  date: string;
  client: string;
  taxId: string;
  serviceDescription: string;
  daysDates: string;
  hours: string;
  amount: string;
  grossTotal: string;
  irpfPercent: string;
  irpfAmount: string;
  netTotal: string;
  status: string;
  bankAccount: string;
  period: string;
}

const defaultLabels: InvoiceExportLabels = {
  invoiceTitle: "FACTURA",
  invoiceNumber: "Número de factura",
  date: "Fecha",
  client: "Cliente",
  taxId: "CIF/NIF",
  serviceDescription: "Descripción del servicio",
  daysDates: "Días o fechas",
  hours: "Horas",
  amount: "Importe",
  grossTotal: "Total bruto",
  irpfPercent: "Porcentaje IRPF",
  irpfAmount: "Importe IRPF",
  netTotal: "Total neto",
  status: "Estado",
  bankAccount: "Cuenta bancaria",
  period: "Período",
};

const csvEscape = (value: string | number) => {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
};

const downloadBlob = (content: string | BlobPart, filename: string, type: string) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const invoiceRows = (invoice: Invoice) => {
  const totals = calculateTotals(invoice);
  return invoice.lines.map((line) => [
    invoice.invoiceNumber,
    formatInvoiceDate(invoice.date),
    invoice.client.name,
    invoice.client.taxId,
    line.description,
    line.dates,
    line.hours ?? "",
    line.amount.toFixed(2),
    totals.totalBruto.toFixed(2),
    invoice.irpfRate.toFixed(2),
    totals.irpf.toFixed(2),
    totals.totalNeto.toFixed(2),
    invoice.status,
  ]);
};

export const exportInvoiceCsv = (invoice: Invoice, labels: InvoiceExportLabels = defaultLabels) => {
  const header = [
    labels.invoiceNumber,
    labels.date,
    labels.client,
    labels.taxId,
    labels.serviceDescription,
    labels.daysDates,
    labels.hours,
    labels.amount,
    labels.grossTotal,
    labels.irpfPercent,
    labels.irpfAmount,
    labels.netTotal,
    labels.status,
  ];
  const csv = [header, ...invoiceRows(invoice)].map((row) => row.map(csvEscape).join(",")).join("\n");
  downloadBlob(csv, `factura-${invoice.invoiceNumber.replace(/[^\w-]+/g, "-") || invoice.id}.csv`, "text/csv;charset=utf-8");
};

export const exportArchiveCsv = (invoices: Invoice[], labels: InvoiceExportLabels = defaultLabels) => {
  const header = [
    labels.invoiceNumber,
    labels.date,
    labels.client,
    labels.taxId,
    labels.serviceDescription,
    labels.daysDates,
    labels.hours,
    labels.amount,
    labels.grossTotal,
    labels.irpfPercent,
    labels.irpfAmount,
    labels.netTotal,
    labels.status,
  ];
  const rows = invoices.flatMap(invoiceRows);
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  downloadBlob(csv, "archivo-facturas.csv", "text/csv;charset=utf-8");
};

const escapeHtml = (value: string | number) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const invoiceHtml = (invoice: Invoice, labels: InvoiceExportLabels) => {
  const totals = calculateTotals(invoice);
  const rows = invoice.lines
    .map(
      (line) => `
        <tr>
          <td>${escapeHtml(line.description)}</td>
          <td>${escapeHtml(line.dates)}</td>
          <td>${escapeHtml(line.hours ?? "")}</td>
          <td class="number">${escapeHtml(formatCurrency(line.amount))}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(labels.invoiceTitle)} ${escapeHtml(invoice.invoiceNumber)}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          body { margin: 0; color: #172033; font-family: Arial, Helvetica, sans-serif; background: #fff; }
          .sheet { width: 100%; }
          .top { display: flex; justify-content: space-between; gap: 32px; border-bottom: 2px solid #172033; padding-bottom: 18px; }
          h1 { margin: 0; font-size: 34px; letter-spacing: 0; }
          .meta { text-align: right; font-size: 13px; line-height: 1.6; }
          .party { margin-top: 22px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; font-size: 13px; line-height: 1.55; }
          .label { color: #667085; font-size: 11px; font-weight: 700; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 28px; font-size: 12px; }
          th { background: #edf3fa; color: #172033; text-align: left; }
          th, td { border: 1px solid #b9c7d8; padding: 9px; vertical-align: top; }
          .number { text-align: right; white-space: nowrap; }
          .totals { margin-top: 20px; margin-left: auto; width: 280px; border: 1px solid #b9c7d8; }
          .totals div { display: flex; justify-content: space-between; padding: 9px 12px; border-bottom: 1px solid #d9e2f0; font-size: 13px; }
          .totals div:last-child { border-bottom: 0; background: #172033; color: white; font-weight: 700; }
        </style>
      </head>
      <body>
        <main class="sheet">
          <section class="top">
            <div>
              <h1>${escapeHtml(labels.invoiceTitle)}</h1>
              <p><strong>${escapeHtml(invoice.issuer.name)}</strong><br />
              ${escapeHtml(invoice.issuer.taxId)}<br />
              ${escapeHtml(invoice.issuer.address)}<br />
              ${escapeHtml(invoice.issuer.cityPostal)}<br />
              ${escapeHtml(invoice.issuer.email ?? "")}</p>
            </div>
            <div class="meta">
              <strong>${escapeHtml(labels.invoiceNumber)}:</strong> ${escapeHtml(invoice.invoiceNumber)}<br />
              <strong>${escapeHtml(labels.date)}:</strong> ${escapeHtml(formatInvoiceDate(invoice.date))}<br />
              <strong>${escapeHtml(labels.status)}:</strong> ${escapeHtml(invoice.status)}
            </div>
          </section>
          <section class="party">
            <div>
              <p class="label">${escapeHtml(labels.client)}</p>
              <p><strong>${escapeHtml(invoice.client.name)}</strong><br />
              ${escapeHtml(invoice.client.taxId)}<br />
              ${escapeHtml(invoice.client.address)}<br />
              ${escapeHtml(invoice.client.cityPostal)}</p>
            </div>
            <div>
              <p class="label">${escapeHtml(labels.bankAccount)}</p>
              <p>${escapeHtml(invoice.issuer.iban ?? "")}</p>
              <p class="label">${escapeHtml(labels.period)}</p>
              <p>${escapeHtml(invoice.period)}</p>
            </div>
          </section>
          <table>
            <thead>
              <tr>
                <th>${escapeHtml(labels.serviceDescription)}</th>
                <th>${escapeHtml(labels.daysDates)}</th>
                <th>${escapeHtml(labels.hours)}</th>
                <th class="number">${escapeHtml(labels.amount)}</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <section class="totals">
            <div><span>${escapeHtml(labels.grossTotal)}</span><strong>${escapeHtml(formatCurrency(totals.totalBruto))}</strong></div>
            <div><span>IRPF ${escapeHtml(invoice.irpfRate)}%</span><strong>${escapeHtml(formatCurrency(totals.irpf))}</strong></div>
            <div><span>${escapeHtml(labels.netTotal)}</span><strong>${escapeHtml(formatCurrency(totals.totalNeto))}</strong></div>
          </section>
        </main>
        <script>
          window.addEventListener("load", () => {
            window.focus();
            window.print();
          });
        </script>
      </body>
    </html>
  `;
};

export const downloadInvoicePdf = (invoice: Invoice, labels: InvoiceExportLabels = defaultLabels) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(invoiceHtml(invoice, labels));
  printWindow.document.close();
};
