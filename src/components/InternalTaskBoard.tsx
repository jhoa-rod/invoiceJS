import { useLanguage } from "../hooks/useLanguage";
import type { InternalTask } from "../types/internalTask";
import { getInternalTaskStatusTranslationKey } from "../utils/taskHelpers";
import { InternalTaskCard } from "./InternalTaskCard";

interface InternalTaskBoardProps {
  tasks: InternalTask[];
  statuses: string[];
  onEdit: (task: InternalTask) => void;
  onDelete: (task: InternalTask) => void;
}

export function InternalTaskBoard({ tasks, statuses, onEdit, onDelete }: InternalTaskBoardProps) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {statuses.map((status) => {
        const items = tasks.filter((task) => task.status === status);
        const key = getInternalTaskStatusTranslationKey(status);

        return (
          <section key={status} className="rounded-[28px] border border-white/70 bg-gradient-to-b from-slate-50 to-white p-4 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-ink">{key ? t(key) : status}</h3>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-600">{items.length}</span>
            </div>
            <div className="grid gap-4">
              {items.length ? (
                items.map((task) => <InternalTaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />)
              ) : (
                <div className="rounded-[24px] border border-dashed border-line bg-white/70 px-4 py-10 text-center text-sm text-muted">
                  {t("noTasks")}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
