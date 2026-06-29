import { useLanguage } from "../hooks/useLanguage";
import type { HandledChat } from "../types/handledChat";
import { isIntercomUrl, isValidUrl, normalizeUrl, openExternalUrl } from "../utils/links";
import { getHandledChatStatusTranslationKey } from "../utils/taskHelpers";

interface HandledChatCardProps {
  chat: HandledChat;
  onEdit: (chat: HandledChat) => void;
  onDelete: (chat: HandledChat) => void;
}

export function HandledChatCard({ chat, onEdit, onDelete }: HandledChatCardProps) {
  const { language, t } = useLanguage();
  const statusKey = chat.status ? getHandledChatStatusTranslationKey(chat.status) : null;

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink">{chat.clientName ?? chat.contactName}</h3>
          <p className="mt-1 text-sm text-muted">{statusKey ? t(statusKey) : chat.status || t("noStatus")}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {new Date(chat.handledAt).toLocaleDateString(language === "es" ? "es-ES" : "en-US")}
        </span>
      </div>

      {chat.notes ? <p className="mt-3 text-sm text-slate-600">{chat.notes}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {chat.intercomLink ?? chat.chatLink ? (
          <a
            href={isValidUrl(chat.intercomLink ?? chat.chatLink ?? "") ? normalizeUrl(chat.intercomLink ?? chat.chatLink ?? "") : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              event.preventDefault();
              const target = chat.intercomLink ?? chat.chatLink ?? "";
              if (!isValidUrl(target)) {
                window.alert(t("invalidLink"));
                return;
              }
              openExternalUrl(target);
            }}
            className="rounded-2xl border border-line px-3 py-2 text-sm font-semibold text-ink"
          >
            {isIntercomUrl(chat.intercomLink ?? chat.chatLink ?? "") ? t("openIntercom") : t("openChat")}
          </a>
        ) : null}
        <button type="button" onClick={() => onEdit(chat)} className="rounded-2xl border border-line px-3 py-2 text-sm font-semibold text-ink">
          {t("edit")}
        </button>
        <button
          type="button"
          onClick={() => onDelete(chat)}
          className="rounded-2xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600"
        >
          {t("delete")}
        </button>
      </div>
    </article>
  );
}
