import { useEffect, useState, type FormEvent } from "react";
import type { InvoiceClient } from "../../types/client";
import { formatMessage, useInvoiceI18n } from "../../i18n/invoiceI18n";
import { generateId } from "../../utils/invoiceStorage";

interface ClientsViewProps {
  clients: InvoiceClient[];
  userId: string;
  onSave: (client: InvoiceClient) => void | Promise<void>;
  onDelete: (client: InvoiceClient) => void | Promise<void>;
}

const inputClass =
  "min-h-10 w-full rounded-md border border-app-border bg-white px-3 py-2 text-sm text-app-text outline-none transition placeholder:text-app-muted/60 focus:border-app-accent focus:ring-2 focus:ring-app-soft";

const emptyClient = (userId: string): InvoiceClient => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    userId,
    name: "",
    taxId: "",
    address: "",
    cityPostal: "",
    email: "",
    createdAt: now,
    updatedAt: now,
  };
};

export function ClientsView({ clients, userId, onSave, onDelete }: ClientsViewProps) {
  const { t } = useInvoiceI18n();
  const [draft, setDraft] = useState<InvoiceClient>(() => emptyClient(userId));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setDraft(emptyClient(userId));
    setIsEditing(false);
  }, [userId]);

  const updateDraft = (field: keyof InvoiceClient, value: string) => {
    setDraft((current) => ({ ...current, [field]: value, updatedAt: new Date().toISOString() }));
  };

  const startNew = () => {
    setDraft(emptyClient(userId));
    setIsEditing(false);
  };

  const startEdit = (client: InvoiceClient) => {
    setDraft({ ...client });
    setIsEditing(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim()) return;
    await onSave({ ...draft, name: draft.name.trim() });
    startNew();
  };

  const handleDelete = async (client: InvoiceClient) => {
    if (!window.confirm(formatMessage(t("deleteClientConfirm"), { name: client.name }))) return;
    await onDelete(client);
    if (draft.id === client.id) startNew();
  };

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 className="text-2xl font-black text-app-text">{t("savedClients")}</h2>
          <p className="mt-1 text-sm text-app-muted">{t("clientsDescription")}</p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="min-h-10 rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white hover:bg-app-accentStrong"
        >
          {t("newClient")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-app-border-subtle bg-white p-4 shadow-sm">
        <h3 className="text-base font-bold text-app-text">{isEditing ? t("editClient") : t("newClient")}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-app-muted">{t("clientName")}</span>
            <input className={inputClass} value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-app-muted">{t("taxId")}</span>
            <input className={inputClass} value={draft.taxId} onChange={(event) => updateDraft("taxId", event.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-app-muted">{t("address")}</span>
            <input className={inputClass} value={draft.address} onChange={(event) => updateDraft("address", event.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-app-muted">{t("cityPostal")}</span>
            <input className={inputClass} value={draft.cityPostal} onChange={(event) => updateDraft("cityPostal", event.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase text-app-muted">{t("email")}</span>
            <input className={inputClass} type="email" value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={startNew}
            className="min-h-10 rounded-md border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text hover:border-app-accent hover:bg-app-bg"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="min-h-10 rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white hover:bg-app-accentStrong"
          >
            {t("saveClient")}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-app-border-subtle bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-app-soft text-left text-app-text">
                <th className="border-b border-app-border px-4 py-3">{t("clientName")}</th>
                <th className="border-b border-app-border px-4 py-3">{t("taxId")}</th>
                <th className="border-b border-app-border px-4 py-3">{t("address")}</th>
                <th className="border-b border-app-border px-4 py-3">{t("cityPostal")}</th>
                <th className="border-b border-app-border px-4 py-3">{t("email")}</th>
                <th className="border-b border-app-border px-4 py-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="align-top hover:bg-app-bg">
                  <td className="border-b border-app-border-subtle px-4 py-3 font-bold text-app-text">{client.name}</td>
                  <td className="border-b border-app-border-subtle px-4 py-3 text-app-muted">{client.taxId}</td>
                  <td className="border-b border-app-border-subtle px-4 py-3 text-app-muted">{client.address}</td>
                  <td className="border-b border-app-border-subtle px-4 py-3 text-app-muted">{client.cityPostal}</td>
                  <td className="border-b border-app-border-subtle px-4 py-3 text-app-muted">{client.email}</td>
                  <td className="border-b border-app-border-subtle px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(client)}
                        className="min-h-9 rounded-md border border-app-border bg-white px-3 py-1.5 text-xs font-bold text-app-text transition hover:border-app-accent hover:bg-app-bg"
                      >
                        {t("edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(client)}
                        className="min-h-9 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-700 transition hover:border-red-400"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {clients.length === 0 ? <div className="p-8 text-center text-sm font-semibold text-app-muted">{t("noClientsSaved")}</div> : null}
      </div>
    </section>
  );
}
