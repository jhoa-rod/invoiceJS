import type { HandledChat } from "../types/handledChat";
import { downloadCsv } from "./exportCsv";

export function exportHandledChatsCsv(chats: HandledChat[]) {
  downloadCsv(
    `handled-chats-${new Date().toISOString().slice(0, 10)}.csv`,
    ["id", "clientName", "intercomLink", "handledAt", "status", "notes", "createdAt", "updatedAt", "userId"],
    chats.map((chat) => [
      chat.id,
      chat.clientName ?? chat.contactName,
      chat.intercomLink ?? chat.chatLink ?? "",
      chat.handledAt,
      chat.status ?? "",
      chat.notes ?? "",
      chat.createdAt,
      chat.updatedAt,
      chat.userId ?? "",
    ]),
  );
}
