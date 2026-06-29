import type { Invoice, InvoiceTotals } from "../types/invoice";

export const formatCurrency = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  const sign = safeValue < 0 ? "-" : "";
  const [integerPart, decimalPart] = Math.abs(safeValue).toFixed(2).split(".");
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}${groupedInteger},${decimalPart} €`;
};

export const calculateTotals = (invoice: Pick<Invoice, "lines" | "irpfRate">): InvoiceTotals => {
  const totalBruto = invoice.lines.reduce((total, line) => total + (Number.isFinite(line.amount) ? line.amount : 0), 0);
  const irpf = totalBruto * ((Number.isFinite(invoice.irpfRate) ? invoice.irpfRate : 0) / 100);
  return {
    totalBruto,
    irpf,
    totalNeto: totalBruto - irpf,
  };
};

export const formatInvoiceDate = (value: string) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
};

export const parseNumberInput = (value: string) => {
  if (value.trim() === "") return Number.NaN;
  return Number(value.replace(",", "."));
};

export const isValidAmount = (value: number) => Number.isFinite(value) && value >= 0;
