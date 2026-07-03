import { useEffect, useState, type FormEvent } from "react";
import type { InvoiceClient } from "../../types/client";
import { formatMessage, useInvoiceI18n } from "../../i18n/invoiceI18n";
import { generateId } from "../../utils/invoiceStorage";
import { ConfirmModal } from "../ui/ConfirmModal";

interface ClientsViewProps {
  clients: InvoiceClient[];
  userId: string;
  onSave: (client: InvoiceClient) => void | Promise<void>;
  onDelete: (client: InvoiceClient) => void | Promise<void>;
}

const inputClass =
  "min-h-11 w-full rounded-[12px] border border-line bg-card px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand-soft";

const labelClass = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted";

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
  const [clientPendingDelete, setClientPendingDelete] = useState<InvoiceClient | null>(null);

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

  const confirmDelete = async () => {
    if (!clientPendingDelete) return;
    await onDelete(clientPendingDelete);
    if (draft.id === clientPendingDelete.id) startNew();
    setClientPendingDelete(null);
  };

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-ink">{t("savedClients")}</h2>
          <p className="mt-2 text-lg text-muted">{t("clientsDescription")}</p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="min-h-12 rounded-[12px] bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
        >
          {t("newClient")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-card p-5 shadow-sm">
        <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{isEditing ? t("editClient") : t("newClient")}</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="grid gap-2">
            <span className={labelClass}>{t("clientName")}</span>
            <input className={inputClass} value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("taxId")}</span>
            <input className={inputClass} value={draft.taxId} onChange={(event) => updateDraft("taxId", event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("address")}</span>
            <input className={inputClass} value={draft.address} onChange={(event) => updateDraft("address", event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("cityPostal")}</span>
            <input className={inputClass} value={draft.cityPostal} onChange={(event) => updateDraft("cityPostal", event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("email")}</span>
            <input className={inputClass} type="email" value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={startNew}
            className="min-h-11 rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="min-h-11 rounded-[12px] bg-brand px-6 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
          >
            {t("saveClient")}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface text-left text-muted">
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("clientName")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("taxId")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("address")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("cityPostal")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("email")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="align-top transition hover:bg-surface">
                  <td className="border-b border-line px-4 py-5 font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{client.name}</td>
                  <td className="border-b border-line px-4 py-5 text-muted">{client.taxId}</td>
                  <td className="border-b border-line px-4 py-5 text-muted">{client.address}</td>
                  <td className="border-b border-line px-4 py-5 text-muted">{client.cityPostal}</td>
                  <td className="border-b border-line px-4 py-5 text-muted">{client.email}</td>
                  <td className="border-b border-line px-4 py-5">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(client)}
                        className="min-h-10 rounded-[11px] border border-line bg-card px-4 py-2 text-xs font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
                      >
                        {t("edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setClientPendingDelete(client)}
                        className="min-h-10 rounded-[11px] border border-danger/25 bg-card px-4 py-2 text-xs font-extrabold text-danger shadow-sm transition hover:-translate-y-px hover:border-danger hover:shadow-md"
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
        {clients.length === 0 ? <div className="p-10 text-center text-sm font-bold text-muted">{t("noClientsSaved")}</div> : null}
      </div>

      {clientPendingDelete ? (
        <ConfirmModal
          title={t("deleteClientTitle")}
          message={formatMessage(t("deleteClientMessage"), { name: clientPendingDelete.name })}
          confirmLabel={t("confirmDelete")}
          cancelLabel={t("cancel")}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setClientPendingDelete(null)}
        />
      ) : null}
    </section>
  );
}
