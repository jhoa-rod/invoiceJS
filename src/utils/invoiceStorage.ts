import { sampleInvoices } from "../data/sampleInvoices";
import { supabase } from "../lib/supabase";
import type { Invoice, InvoiceParty, InvoiceStatus, ServiceLine } from "../types/invoice";

interface InvoiceRow {
  id: string;
  user_id: string;
  share_id: string;
  invoice_number: string;
  invoice_date: string;
  period: string | null;
  irpf_rate: number | string;
  status: InvoiceStatus;
  issuer: InvoiceParty;
  client: InvoiceParty;
  lines: ServiceLine[];
  created_at: string;
  updated_at: string;
}

const SAMPLE_SEED_KEY = "invoice-manager.sample-seeded.v1";

export const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const createEmptyLine = (): ServiceLine => ({
  id: generateId(),
  description: "",
  dates: "",
  hours: "",
  amount: Number.NaN,
});

const emptyParty: InvoiceParty = {
  name: "",
  taxId: "",
  address: "",
  cityPostal: "",
  email: "",
  iban: "",
};

export const createEmptyInvoice = (issuer?: InvoiceParty): Invoice => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    shareId: generateId(),
    invoiceNumber: "",
    date: now.slice(0, 10),
    period: "",
    irpfRate: 15,
    status: "borrador",
    issuer: issuer ? { ...issuer } : { ...emptyParty },
    client: { ...emptyParty },
    lines: [createEmptyLine()],
    createdAt: now,
    updatedAt: now,
  };
};

export const cloneInvoice = (invoice: Invoice): Invoice => JSON.parse(JSON.stringify(invoice)) as Invoice;

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }
  return supabase;
};

const normalizeInvoice = (invoice: Invoice): Invoice => ({
  ...invoice,
  shareId: invoice.shareId || generateId(),
  period: invoice.period ?? "",
  irpfRate: Number.isFinite(Number(invoice.irpfRate)) ? Number(invoice.irpfRate) : 15,
  status: invoice.status || "borrador",
  issuer: { ...emptyParty, ...invoice.issuer },
  client: { ...emptyParty, ...invoice.client },
  lines: invoice.lines?.length
    ? invoice.lines.map((line) => ({
        ...line,
        id: line.id || generateId(),
        amount: Number(line.amount),
      }))
    : [createEmptyLine()],
});

const rowToInvoice = (row: InvoiceRow): Invoice =>
  normalizeInvoice({
    id: row.id,
    shareId: row.share_id,
    invoiceNumber: row.invoice_number,
    date: row.invoice_date,
    period: row.period ?? "",
    irpfRate: Number(row.irpf_rate),
    status: row.status,
    issuer: row.issuer,
    client: row.client,
    lines: row.lines,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

const invoiceToRow = (invoice: Invoice, userId: string): Omit<InvoiceRow, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
} => ({
  id: invoice.id,
  user_id: userId,
  share_id: invoice.shareId || generateId(),
  invoice_number: invoice.invoiceNumber,
  invoice_date: invoice.date,
  period: invoice.period,
  irpf_rate: invoice.irpfRate,
  status: invoice.status,
  issuer: invoice.issuer,
  client: invoice.client,
  lines: invoice.lines,
  created_at: invoice.createdAt,
  updated_at: invoice.updatedAt,
});

const seededUsers = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAMPLE_SEED_KEY) ?? "[]") as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const hasSeededSample = (userId: string) => seededUsers().includes(userId);

const markSampleSeeded = (userId: string) => {
  const users = new Set(seededUsers());
  users.add(userId);
  localStorage.setItem(SAMPLE_SEED_KEY, JSON.stringify([...users]));
};

export const loadInvoices = async (userId: string): Promise<Invoice[]> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("invoices")
    .select("*")
    .eq("user_id", userId)
    .order("invoice_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as InvoiceRow[]).map(rowToInvoice);
};

export const saveInvoice = async (invoice: Invoice, userId: string): Promise<Invoice> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("invoices")
    .upsert(invoiceToRow(normalizeInvoice(invoice), userId), { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;

  return rowToInvoice(data as InvoiceRow);
};

export const deleteInvoice = async (invoiceId: string): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client.from("invoices").delete().eq("id", invoiceId);

  if (error) throw error;
};

export const seedSampleInvoices = async (userId: string): Promise<Invoice[]> => {
  if (hasSeededSample(userId)) return [];

  const now = new Date().toISOString();
  const invoices = sampleInvoices.map((invoice) =>
    normalizeInvoice({
      ...cloneInvoice(invoice),
      id: generateId(),
      shareId: generateId(),
      createdAt: now,
      updatedAt: now,
    }),
  );

  const client = requireSupabase();
  const { data, error } = await client
    .from("invoices")
    .insert(invoices.map((invoice) => invoiceToRow(invoice, userId)))
    .select("*")
    .order("invoice_date", { ascending: false });

  if (error) throw error;

  markSampleSeeded(userId);
  return ((data ?? []) as InvoiceRow[]).map(rowToInvoice);
};
