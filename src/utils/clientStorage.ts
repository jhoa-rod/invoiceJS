import { supabase } from "../lib/supabase";
import type { InvoiceClient } from "../types/client";
import type { InvoiceParty } from "../types/invoice";
import { generateId } from "./invoiceStorage";

interface ClientRow {
  id: string;
  user_id: string;
  name: string;
  tax_id: string | null;
  address: string | null;
  city_postal: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }
  return supabase;
};

const rowToClient = (row: ClientRow): InvoiceClient => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  taxId: row.tax_id ?? "",
  address: row.address ?? "",
  cityPostal: row.city_postal ?? "",
  email: row.email ?? "",
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const clientToRow = (client: InvoiceClient, userId: string): Omit<ClientRow, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
} => ({
  id: client.id,
  user_id: userId,
  name: client.name.trim(),
  tax_id: client.taxId.trim(),
  address: client.address.trim(),
  city_postal: client.cityPostal.trim(),
  email: client.email.trim(),
  created_at: client.createdAt,
  updated_at: client.updatedAt,
});

const normalizeName = (name: string) => name.trim().toLowerCase();

export const invoicePartyToClient = (party: InvoiceParty, userId: string, existingClient?: InvoiceClient): InvoiceClient => {
  const now = new Date().toISOString();
  return {
    id: existingClient?.id ?? generateId(),
    userId,
    name: party.name.trim(),
    taxId: party.taxId.trim(),
    address: party.address.trim(),
    cityPostal: party.cityPostal.trim(),
    email: party.email?.trim() ?? "",
    createdAt: existingClient?.createdAt ?? now,
    updatedAt: now,
  };
};

export const clientToInvoiceParty = (client: InvoiceClient): InvoiceParty => ({
  name: client.name,
  taxId: client.taxId,
  address: client.address,
  cityPostal: client.cityPostal,
  email: client.email,
});

export const loadInvoiceClients = async (userId: string): Promise<InvoiceClient[]> => {
  const client = requireSupabase();
  const { data, error } = await client.from("clients").select("*").eq("user_id", userId).order("name", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as ClientRow[]).map(rowToClient);
};

export const saveInvoiceClient = async (invoiceClient: InvoiceClient, userId: string): Promise<InvoiceClient> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("clients")
    .upsert(clientToRow(invoiceClient, userId), { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;

  return rowToClient(data as ClientRow);
};

export const saveInvoiceClientFromParty = async (
  party: InvoiceParty,
  userId: string,
  existingClients: InvoiceClient[],
): Promise<InvoiceClient> => {
  const existingClient = existingClients.find((client) => normalizeName(client.name) === normalizeName(party.name));
  return saveInvoiceClient(invoicePartyToClient(party, userId, existingClient), userId);
};

export const deleteInvoiceClient = async (clientId: string): Promise<void> => {
  const client = requireSupabase();
  const { error } = await client.from("clients").delete().eq("id", clientId);

  if (error) throw error;
};
