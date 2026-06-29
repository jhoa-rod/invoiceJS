import type { TranslationKey } from "../i18n/translations";
import type { Task, TaskFormValues } from "../types/task";
import { isValidUrl, normalizeUrl } from "./links";

export const EMPTY_STATUS_BY_LANGUAGE = {
  es: "Sin estado",
  en: "No status",
} as const;

export const CLIENT_TASK_STATUS_OPTIONS = ["to do", "doing", "done"] as const;
export const INTERNAL_TASK_STATUS_OPTIONS = ["to do", "doing", "done"] as const;
export const HANDLED_CHAT_STATUS_OPTIONS = ["open", "closed"] as const;

export const DEFAULT_ESTIMATED_TIME_BY_LANGUAGE = {
  es: "No especificado",
  en: "Not specified",
} as const;

export const DEFAULT_INTERNAL_TASK_STATUSES = INTERNAL_TASK_STATUS_OPTIONS;

export const INTERNAL_TASK_PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"] as const;
export const INTERNAL_TASK_CATEGORY_OPTIONS = [
  "Content",
  "Marketing",
  "Operations",
  "Product",
  "Support",
  "Sales",
  "Administration",
  "Other",
] as const;

export const HANDLED_CHAT_PLATFORMS = [
  "Intercom",
  "WhatsApp",
  "Email",
  "Instagram",
  "Facebook",
  "Other",
] as const;

export function validateTask(values: TaskFormValues) {
  const errors: Partial<Record<keyof TaskFormValues, TranslationKey>> = {};
  const taskDetails = values.taskDetails || values.details;
  const taskLink = values.intercomLink || values.chatLink;

  if (!values.clientName.trim()) errors.clientName = "clientRequired";
  if (!taskDetails.trim()) errors.taskDetails = "taskRequired";

  if (taskLink.trim() && !isValidUrl(taskLink)) {
    errors.intercomLink = "invalidLink";
  }

  return errors;
}

