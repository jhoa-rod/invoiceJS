import { useMemo } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { Client } from "../types/client";
import type { HandledChat } from "../types/handledChat";
import type { InternalTask } from "../types/internalTask";
import type { Task } from "../types/task";
import {
  isActiveStatus,
  isDoneStatus,
  normalizeHandledChatStatus,
} from "../utils/taskHelpers";

interface DashboardOverviewProps {
  tasks: Task[];
  clients: Client[];
  handledChats: HandledChat[];
  internalTasks: InternalTask[];
}

function isWithinLastDays(isoDate: string, days: number) {
  const date = new Date(isoDate).getTime();
  const now = Date.now();
  return now - date <= days * 24 * 60 * 60 * 1000;
}

function isCurrentMonth(isoDate: string) {
  const date = new Date(isoDate);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function MetricCard({
  label,
  value,
  style,
}: {
  label: string;
  value: number;
  style: string;
}) {
  return (
    <article className={`rounded-[28px] border border-white/70 p-6 shadow-soft ${style}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <strong className="mt-3 block text-5xl font-extrabold">{value}</strong>
    </article>
  );
}

function StatusSectionCard({
  label,
  value,
  items,
  style,
  emptyLabel,
}: {
  label: string;
  value: number;
  items: Array<{ id: string; title: string; subtitle: string }>;
  style: string;
  emptyLabel: string;
}) {
  return (
    <article className={`rounded-[28px] border border-white/70 p-5 shadow-soft ${style}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold opacity-80">{label}</p>
          <strong className="mt-2 block text-4xl font-extrabold">{value}</strong>
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white/70 px-3 py-2 text-sm">
              <p className="font-semibold text-ink">{item.title}</p>
              <p className="text-muted">{item.subtitle}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">{emptyLabel}</p>
        )}
      </div>
    </article>
  );
}

