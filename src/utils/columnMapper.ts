import type { ParsedFileRow } from "../types/import";

const aliasGroups = {
  chatLink: [
    "intercom link",
    "intercom",
    "chat",
    "chat link",
    "link",
    "link del chat",
    "link de intercom",
  ],
  taskType: ["task type", "tipo de tarea", "type", "tipo", "consulta", "query type"],
  taskDescription: [
    "taks",
    "tasks",
    "task",
    "tarea",
    "tarea por hacer",
    "task description",
    "description",
    "title",
    "asunto",
  ],
  details: [
    "especificaciones",
    "specifications",
    "details",
    "task details",
    "notes",
    "notas",
    "descripción",
    "descripcion",
    "comentarios",
  ],
  status: ["task status", "status", "estado", "task state", "state", "etapa"],
  clientName: [
    "cliente",
    "client",
    "client name",
    "nombre del cliente",
    "customer",
    "customer name",
    "name",
    "nombre",
    "company",
    "empresa",
  ],
  email: ["email", "correo", "correo electrónico", "mail"],
  phone: ["teléfono", "telefono", "phone", "mobile", "celular"],
  company: ["empresa", "company", "compañía", "compania", "organization"],
  notes: ["notas", "notes", "comments", "comentarios"],
  contactName: ["nombre", "contacto", "cliente", "client", "contact", "customer", "name"],
  platform: ["plataforma", "platform", "canal", "channel"],
  handledAt: ["fecha", "date", "handled at", "abordado", "fecha abordado"],
  handledBy: ["atendido por", "handled by", "agent", "user"],
  title: ["titulo", "título", "title", "tarea", "task", "nombre"],
  description: ["descripción", "descripcion", "description", "detalles", "details"],
  category: ["categoría", "categoria", "category", "tipo", "type"],
  priority: ["prioridad", "priority"],
  assignee: ["responsable", "assignee", "assigned to"],
  createdAt: ["created at", "fecha de creacion", "fecha de creación"],
  dueDate: ["fecha limite", "fecha límite", "due date", "deadline"],
  estimatedCompletionDate: ["estimated date", "fecha estimada", "estimated completion date", "estimated completion", "estimated finish"],
  completedAt: ["completed at", "fecha de finalizacion", "fecha de finalización", "finished at"],
  relatedLink: ["link", "enlace", "related link", "url"],
  } as const;

export type ColumnField = keyof typeof aliasGroups;

export function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

export function findMappedColumns(rows: ParsedFileRow[]) {
  const headers = Array.from(
    rows.reduce<Set<string>>((accumulator, row) => {
      Object.keys(row).forEach((key) => accumulator.add(key));
      return accumulator;
    }, new Set<string>()),
  );

  const normalizedHeaders = headers.map((header) => ({
    original: header,
    normalized: normalizeHeader(header),
  }));

  const mappings = {} as Partial<Record<ColumnField, string>>;

  (Object.keys(aliasGroups) as ColumnField[]).forEach((field) => {
    const aliases = aliasGroups[field] as readonly string[];
    const match = normalizedHeaders.find((header) => aliases.some((alias) => alias === header.normalized));
    if (match) mappings[field] = match.original;
  });

  if (!mappings.clientName) {
    const fallback = normalizedHeaders.find((header) => {
      if (!header.normalized || header.normalized.startsWith("__empty")) return true;
      return false;
    });

    if (fallback) mappings.clientName = fallback.original;
  }

  return mappings;
}

export function getRowValue(row: ParsedFileRow, key?: string) {
  if (!key) return "";
  const value = row[key];
  return typeof value === "string" ? value : String(value ?? "");
}
