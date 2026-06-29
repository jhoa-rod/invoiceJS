import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { HandledChat, HandledChatFormValues } from "../types/handledChat";
import { isIntercomUrl, isValidUrl, normalizeUrl, openExternalUrl } from "../utils/links";
import { getHandledChatStatusTranslationKey, normalizeHandledChatStatus, normalizeText } from "../utils/taskHelpers";
import { HandledChatForm } from "./HandledChatForm";

interface HandledChatDetailModalProps {
  chat: HandledChat | null;
  onClose: () => void;
  onSave: (chat: HandledChat) => void;
}

const emptyValues: HandledChatFormValues = {
  clientName: "",
  contactName: "",
  chatLink: "",
  intercomLink: "",
  platform: "",
  handledAt: "",
  taskType: "",
  notes: "",
  handledBy: "",
  status: "closed",
};

export function HandledChatDetailModal({ chat, onClose, onSave }: HandledChatDetailModalProps) {
  const { language, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<HandledChatFormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof HandledChatFormValues, string>>>({});

  useEffect(() => {
    if (!chat) {
      setIsEditing(false);
      setValues(emptyValues);
      setErrors({});
      return;
    }

    setIsEditing(false);
    setValues({
      clientName: chat.clientName ?? chat.contactName,
      contactName: chat.clientName ?? chat.contactName,
      chatLink: chat.intercomLink ?? chat.chatLink ?? "",
      intercomLink: chat.intercomLink ?? chat.chatLink ?? "",
      platform: chat.platform ?? "",
      handledAt: chat.handledAt.slice(0, 16),
      taskType: chat.taskType ?? "",
      notes: chat.notes ?? "",
      handledBy: chat.handledBy ?? "",
      status: normalizeHandledChatStatus(chat.status ?? "closed"),
    });
    setErrors({});
  }, [chat]);

  if (!chat) return null;

  const locale = language === "es" ? "es-ES" : "en-US";
  const link = chat.intercomLink ?? chat.chatLink ?? "";
  const statusKey = chat.status ? getHandledChatStatusTranslationKey(chat.status) : null;

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

    onSave({
      ...chat,
      clientName: normalizeText(values.clientName),
      contactName: normalizeText(values.clientName),
      chatLink: normalizeUrl(values.intercomLink) || undefined,
      intercomLink: normalizeUrl(values.intercomLink) || undefined,
      handledAt: values.handledAt,
      notes: normalizeText(values.notes) || undefined,
      status: normalizeHandledChatStatus(values.status || "closed"),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    setValues({
      clientName: chat.clientName ?? chat.contactName,
      contactName: chat.clientName ?? chat.contactName,
      chatLink: chat.intercomLink ?? chat.chatLink ?? "",
      intercomLink: chat.intercomLink ?? chat.chatLink ?? "",
      platform: chat.platform ?? "",
      handledAt: chat.handledAt.slice(0, 16),
      taskType: chat.taskType ?? "",
      notes: chat.notes ?? "",
      handledBy: chat.handledBy ?? "",
      status: normalizeHandledChatStatus(chat.status ?? "closed"),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              {t("details")}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-ink">{chat.clientName ?? chat.contactName}</h2>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white"
              >
                {t("edit")}
              </button>
            ) : null}
            <button type="button" onClick={onClose} className="rounded-2xl border border-line px-4 py-2 text-sm font-semibold text-ink">
              {t("close")}
            </button>
          </div>
        </div>

        {isEditing ? (
          <HandledChatForm
            values={values}
            errors={errors}
            onChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            isEditing
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("clientName")}</p>
              <p className="mt-2 font-semibold text-ink">{chat.clientName ?? chat.contactName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("status")}</p>
              <p className="mt-2 font-semibold text-ink">{statusKey ? t(statusKey) : chat.status ?? "—"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("intercomLink")}</p>
              {link ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!isValidUrl(link)) {
                      window.alert(t("invalidLink"));
                      return;
                    }
                    openExternalUrl(link);
                  }}
                  className="mt-2 rounded-2xl border border-line px-4 py-2 text-sm font-semibold text-ink"
                >
                  {isIntercomUrl(link) ? t("openIntercom") : t("openChat")}
                </button>
              ) : (
                <p className="mt-2 text-sm text-muted">—</p>
              )}
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("handledAt")}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{new Date(chat.handledAt).toLocaleString(locale)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("notes")}</p>
              <p className="mt-2 text-sm text-ink">{chat.notes ?? "—"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
