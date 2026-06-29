import { useLanguage } from "../hooks/useLanguage";
import type { Task, TaskStatus } from "../types/task";
import { TaskColumn } from "./TaskColumn";

interface KanbanBoardProps {
  tasks: Task[];
  statuses: string[];
  clientTaskCounts: Record<string, number>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (taskId: string, status: TaskStatus) => void;
}

export function KanbanBoard({ tasks, statuses, clientTaskCounts, onEdit, onDelete, onMove }: KanbanBoardProps) {
  const { t } = useLanguage();

  return (
    <section className="grid gap-5">
      <div>
        <h2 className="text-2xl font-extrabold text-ink">{t("boardTitle")}</h2>
        <p className="text-sm text-muted">{t("appSubtitle")}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            clientTaskCounts={clientTaskCounts}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
      </div>
    </section>
  );
}
