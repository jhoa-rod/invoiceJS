import type { Invoice } from "../types/invoice";
import { calculateTotals, formatInvoiceDate } from "./invoiceMath";
import { getInvoiceDateFormat } from "./invoiceRegion";

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
  irpfPercent: "Tax rate",
  irpfAmount: "Tax amount",
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
    formatInvoiceDate(invoice.date, getInvoiceDateFormat(invoice)),
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

export const downloadInvoicePdf = () => {
  window.print();
};
