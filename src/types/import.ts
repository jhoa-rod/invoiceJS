import type { Client } from "./client";
import type { HandledChat } from "./handledChat";
import type { InternalTask } from "./internalTask";
import type { Task } from "./task";

export interface ParsedFileRow {
  [key: string]: string;
}

export interface BaseImportPreviewRow {
  id: string;
  include: boolean;
  warnings: string[];
  errors: string[];
  sourceRowNumber: number;
}

export interface TaskImportPreviewRow extends BaseImportPreviewRow {
  clientName: string;
  chatLink: string;
  intercomLink: string;
  taskDescription: string;
  taskTitle: string;
  details: string;
  taskDetails: string;
  taskType: string;
  status: string;
  createdAt: string;
  completedAt: string;
}

export interface ClientImportPreviewRow extends BaseImportPreviewRow {
  name: string;
  email: string;
  phone: string;
  company: string;
  chatLink: string;
  notes: string;
  isDuplicate: boolean;
}

export interface HandledChatImportPreviewRow extends BaseImportPreviewRow {
  clientName: string;
  contactName: string;
  chatLink: string;
  intercomLink: string;
  handledAt: string;
  notes: string;
  status: string;
}

export interface InternalTaskImportPreviewRow extends BaseImportPreviewRow {
  title: string;
  clientName: string;
  intercomLink: string;
  taskType: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignee: string;
  createdAt: string;
  dueDate: string;
  estimatedCompletionDate: string;
  completedAt: string;
  notes: string;
  relatedLink: string;
}

export interface TaskImportResult {
  rows: TaskImportPreviewRow[];
  detectedStatuses: string[];
}

export interface ClientImportResult {
  rows: ClientImportPreviewRow[];
}

export interface HandledChatImportResult {
  rows: HandledChatImportPreviewRow[];
}

export interface InternalTaskImportResult {
  rows: InternalTaskImportPreviewRow[];
  detectedStatuses: string[];
}

export interface TaskImportCommitResult {
  tasks: Task[];
  statuses: string[];
}

export interface ClientImportCommitResult {
  clients: Client[];
}

export interface HandledChatImportCommitResult {
  chats: HandledChat[];
}

export interface InternalTaskImportCommitResult {
  tasks: InternalTask[];
  statuses: string[];
}
