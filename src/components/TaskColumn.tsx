import { useLanguage } from "../hooks/useLanguage";
import type { TranslationKey } from "../i18n/translations";
import type { Task, TaskStatus } from "../types/task";
import { getClientKey, getStatusTranslationKey } from "../utils/taskHelpers";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  clientTaskCounts: Record<string, number>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (taskId: string, status: TaskStatus) => void;
}

const customColumnStyles = [
  { accent: "from-sky-100 to-white", dot: "bg-sky-500" },
  { accent: "from-indigo-100 to-white", dot: "bg-indigo-500" },
  { accent: "from-rose-100 to-white", dot: "bg-rose-500" },
  { accent: "from-cyan-100 to-white", dot: "bg-cyan-500" },
];

interface ColumnStyle {
  titleKey: TranslationKey | null;
  accent: string;
  dot: string;
}

function getColumnStyle(status: string): ColumnStyle {
  const statusKey = getStatusTranslationKey(status);
  if (statusKey === "toDo") return { titleKey: "toDo", accent: "from-todo/20 to-white", dot: "bg-todo" };
  if (statusKey === "doing") return { titleKey: "doing", accent: "from-amber-100 to-white", dot: "bg-amber-500" };
  if (statusKey === "done") return { titleKey: "done", accent: "from-emerald-100 to-white", dot: "bg-emerald-500" };

  const hash = status.split("").reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0);
  return { titleKey: null, ...customColumnStyles[hash % customColumnStyles.length] };
}

export function TaskColumn({ status, tasks, clientTaskCounts, onEdit, onDelete, onMove }: TaskColumnProps) {
  const { t } = useLanguage();
  const config = getColumnStyle(status);

  return (
    <section className={`rounded-[28px] border border-white/70 bg-gradient-to-b ${config.accent} p-4 shadow-soft`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${config.dot}`} />
          <h3 className="text-lg font-extrabold text-ink">{config.titleKey ? t(config.titleKey) : status}</h3>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-600">{tasks.length}</span>
      </div>

      <div className="grid gap-4">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              clientTaskCount={clientTaskCounts[getClientKey(task.clientName)] ?? 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-line bg-white/70 px-4 py-10 text-center text-sm text-muted">
            <p className="font-semibold">{t("noTasks")}</p>
            <p className="mt-1">{t("emptyColumn")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
