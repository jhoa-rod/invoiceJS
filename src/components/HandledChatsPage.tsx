import { useMemo, useState, type FormEvent } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { HandledChat, HandledChatFormValues } from "../types/handledChat";
import { exportHandledChatsCsv } from "../utils/exportHandledChatsCsv";
import { isValidUrl, normalizeUrl } from "../utils/links";
import {
  getHandledChatStatusTranslationKey,
  normalizeHandledChatStatus,
  normalizeText,
} from "../utils/taskHelpers";
import { HandledChatDetailModal } from "./HandledChatDetailModal";
import { HandledChatForm } from "./HandledChatForm";
import { HandledChatTable } from "./HandledChatTable";

interface HandledChatsPageProps {
  chats: HandledChat[];
  userId?: string;
  onCreate: (chat: HandledChat) => void;
  onUpdate: (chat: HandledChat) => void;
  onDelete: (chat: HandledChat) => void;
}

const initialValues: HandledChatFormValues = {
  clientName: "",
  contactName: "",
  chatLink: "",
  intercomLink: "",
  platform: "",
  handledAt: new Date().toISOString().slice(0, 16),
  taskType: "",
  notes: "",
  handledBy: "",
  status: "closed",
};

export function HandledChatsPage({ chats, userId, onCreate, onUpdate, onDelete }: HandledChatsPageProps) {
  const { t } = useLanguage();
  const [values, setValues] = useState<HandledChatFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof HandledChatFormValues, string>>>({});
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<HandledChat | null>(null);
  const [clientFilter, setClientFilter] = useState("");
  const [intercomLinkFilter, setIntercomLinkFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const matchesClient = clientFilter
        ? (chat.clientName ?? chat.contactName).toLowerCase().includes(clientFilter.toLowerCase())
        : true;
      const matchesIntercomLink = intercomLinkFilter
        ? (chat.intercomLink ?? chat.chatLink ?? "").toLowerCase().includes(intercomLinkFilter.toLowerCase())
        : true;
      const matchesStatus = statusFilter ? normalizeHandledChatStatus(chat.status ?? "") === normalizeHandledChatStatus(statusFilter) : true;
      const matchesDate = dateFilter ? chat.handledAt.slice(0, 10) === dateFilter : true;
      return matchesClient && matchesIntercomLink && matchesStatus && matchesDate;
    });
  }, [chats, clientFilter, dateFilter, intercomLinkFilter, statusFilter]);

  const statuses = useMemo(() => ["open", "closed"], []);

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setEditingChatId(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof HandledChatFormValues, string>> = {};
    if (!normalizeText(values.clientName)) nextErrors.clientName = t("clientRequired");
    if (!values.intercomLink.trim()) {
      nextErrors.intercomLink = t("intercomLinkRequired");
    } else if (!isValidUrl(values.intercomLink)) {
      nextErrors.intercomLink = t("invalidLink");
    }
    if (!values.handledAt) nextErrors.handledAt = t("handledAtRequired");
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload: HandledChat = {
      id: editingChatId ?? crypto.randomUUID(),
      userId,
      clientName: normalizeText(values.clientName),
      contactName: normalizeText(values.clientName),
      chatLink: normalizeUrl(values.intercomLink) || undefined,
      intercomLink: normalizeUrl(values.intercomLink) || undefined,
      platform: undefined,
      handledAt: values.handledAt,
      notes: normalizeText(values.notes) || undefined,
      handledBy: undefined,
      status: normalizeHandledChatStatus(values.status || "closed"),
      createdAt: editingChatId ? chats.find((chat) => chat.id === editingChatId)?.createdAt ?? new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingChatId) {
      onUpdate(payload);
    } else {
      onCreate(payload);
    }

    setSelectedChat(null);
    resetForm();
  };

  const handleEdit = (chat: HandledChat) => {
    setEditingChatId(chat.id);
    setValues({
      clientName: chat.clientName ?? chat.contactName,
      contactName: chat.clientName ?? chat.contactName,
      chatLink: chat.intercomLink ?? chat.chatLink ?? "",
      intercomLink: chat.intercomLink ?? chat.chatLink ?? "",
      platform: "",
      handledAt: chat.handledAt.slice(0, 16),
      taskType: "",
      notes: chat.notes ?? "",
      handledBy: "",
      status: normalizeHandledChatStatus(chat.status ?? "closed"),
    });
    setErrors({});
  };

  return (
    <section className="grid gap-6">
      <div className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-soft">
        <div className="mb-5 flex flex-col gap-2">
          <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            {t("handledChats")}
          </span>
          <h2 className="text-2xl font-extrabold text-ink">
            {editingChatId ? t("editHandledChat") : t("addHandledChat")}
          </h2>
        </div>
        <HandledChatForm
          values={values}
          errors={errors}
          onChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={Boolean(editingChatId)}
        />
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-ink">{t("handledChats")}</h3>
          </div>
          <button type="button" onClick={() => exportHandledChatsCsv(filteredChats)} className="rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
            {t("exportCsv")}
          </button>
        </div>

        <div className="mb-5 grid gap-4 lg:grid-cols-4">
          <input value={clientFilter} onChange={(event) => setClientFilter(event.target.value)} placeholder={t("clientName")} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10" />
          <input value={intercomLinkFilter} onChange={(event) => setIntercomLinkFilter(event.target.value)} placeholder={t("intercomLink")} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10" />
          <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10">
            <option value="">{t("all")}</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {(() => {
                  const key = getHandledChatStatusTranslationKey(status);
                  return key ? t(key) : status;
                })()}
              </option>
            ))}
          </select>
        </div>

        <HandledChatTable chats={filteredChats} onSelect={setSelectedChat} />
      </section>

      <HandledChatDetailModal
        chat={selectedChat}
        onClose={() => setSelectedChat(null)}
        onSave={(updatedChat) => {
          onUpdate(updatedChat);
          setSelectedChat(null);
        }}
      />
    </section>
  );
}
