export interface InternalTask {
  id: string;
  userId?: string;
  title: string;
  clientName?: string;
  intercomLink?: string;
  taskType?: string;
  description?: string;
  category?: string;
  priority?: string;
  status: string;
  assignee?: string;
  dueDate?: string;
  estimatedCompletionDate?: string;
  completedAt?: string;
  notes?: string;
  relatedLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InternalTaskFormValues {
  title: string;
  clientName: string;
  intercomLink: string;
  taskType: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignee: string;
  dueDate: string;
  estimatedCompletionDate: string;
  completedAt?: string;
  notes: string;
  relatedLink: string;
}
