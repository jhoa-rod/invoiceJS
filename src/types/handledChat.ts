export interface HandledChat {
  id: string;
  userId?: string;
  clientName?: string;
  contactName: string;
  chatLink?: string;
  intercomLink?: string;
  platform?: string;
  handledAt: string;
  taskType?: string;
  notes?: string;
  handledBy?: string;
  status?: string;
  sourceTaskId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HandledChatFormValues {
  clientName: string;
  contactName: string;
  chatLink: string;
  intercomLink: string;
  platform: string;
  handledAt: string;
  taskType: string;
  notes: string;
  handledBy: string;
  status: string;
  sourceTaskId?: string;
}