export function DashboardOverview({ tasks, clients: _clients, handledChats, internalTasks }: DashboardOverviewProps) {
  const { t, language } = useLanguage();
  const locale = language === "es" ? "es-ES" : "en-US";

  const activeTasks = useMemo(
    () =>
      tasks.filter((task) => isActiveStatus(task.status)).length +
      internalTasks.filter((task) => isActiveStatus(task.status)).length,
    [internalTasks, tasks],
  );

  const completedTasks = useMemo(
    () =>
      tasks.filter((task) => isDoneStatus(task.status)).length +
      internalTasks.filter((task) => isDoneStatus(task.status)).length,
    [internalTasks, tasks],
  );

  const monthlyStats = useMemo(() => {
    const chatsThisMonth = handledChats.filter((chat) => isCurrentMonth(chat.handledAt)).length;
    const completedClientTasksThisMonth = tasks.filter(
      (task) => task.completedAt && isDoneStatus(task.status) && isCurrentMonth(task.completedAt),
    ).length;
    const completedInternalTasksThisMonth = internalTasks.filter(
      (task) => task.completedAt && isDoneStatus(task.status) && isCurrentMonth(task.completedAt),
    ).length;

    return {
      chatsThisMonth,
      completedTasksThisMonth: completedClientTasksThisMonth + completedInternalTasksThisMonth,
    };
  }, [handledChats, internalTasks, tasks]);

  const chatCards = useMemo(() => {
    const weeklyChats = handledChats.filter((chat) => isWithinLastDays(chat.handledAt, 7));
    const makeItems = (status: "closed" | "open") =>
      weeklyChats
        .filter((chat) => normalizeHandledChatStatus(chat.status ?? "closed") === status)
        .sort((a, b) => new Date(b.handledAt).getTime() - new Date(a.handledAt).getTime())
        .slice(0, 4)
        .map((chat) => ({
          id: chat.id,
          title: chat.clientName ?? chat.contactName,
          subtitle: new Date(chat.handledAt).toLocaleDateString(locale),
        }));

    return {
      weeklyCount: weeklyChats.length,
      archivedCount: Math.max(handledChats.length - weeklyChats.length, 0),
      closed: {
        count: weeklyChats.filter((chat) => normalizeHandledChatStatus(chat.status ?? "closed") === "closed").length,
        items: makeItems("closed"),
      },
      open: {
        count: weeklyChats.filter((chat) => normalizeHandledChatStatus(chat.status ?? "closed") === "open").length,
        items: makeItems("open"),
      },
    };
  }, [handledChats, locale]);

  const taskCards = useMemo(() => {
    const makeTaskItems = (source: Task[] | InternalTask[], status: "done" | "doing" | "to do", getTitle: (item: Task | InternalTask) => string, getSubtitle: (item: Task | InternalTask) => string) =>
      source
        .filter((item) => item.status === status)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)
        .map((item) => ({
          id: item.id,
          title: getTitle(item),
          subtitle: getSubtitle(item),
        }));

    return {
      client: {
        done: {
          count: tasks.filter((task) => task.status === "done").length,
          items: makeTaskItems(tasks, "done", (item) => (item as Task).clientName, (item) => (item as Task).taskTitle ?? (item as Task).taskDescription),
        },
        doing: {
          count: tasks.filter((task) => task.status === "doing").length,
          items: makeTaskItems(tasks, "doing", (item) => (item as Task).clientName, (item) => (item as Task).taskTitle ?? (item as Task).taskDescription),
        },
        todo: {
          count: tasks.filter((task) => task.status === "to do").length,
          items: makeTaskItems(tasks, "to do", (item) => (item as Task).clientName, (item) => (item as Task).taskTitle ?? (item as Task).taskDescription),
        },
      },
      internal: {
        done: {
          count: internalTasks.filter((task) => task.status === "done").length,
          items: makeTaskItems(internalTasks, "done", (item) => (item as InternalTask).title, (item) => (item as InternalTask).description ?? new Date(item.createdAt).toLocaleDateString(locale)),
        },
        doing: {
          count: internalTasks.filter((task) => task.status === "doing").length,
          items: makeTaskItems(internalTasks, "doing", (item) => (item as InternalTask).title, (item) => (item as InternalTask).description ?? new Date(item.createdAt).toLocaleDateString(locale)),
        },
        todo: {
          count: internalTasks.filter((task) => task.status === "to do").length,
          items: makeTaskItems(internalTasks, "to do", (item) => (item as InternalTask).title, (item) => (item as InternalTask).description ?? new Date(item.createdAt).toLocaleDateString(locale)),
        },
      },
    };
  }, [internalTasks, locale, tasks]);

  return (
    <section className="grid gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-ink">{t("dashboard")}</h2>
        <p className="mt-2 text-sm text-muted">{t("dashboardSubtitle")}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <MetricCard label={t("activeTasks")} value={activeTasks} style="bg-ink text-white" />
        <MetricCard label={t("completedTasks")} value={completedTasks} style="bg-slate-900 text-white" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <StatusSectionCard
          label={t("handledChatsThisMonth")}
          value={monthlyStats.chatsThisMonth}
          items={[]}
          style="bg-white text-ink"
          emptyLabel={t("monthCountHint")}
        />
        <StatusSectionCard
          label={t("completedTasksThisMonth")}
          value={monthlyStats.completedTasksThisMonth}
          items={[]}
          style="bg-white text-ink"
          emptyLabel={t("monthCountHint")}
        />
      </section>

      <section className="grid gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-ink">{t("clientTasks")}</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <StatusSectionCard label={t("done")} value={taskCards.client.done.count} items={taskCards.client.done.items} style="bg-white text-ink" emptyLabel={t("noTasks")} />
          <StatusSectionCard label={t("doing")} value={taskCards.client.doing.count} items={taskCards.client.doing.items} style="bg-white text-ink" emptyLabel={t("noTasks")} />
          <StatusSectionCard label={t("toDo")} value={taskCards.client.todo.count} items={taskCards.client.todo.items} style="bg-white text-ink" emptyLabel={t("noTasks")} />
        </div>
      </section>

      <section className="grid gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-ink">{t("handledChats")}</h3>
          <p className="mt-2 text-sm text-muted">
            {language === "es"
              ? `${t("weeklyChatsLabel")}: ${chatCards.weeklyCount} · ${t("archivedChats")}: ${chatCards.archivedCount} · ${t("handledChatsThisMonth")}: ${monthlyStats.chatsThisMonth}`
              : `${t("weeklyChatsLabel")}: ${chatCards.weeklyCount} · ${t("archivedChats")}: ${chatCards.archivedCount} · ${t("handledChatsThisMonth")}: ${monthlyStats.chatsThisMonth}`}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <StatusSectionCard label={t("closed")} value={chatCards.closed.count} items={chatCards.closed.items} style="bg-white text-ink" emptyLabel={t("noChats")} />
          <StatusSectionCard label={t("open")} value={chatCards.open.count} items={chatCards.open.items} style="bg-white text-ink" emptyLabel={t("noChats")} />
        </div>
      </section>

      <section className="grid gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-ink">{t("internalTasks")}</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <StatusSectionCard label={t("done")} value={taskCards.internal.done.count} items={taskCards.internal.done.items} style="bg-white text-ink" emptyLabel={t("noInternalTasks")} />
          <StatusSectionCard label={t("doing")} value={taskCards.internal.doing.count} items={taskCards.internal.doing.items} style="bg-white text-ink" emptyLabel={t("noInternalTasks")} />
          <StatusSectionCard label={t("toDo")} value={taskCards.internal.todo.count} items={taskCards.internal.todo.items} style="bg-white text-ink" emptyLabel={t("noInternalTasks")} />
        </div>
      </section>
    </section>
  );
}
