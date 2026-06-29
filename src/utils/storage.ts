import type { Client } from "../types/client";
import type { HandledChat } from "../types/handledChat";
import type { InternalTask } from "../types/internalTask";
import type { Task } from "../types/task";
import { downloadCsv } from "./exportCsv";
import { getCompletionTimingLabel } from "./taskHelpers";

const TASKS_STORAGE_KEY = "client-task-manager-tasks";
const CLIENTS_STORAGE_KEY = "client-task-manager-clients";
const HANDLED_CHATS_STORAGE_KEY = "client-task-manager-handled_chats";
const INTERNAL_TASKS_STORAGE_KEY = "client-task-manager-internal_tasks";

function getScopedStorageKey(baseKey: string, userId?: string) {
  return userId ? `${baseKey}:${userId}` : baseKey;
}

function loadCollection<T>(storageKey: string): T[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCollection<T>(storageKey: string, items: T[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(items));
}

export function loadTasks(userId?: string): Task[] {
  return loadCollection<Task>(getScopedStorageKey(TASKS_STORAGE_KEY, userId));
}

export function saveTasks(tasks: Task[], userId?: string) {
  saveCollection(getScopedStorageKey(TASKS_STORAGE_KEY, userId), tasks);
}

export function loadClients(userId?: string): Client[] {
  return loadCollection<Client>(getScopedStorageKey(CLIENTS_STORAGE_KEY, userId));
}

export function saveClients(clients: Client[], userId?: string) {
  saveCollection(getScopedStorageKey(CLIENTS_STORAGE_KEY, userId), clients);
}

export function loadHandledChats(userId?: string): HandledChat[] {
  return loadCollection<HandledChat>(getScopedStorageKey(HANDLED_CHATS_STORAGE_KEY, userId));
}

export function saveHandledChats(chats: HandledChat[], userId?: string) {
  saveCollection(getScopedStorageKey(HANDLED_CHATS_STORAGE_KEY, userId), chats);
}

export function loadInternalTasks(userId?: string): InternalTask[] {
  return loadCollection<InternalTask>(getScopedStorageKey(INTERNAL_TASKS_STORAGE_KEY, userId));
}

export function saveInternalTasks(tasks: InternalTask[], userId?: string) {
  saveCollection(getScopedStorageKey(INTERNAL_TASKS_STORAGE_KEY, userId), tasks);
}

export function exportTasksToCsv(tasks: Task[]) {
  const headers = [
    "clientName",
    "intercomLink",
    "specifications",
    "taskType",
    "status",
    "createdAt",
    "estimatedCompletionDate",
    "completedAt",
    "lateOrOnTime",
  ];

  downloadCsv(
    `client-task-manager-${new Date().toISOString().slice(0, 10)}.csv`,
    headers,
    tasks.map((task) => [
      task.clientName,
      task.intercomLink ?? task.chatLink ?? "",
      task.taskDetails ?? task.details ?? "",
      task.taskType ?? "",
      task.status,
      task.createdAt,
      task.estimatedCompletionDate ?? "",
      task.completedAt ?? "",
      (() => {
        const timing = getCompletionTimingLabel(task.estimatedCompletionDate, task.completedAt);
        if (timing === "late") return "Late";
        if (timing === "onTime") return "On time";
        return "";
      })(),
    ]),
  );
}
