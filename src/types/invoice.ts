export type InvoiceStatus = "borrador" | "enviada" | "pagada";

export interface InvoiceParty {
  name: string;
  taxId: string;
  address: string;
  cityPostal: string;
  email?: string;
  iban?: string;
}

export interface ServiceLine {
  id: string;
  description: string;
  dates: string;
  hours?: string;
  amount: number;
}

export interface Invoice {
  id: string;
  shareId: string;
  invoiceNumber: string;
  date: string;
  period: string;
  irpfRate: number;
  status: InvoiceStatus;
  issuer: InvoiceParty;
  client: InvoiceParty;
  lines: ServiceLine[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceTotals {
  totalBruto: number;
  irpf: number;
  totalNeto: number;
}
