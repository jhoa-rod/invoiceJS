import { useLanguage } from "../hooks/useLanguage";
import type { Task } from "../types/task";
import { normalizeClientTaskStatus } from "../utils/taskHelpers";

interface DashboardCardsProps {
  tasks: Task[];
}

const cards = [
  { status: "done", labelKey: "done", style: "bg-emerald-100 text-emerald-700" },
  { status: "doing", labelKey: "doing", style: "bg-amber-100 text-amber-700" },
  { status: "to do", labelKey: "toDo", style: "bg-slate-100 text-slate-700" },
] as const;

export function DashboardCards({ tasks }: DashboardCardsProps) {
  const { t } = useLanguage();

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      {cards.map((item) => {
        const count = tasks.filter((task) => normalizeClientTaskStatus(task.status) === item.status).length;
        const recent = tasks
          .filter((task) => normalizeClientTaskStatus(task.status) === item.status)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 3);

        return (
          <article key={item.status} className="rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-soft">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-muted">{t(item.labelKey)}</p>
                <strong className="mt-2 block text-4xl font-extrabold text-ink">{count}</strong>
              </div>
              <span className={`rounded-2xl px-3 py-2 text-sm font-bold ${item.style}`}>
                {t(item.labelKey)}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t("recentTasks")}</p>
              {recent.length ? (
                recent.map((task) => (
                  <div key={task.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                    <p className="font-semibold text-ink">{task.clientName}</p>
                    <p className="line-clamp-1 text-muted">{task.taskTitle ?? task.taskDescription}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-line px-3 py-4 text-sm text-muted">
                  {t("noRecentTasks")}
                </p>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
