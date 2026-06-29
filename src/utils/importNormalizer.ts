import type { Language } from "../i18n/translations";
import type {
  ClientImportPreviewRow,
  ClientImportResult,
  HandledChatImportPreviewRow,
  HandledChatImportResult,
  InternalTaskImportPreviewRow,
  InternalTaskImportResult,
  ParsedFileRow,
  TaskImportPreviewRow,
  TaskImportResult,
} from "../types/import";
import type { Client } from "../types/client";
import type { HandledChat } from "../types/handledChat";
import type { InternalTask } from "../types/internalTask";
import type { Task } from "../types/task";
import { findMappedColumns, getRowValue } from "./columnMapper";
import {
  buildStatusList,
  getClientKey,
  normalizeClientTaskStatus,
  normalizeHandledChatStatus,
  normalizeInternalTaskStatus,
  normalizeText,
} from "./taskHelpers";
import { normalizeUrl } from "./links";

function isRowEmpty(values: string[]) {
  return values.every((value) => !normalizeText(value));
}

function seemsValidUrl(value: string) {
  if (!value.trim()) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function normalizeTaskImportRows(rows: ParsedFileRow[], language: Language): TaskImportResult {
  const mappings = findMappedColumns(rows);
  const previewRows: TaskImportPreviewRow[] = [];
  const detectedStatuses = new Set<string>();

  rows.forEach((row, index) => {
    const allValues = Object.values(row).map((value) => String(value ?? ""));
    if (isRowEmpty(allValues)) return;

    const rawClient = normalizeText(getRowValue(row, mappings.clientName));
    const rawLink = normalizeText(getRowValue(row, mappings.chatLink));
    const rawTask = normalizeText(getRowValue(row, mappings.taskDescription)) || normalizeText(getRowValue(row, mappings.title));
    const rawDetails = normalizeText(getRowValue(row, mappings.details)) || normalizeText(getRowValue(row, mappings.description));
    const rawTaskType = normalizeText(getRowValue(row, mappings.taskType));
    const rawStatus = normalizeText(getRowValue(row, mappings.status));
    const fallbackStatus = "to do";
    const fallbackClient = language === "es" ? "Sin cliente" : "No client";

    const errors: string[] = [];
    const warnings: string[] = [];
    const taskDescription = rawTask || rawDetails;

    if (!taskDescription) {
      errors.push(language === "es" ? "Falta tarea y especificaciones" : "Missing task and details");
    } else if (!rawTask && rawDetails) {
      warnings.push(
        language === "es"
          ? "Se usaron las especificaciones como tarea principal"
          : "Details were used as the main task",
      );
    }

    if (!seemsValidUrl(rawLink)) {
      warnings.push(language === "es" ? "El link parece inválido" : "The link looks invalid");
    }

    const status = normalizeClientTaskStatus(rawStatus || fallbackStatus);
    detectedStatuses.add(status);

    previewRows.push({
      id: crypto.randomUUID(),
      include: errors.length === 0,
      warnings,
      errors,
      sourceRowNumber: index + 2,
      clientName: rawClient || fallbackClient,
      chatLink: rawLink,
      intercomLink: rawLink,
      taskDescription,
      taskTitle: taskDescription,
      details: rawDetails,
      taskDetails: rawDetails,
      taskType: rawTaskType,
      status,
      createdAt: normalizeText(getRowValue(row, (mappings as Record<string, string | undefined>).createdAt)) || new Date().toISOString(),
      completedAt: status === "done" ? new Date().toISOString() : "",
    });
  });

  return {
    rows: previewRows,
    detectedStatuses: buildStatusList([...detectedStatuses]),
  };
}

export function normalizeClientImportRows(
  rows: ParsedFileRow[],
  language: Language,
  existingClients: Client[],
): ClientImportResult {
  const mappings = findMappedColumns(rows);
  const previewRows: ClientImportPreviewRow[] = [];
  const knownKeys = new Set(
    existingClients.map((client) => `${getClientKey(client.name)}::${normalizeText(client.email ?? "").toLowerCase()}`),
  );

  rows.forEach((row, index) => {
    const allValues = Object.values(row).map((value) => String(value ?? ""));
    if (isRowEmpty(allValues)) return;

    const name = normalizeText(getRowValue(row, mappings.clientName));
    const email = normalizeText(getRowValue(row, mappings.email));
    const phone = normalizeText(getRowValue(row, mappings.phone));
    const company = normalizeText(getRowValue(row, mappings.company));
    const chatLink = normalizeText(getRowValue(row, mappings.chatLink));
    const notes = normalizeText(getRowValue(row, mappings.notes)) || normalizeText(getRowValue(row, mappings.details));
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!name) {
      errors.push(language === "es" ? "Falta el nombre del cliente" : "Client name is missing");
    }

    if (!seemsValidUrl(chatLink)) {
      warnings.push(language === "es" ? "El link parece inválido" : "The link looks invalid");
    }

    const duplicateKey = `${getClientKey(name)}::${email.toLowerCase()}`;
    const isDuplicate = Boolean(name) && knownKeys.has(duplicateKey);

    if (isDuplicate) {
      warnings.push(
        language === "es"
          ? "Cliente duplicado detectado, se actualizará al importar"
          : "Duplicate client detected, it will be updated on import",
      );
    }

    previewRows.push({
      id: crypto.randomUUID(),
      include: errors.length === 0,
      warnings,
      errors,
      sourceRowNumber: index + 2,
      name,
      email,
      phone,
      company,
      chatLink,
      notes,
      isDuplicate,
    });
  });

  return { rows: previewRows };
}