export function createTask(values: TaskFormValues): Task {
  const now = new Date().toISOString();
  const taskDetails = normalizeText(values.taskDetails || values.details);
  const intercomLink = normalizeUrl(values.intercomLink || values.chatLink);
  const status = normalizeClientTaskStatus(values.status);

  return {
    id: crypto.randomUUID(),
    clientName: values.clientName.trim(),
    chatLink: intercomLink || undefined,
    intercomLink: intercomLink || undefined,
    taskDescription: taskDetails,
    taskTitle: undefined,
    details: taskDetails || undefined,
    taskDetails: taskDetails || undefined,
    taskType: normalizeText(values.taskType) || undefined,
    estimatedCompletionDate: values.estimatedCompletionDate || undefined,
    status,
    completedAt: status === "done" ? now : undefined,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateTaskRecord(task: Task, values: TaskFormValues): Task {
  const taskDetails = normalizeText(values.taskDetails || values.details);
  const intercomLink = normalizeUrl(values.intercomLink || values.chatLink);
  const status = normalizeClientTaskStatus(values.status);
  const completedAt =
    status === "done" ? task.completedAt ?? new Date().toISOString() : undefined;

  return {
    ...task,
    clientName: values.clientName.trim(),
    chatLink: intercomLink || undefined,
    intercomLink: intercomLink || undefined,
    taskDescription: taskDetails,
    taskTitle: undefined,
    details: taskDetails || undefined,
    taskDetails: taskDetails || undefined,
    taskType: normalizeText(values.taskType) || undefined,
    estimatedCompletionDate: values.estimatedCompletionDate || undefined,
    status,
    completedAt,
    updatedAt: new Date().toISOString(),
  };
}

export function getCompletionTimingLabel(estimatedCompletionDate?: string, completedAt?: string) {
  if (!estimatedCompletionDate || !completedAt) return null;
  return new Date(completedAt).getTime() <= new Date(estimatedCompletionDate).getTime() ? "onTime" : "late";
}

export function normalizeStatus(value: string, fallback: string) {
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned || fallback;
}

export function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function getClientKey(clientName: string) {
  return normalizeText(clientName).toLowerCase();
}

export function getStatusTranslationKey(status: string) {
  const normalized = normalizeClientTaskStatus(status);
  if (normalized === "to do") return "toDo";
  if (normalized === "doing") return "doing";
  if (normalized === "done") return "done";
  return null;
}

export function buildStatusList(statuses: string[]) {
  const seen = new Set<string>();
  const ordered: string[] = [];

  statuses.forEach((status) => {
    const cleaned = normalizeText(status);
    if (!cleaned || seen.has(cleaned.toLowerCase())) return;
    seen.add(cleaned.toLowerCase());
    ordered.push(cleaned);
  });

  return ordered;
}

export function isDoingLikeStatus(status: string) {
  return normalizeClientTaskStatus(status) === "doing";
}

export function getInternalTaskStatusTranslationKey(status: string) {
  const normalized = normalizeInternalTaskStatus(status);
  if (normalized === "to do") return "toDo";
  if (normalized === "doing") return "doing";
  if (normalized === "done") return "done";
  return null;
}

export function getPriorityTranslationKey(priority: string) {
  const normalized = normalizeText(priority);
  if (normalized === "Low") return "low";
  if (normalized === "Medium") return "medium";
  if (normalized === "High") return "high";
  if (normalized === "Urgent") return "urgent";
  return null;
}

export function getCategoryTranslationKey(category: string) {
  const normalized = normalizeText(category);
  if (normalized === "Content") return "content";
  if (normalized === "Marketing") return "marketing";
  if (normalized === "Operations") return "operations";
  if (normalized === "Product") return "product";
  if (normalized === "Support") return "support";
  if (normalized === "Sales") return "sales";
  if (normalized === "Administration") return "administration";
  if (normalized === "Other") return "other";
  return null;
}

export function parseEstimatedHours(value: string) {
  const match = value.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number.parseFloat(match[1].replace(",", "."));
}

export function getTaskAgeInDays(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function normalizeClientTaskStatus(value: string, fallback: string = "to do") {
  const normalized = normalizeText(value).toLowerCase();
  if (["to do", "todo", "pending", "pendiente", "por hacer", "to-do"].includes(normalized)) return "to do";
  if (["doing", "in process", "in proces", "process", "en proceso", "in progress", "processing"].includes(normalized)) return "doing";
  if (["done", "completed", "complete", "hecho", "listo", "finalizado", "closed", "cerrado"].includes(normalized)) return "done";
  return normalizeText(fallback).toLowerCase();
}

export function normalizeInternalTaskStatus(value: string, fallback: string = "to do") {
  return normalizeClientTaskStatus(value, fallback);
}

export function normalizeHandledChatStatus(value: string, fallback: string = "closed") {
  const normalized = normalizeText(value).toLowerCase();
  if (["open", "abierto"].includes(normalized)) return "open";
  if (["closed", "cerrado", "done", "completed"].includes(normalized)) return "closed";
  return normalizeText(fallback).toLowerCase();
}

export function getHandledChatStatusTranslationKey(status: string) {
  const normalized = normalizeHandledChatStatus(status);
  if (normalized === "open") return "open";
  if (normalized === "closed") return "closed";
  return null;
}

export function isDoneStatus(status: string) {
  return normalizeClientTaskStatus(status) === "done";
}

export function isTodoStatus(status: string) {
  return normalizeClientTaskStatus(status) === "to do";
}

export function isActiveStatus(status: string) {
  const normalized = normalizeClientTaskStatus(status);
  return normalized === "to do" || normalized === "doing";
}

export type DateRangeFilter = "today" | "lastWeek" | "lastMonth" | "thisMonth" | "all";

export function matchesDateRange(isoDate: string, range: DateRangeFilter) {
  if (range === "all") return true;
  const date = new Date(isoDate);
  const now = new Date();

  if (range === "today") {
    return date.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
  }

  if (range === "lastWeek") {
    return now.getTime() - date.getTime() <= 1000 * 60 * 60 * 24 * 7;
  }

  if (range === "lastMonth") {
    return now.getTime() - date.getTime() <= 1000 * 60 * 60 * 24 * 30;
  }

  if (range === "thisMonth") {
    return date.getUTCFullYear() === now.getUTCFullYear() && date.getUTCMonth() === now.getUTCMonth();
  }

  return true;
}
