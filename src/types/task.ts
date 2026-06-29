export type DefaultTaskStatus = "to do" | "doing" | "done";
export type TaskStatus = string;

export interface Task {
  id: string;
  clientName: string;
  chatLink?: string;
  intercomLink?: string;
  taskDescription: string;
  taskTitle?: string;
  details?: string;
  taskDetails?: string;
  estimatedTime?: string;
  taskType?: string;
  estimatedCompletionDate?: string;
  completedAt?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface TaskFormValues {
  clientName: string;
  chatLink: string;
  intercomLink: string;
  taskDescription: string;
  taskTitle: string;
  details: string;
  taskDetails: string;
  taskType: string;
  estimatedCompletionDate: string;
  completedAt?: string;
  status: TaskStatus;
}

export type StatusFilter = TaskStatus | "All";
export type SortField = "newest" | "oldest" | "completedAt";

export const DEFAULT_TASK_STATUSES: DefaultTaskStatus[] = ["to do", "doing", "done"];
