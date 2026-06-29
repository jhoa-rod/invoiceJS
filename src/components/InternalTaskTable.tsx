import { useLanguage } from "../hooks/useLanguage";
import type { InternalTask } from "../types/internalTask";
import { getCompletionTimingLabel, getInternalTaskStatusTranslationKey, getPriorityTranslationKey } from "../utils/taskHelpers";
import { InternalTaskCard } from "./InternalTaskCard";

interface InternalTaskTableProps {
  tasks: InternalTask[];
  onSelect: (task: InternalTask) => void;
}

export function InternalTaskTable({ tasks, onSelect }: InternalTaskTableProps) {
  const { t } = useLanguage();

  if (!tasks.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-line bg-white/60 px-5 py-10 text-center text-sm text-muted">
        {t("noInternalTasks")}
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-[24px] border border-slate-200 bg-white lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">{t("title")}</th>
              <th className="px-4 py-3">{t("status")}</th>
              <th className="px-4 py-3">{t("priority")}</th>
              <th className="px-4 py-3">{t("taskType")}</th>
              <th className="px-4 py-3">{t("createdAt")}</th>
              <th className="px-4 py-3">{t("estimatedCompletionDate")}</th>
              <th className="px-4 py-3">{t("details")}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const priorityKey = getPriorityTranslationKey(task.priority ?? "");
              const statusKey = getInternalTaskStatusTranslationKey(task.status);
              return (
                <tr key={task.id} onClick={() => onSelect(task)} className="cursor-pointer border-t border-slate-100 align-top transition hover:bg-slate-50">
                  <td className="px-4 py-4 font-semibold text-ink">{task.title}</td>
                  <td className="px-4 py-4 text-slate-600">{statusKey ? t(statusKey) : task.status}</td>
                  <td className="px-4 py-4 text-slate-600">{task.priority ? (priorityKey ? t(priorityKey) : task.priority) : "—"}</td>
                  <td className="px-4 py-4 text-slate-600">{task.taskType ?? "—"}</td>
                  <td className="px-4 py-4 text-slate-600">{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-slate-600">{task.estimatedCompletionDate ?? task.dueDate ?? "—"}</td>
                  <td className="px-4 py-4 text-slate-600">
                    {(() => {
                      const timingKey = getCompletionTimingLabel(task.estimatedCompletionDate ?? task.dueDate, task.completedAt);
                      return timingKey ? t(timingKey) : "—";
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {tasks.map((task) => <InternalTaskCard key={task.id} task={task} onEdit={() => onSelect(task)} onDelete={() => onSelect(task)} />)}
      </div>
    </>
  );
}
