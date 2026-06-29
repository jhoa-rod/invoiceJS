import { useLanguage } from "../hooks/useLanguage";
import type { HandledChat } from "../types/handledChat";
import { isIntercomUrl, isValidUrl, normalizeUrl, openExternalUrl } from "../utils/links";
import { getHandledChatStatusTranslationKey } from "../utils/taskHelpers";
import { HandledChatCard } from "./HandledChatCard";

interface HandledChatTableProps {
  chats: HandledChat[];
  onSelect: (chat: HandledChat) => void;
}

export function HandledChatTable({ chats, onSelect }: HandledChatTableProps) {
  const { language, t } = useLanguage();

  if (!chats.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-line bg-white/60 px-5 py-10 text-center text-sm text-muted">
        {t("noHandledChats")}
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-[24px] border border-slate-200 bg-white lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">{t("clientName")}</th>
              <th className="px-4 py-3">{t("intercomLink")}</th>
              <th className="px-4 py-3">{t("handledAt")}</th>
              <th className="px-4 py-3">{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((chat) => (
              <tr key={chat.id} onClick={() => onSelect(chat)} className="cursor-pointer border-t border-slate-100 align-top transition hover:bg-slate-50">
                <td className="px-4 py-4 font-semibold text-ink">{chat.clientName ?? chat.contactName}</td>
                <td className="px-4 py-4 text-slate-600">
                  {chat.intercomLink ?? chat.chatLink ? (
                    <a
                      href={isValidUrl(chat.intercomLink ?? chat.chatLink ?? "") ? normalizeUrl(chat.intercomLink ?? chat.chatLink ?? "") : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => {
                        event.stopPropagation();
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
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {new Date(chat.handledAt).toLocaleDateString(language === "es" ? "es-ES" : "en-US")}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {chat.status ? (getHandledChatStatusTranslationKey(chat.status) ? t(getHandledChatStatusTranslationKey(chat.status)!) : chat.status) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {chats.map((chat) => (
          <HandledChatCard key={chat.id} chat={chat} onEdit={() => onSelect(chat)} onDelete={() => onSelect(chat)} />
        ))}
      </div>
    </>
  );
}
