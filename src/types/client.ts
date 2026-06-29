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
