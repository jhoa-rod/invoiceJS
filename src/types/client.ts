export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  chatLink?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface InvoiceClient {
  id: string;
  userId: string;
  name: string;
  taxId: string;
  address: string;
  cityPostal: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