export function normalizeHandledChatImportRows(
  rows: ParsedFileRow[],
  language: Language,
): HandledChatImportResult {
  const mappings = findMappedColumns(rows);
  const previewRows: HandledChatImportPreviewRow[] = [];

  rows.forEach((row, index) => {
    const allValues = Object.values(row).map((value) => String(value ?? ""));
    if (isRowEmpty(allValues)) return;

    const contactName =
      normalizeText(getRowValue(row, mappings.clientName)) ||
      normalizeText(getRowValue(row, mappings.contactName));
    const chatLink = normalizeText(getRowValue(row, mappings.chatLink));
    const handledAt = normalizeText(getRowValue(row, mappings.handledAt)) || new Date().toISOString().slice(0, 16);
    const notes = normalizeText(getRowValue(row, mappings.notes)) || normalizeText(getRowValue(row, mappings.details));
    const status = normalizeHandledChatStatus(normalizeText(getRowValue(row, mappings.status)) || "closed");
    const errors: string[] = [];
    const warnings: string[] = [];

    const fallbackClient = language === "es" ? "Sin cliente" : "No client";

    if (!contactName) {
      warnings.push(language === "es" ? "Falta el nombre del cliente" : "Client name is missing");
    }

    if (!chatLink) {
      warnings.push(language === "es" ? "Falta el link de Intercom" : "Intercom link is missing");
    } else if (!seemsValidUrl(chatLink)) {
      warnings.push(language === "es" ? "El link parece inválido" : "The link looks invalid");
    }

    previewRows.push({
      id: crypto.randomUUID(),
      include: errors.length === 0,
      warnings,
      errors,
      sourceRowNumber: index + 2,
      clientName: contactName || fallbackClient,
      contactName: contactName || fallbackClient,
      chatLink,
      intercomLink: chatLink,
      handledAt,
      notes,
      status,
    });
  });

  return { rows: previewRows };
}

export function normalizeInternalTaskImportRows(
  rows: ParsedFileRow[],
  language: Language,
): InternalTaskImportResult {
  const mappings = findMappedColumns(rows);
  const previewRows: InternalTaskImportPreviewRow[] = [];
  const detectedStatuses = new Set<string>();

  rows.forEach((row, index) => {
    const allValues = Object.values(row).map((value) => String(value ?? ""));
    if (isRowEmpty(allValues)) return;

    const title =
      normalizeText(getRowValue(row, mappings.title)) ||
      normalizeText(getRowValue(row, mappings.taskDescription));
    const clientName = normalizeText(getRowValue(row, mappings.clientName));
    const intercomLink = normalizeText(getRowValue(row, mappings.chatLink));
    const taskType = normalizeText(getRowValue(row, mappings.taskType));
    const description =
      normalizeText(getRowValue(row, mappings.description)) ||
      normalizeText(getRowValue(row, mappings.details));
    const category = normalizeText(getRowValue(row, mappings.category));
    const priority = normalizeText(getRowValue(row, mappings.priority));
    const status = normalizeInternalTaskStatus(normalizeText(getRowValue(row, mappings.status)) || "to do");
    const assignee = normalizeText(getRowValue(row, mappings.assignee));
    const createdAt = normalizeText(getRowValue(row, (mappings as Record<string, string | undefined>).createdAt));
    const dueDate =
      normalizeText(getRowValue(row, mappings.estimatedCompletionDate)) ||
      normalizeText(getRowValue(row, mappings.dueDate));
    const completedAt = normalizeText(getRowValue(row, (mappings as Record<string, string | undefined>).completedAt));
    const notes = normalizeText(getRowValue(row, mappings.notes));
    const relatedLink =
      normalizeText(getRowValue(row, mappings.relatedLink)) ||
      normalizeText(getRowValue(row, mappings.chatLink));
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!title) {
      errors.push(language === "es" ? "Falta el título de la tarea" : "Task title is missing");
    }

    if (!seemsValidUrl(relatedLink)) {
      warnings.push(language === "es" ? "El link parece inválido" : "The link looks invalid");
    }

    detectedStatuses.add(status);

    previewRows.push({
      id: crypto.randomUUID(),
      include: errors.length === 0,
      warnings,
      errors,
      sourceRowNumber: index + 2,
      title,
      clientName,
      intercomLink,
      taskType,
      description,
      category,
      priority,
      status,
      assignee,
      createdAt,
      dueDate,
      estimatedCompletionDate: dueDate,
      completedAt: completedAt || (status === "done" ? new Date().toISOString() : ""),
      notes,
      relatedLink,
    });
  });

  return { rows: previewRows, detectedStatuses: buildStatusList([...detectedStatuses]) };
}

