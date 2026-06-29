import { useState } from "react";
import type { HandledChat } from "../types/handledChat";
import type { InternalTask } from "../types/internalTask";
import type { Task } from "../types/task";
import { useLanguage } from "../hooks/useLanguage";
import { ImportHandledChats } from "./ImportHandledChats";
import { ImportInternalTasks } from "./ImportInternalTasks";
import { ImportTasks } from "./ImportTasks";

interface ImportPageProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onImportTasks: (tasks: Task[], statuses: string[]) => void;
  onImportHandledChats: (chats: HandledChat[]) => void;
  onImportInternalTasks: (tasks: InternalTask[], statuses: string[]) => void;
}

export function ImportPage({
  isOpen,
  onClose,
  userId,
  onImportTasks,
  onImportHandledChats,
  onImportInternalTasks,
}: ImportPageProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"tasks" | "handledChats" | "internalTasks">("tasks");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-7xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">{t("importFromFile")}</h2>
            <p className="mt-2 text-sm text-muted">{t("importSubtitle")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink"
          >
            {t("close")}
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
              activeTab === "tasks" ? "bg-ink text-white" : "border border-slate-200 bg-slate-50 text-ink"
            }`}
          >
            {t("clientTasks")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("handledChats")}
            className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
              activeTab === "handledChats" ? "bg-ink text-white" : "border border-slate-200 bg-slate-50 text-ink"
            }`}
          >
            {t("handledChats")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("internalTasks")}
            className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
              activeTab === "internalTasks" ? "bg-ink text-white" : "border border-slate-200 bg-slate-50 text-ink"
            }`}
          >
            {t("internalTasks")}
          </button>
        </div>

        {activeTab === "tasks" ? (
          <ImportTasks userId={userId} onImport={onImportTasks} />
        ) : activeTab === "handledChats" ? (
          <ImportHandledChats userId={userId} onImport={onImportHandledChats} />
        ) : (
          <ImportInternalTasks userId={userId} onImport={onImportInternalTasks} />
        )}
      </div>
    </div>
  );
}