export function commitTaskRows(rows: TaskImportPreviewRow[], userId?: string): Task[] {
  const now = new Date().toISOString();
  return rows
    .filter((row) => row.include && row.errors.length === 0)
    .map((row) => ({
      id: crypto.randomUUID(),
      clientName: normalizeText(row.clientName),
      chatLink: normalizeUrl(row.intercomLink || row.chatLink) || undefined,
      intercomLink: normalizeUrl(row.intercomLink || row.chatLink) || undefined,
      taskDescription: normalizeText(row.taskTitle || row.taskDescription),
      taskTitle: normalizeText(row.taskTitle || row.taskDescription),
      details: normalizeText(row.taskDetails || row.details) || undefined,
      taskDetails: normalizeText(row.taskDetails || row.details) || undefined,
      taskType: normalizeText(row.taskType) || undefined,
      estimatedCompletionDate: undefined,
      completedAt: normalizeText(row.completedAt) || undefined,
      status: normalizeClientTaskStatus(row.status),
      createdAt: normalizeText(row.createdAt) || now,
      updatedAt: now,
      userId,
    }));
}

export function commitClientRows(rows: ClientImportPreviewRow[], userId?: string): Client[] {
  const now = new Date().toISOString();
  return rows
    .filter((row) => row.include && row.errors.length === 0)
    .map((row) => ({
      id: crypto.randomUUID(),
      name: normalizeText(row.name),
      email: normalizeText(row.email) || undefined,
      phone: normalizeText(row.phone) || undefined,
      company: normalizeText(row.company) || undefined,
      chatLink: normalizeText(row.chatLink) || undefined,
      notes: normalizeText(row.notes) || undefined,
      createdAt: now,
      updatedAt: now,
      userId,
    }));
}

export function commitHandledChatRows(rows: HandledChatImportPreviewRow[], userId?: string): HandledChat[] {
  const now = new Date().toISOString();
  return rows
    .filter((row) => row.include && row.errors.length === 0)
    .map((row) => ({
      id: crypto.randomUUID(),
      userId,
      clientName: normalizeText(row.clientName || row.contactName),
      contactName: normalizeText(row.clientName || row.contactName),
      chatLink: normalizeUrl(row.intercomLink || row.chatLink) || undefined,
      intercomLink: normalizeUrl(row.intercomLink || row.chatLink) || undefined,
      handledAt: row.handledAt,
      notes: normalizeText(row.notes) || undefined,
      status: normalizeHandledChatStatus(row.status || "closed"),
      sourceTaskId: undefined,
      createdAt: now,
      updatedAt: now,
    }));
}

export function commitInternalTaskRows(
  rows: InternalTaskImportPreviewRow[],
  userId?: string,
): InternalTask[] {
  const now = new Date().toISOString();
  return rows
    .filter((row) => row.include && row.errors.length === 0)
    .map((row) => ({
      id: crypto.randomUUID(),
      userId,
      title: normalizeText(row.title),
      clientName: normalizeText(row.clientName) || undefined,
      intercomLink: normalizeUrl(row.intercomLink) || undefined,
      taskType: normalizeText(row.taskType) || undefined,
      description: normalizeText(row.description) || undefined,
      category: normalizeText(row.category) || undefined,
      priority: normalizeText(row.priority) || undefined,
      status: normalizeInternalTaskStatus(row.status),
      assignee: normalizeText(row.assignee) || undefined,
      dueDate: row.estimatedCompletionDate || row.dueDate || undefined,
      estimatedCompletionDate: row.estimatedCompletionDate || row.dueDate || undefined,
      completedAt: row.completedAt || (normalizeInternalTaskStatus(row.status) === "done" ? now : undefined),
      notes: normalizeText(row.notes) || undefined,
      relatedLink: normalizeText(row.relatedLink) || undefined,
      createdAt: now,
      updatedAt: now,
    }));
}
