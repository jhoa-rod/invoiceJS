import {
  isCurrentMonth,
  isCurrentYear,
  isWithinWeek,
  todayKey,
} from "./date";

const statusOrder = {
  pending: 0,
  in_progress: 1,
  completed: 2,
};

const priorityWeight = {
  high: 0,
  medium: 1,
  low: 2,
};

export function sortTasks(tasks) {
  return [...tasks].sort((left, right) => {
    const leftPriority = priorityWeight[left.priority] ?? 99;
    const rightPriority = priorityWeight[right.priority] ?? 99;
    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }
    return String(left.dueDate).localeCompare(String(right.dueDate));
  });
}

export function getTaskById(tasks, taskId) {
  return tasks.find((task) => task.id === taskId);
}

export function getGoalById(goals, goalId) {
  return goals.find((goal) => goal.id === goalId);
}

export function computeTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const inProgress = tasks.filter((task) => task.status === "in_progress").length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const estimatedMinutes = tasks.reduce(
    (sum, task) => sum + Number(task.estimatedMinutes || 0),
    0,
  );
  const actualMinutes = tasks.reduce(
    (sum, task) => sum + Number(task.actualMinutes || 0),
    0,
  );
  const progress = total
    ? Math.round(
        tasks.reduce((sum, task) => sum + Number(task.progress || 0), 0) / total,
      )
    : 0;

  return {
    total,
    completed,
    inProgress,
    pending,
    estimatedMinutes,
    actualMinutes,
    progress,
  };
}

export function getWeeklyTasks(tasks) {
  return sortTasks(tasks.filter((task) => isWithinWeek(task.dueDate)));
}

export function getDailyTasks(tasks, date = todayKey()) {
  return sortTasks(tasks.filter((task) => String(task.dueDate).slice(0, 10) === date));
}

export function getTasksForPeriod(tasks, period) {
  if (period === "monthly") {
    return sortTasks(tasks.filter((task) => isCurrentMonth(task.dueDate)));
  }
  if (period === "yearly") {
    return sortTasks(tasks.filter((task) => isCurrentYear(task.dueDate)));
  }
  return getWeeklyTasks(tasks);
}

export function getGoalProgress(goalId, tasks) {
  const related = tasks.filter((task) => task.goalId === goalId);
  if (!related.length) {
    return 0;
  }
  return Math.round(
    related.reduce((sum, task) => sum + Number(task.progress || 0), 0) / related.length,
  );
}

export function getGoalSummaries(goals, tasks) {
  return goals.map((goal) => {
    const related = tasks.filter((task) => task.goalId === goal.id);
    return {
      ...goal,
      progress: getGoalProgress(goal.id, tasks),
      taskCount: related.length,
      completedCount: related.filter((task) => task.status === "completed").length,
      estimatedMinutes: related.reduce(
        (sum, task) => sum + Number(task.estimatedMinutes || 0),
        0,
      ),
      actualMinutes: related.reduce(
        (sum, task) => sum + Number(task.actualMinutes || 0),
        0,
      ),
    };
  });
}

export function getWeeklyTone(progress) {
  if (progress >= 80) {
    return "positive";
  }
  if (progress >= 50) {
    return "warning";
  }
  return "danger";
}

export function formatMinutes(minutes) {
  const total = Number(minutes || 0);
  const hours = Math.floor(total / 60);
  const remaining = total % 60;
  if (!hours) {
    return `${remaining}m`;
  }
  if (!remaining) {
    return `${hours}h`;
  }
  return `${hours}h ${remaining}m`;
}

export function getOverdueTasks(tasks) {
  const today = todayKey();
  return sortTasks(
    tasks.filter((task) => task.status !== "completed" && task.dueDate < today),
  );
}

export function getPriorityAlerts(tasks) {
  return sortTasks(
    tasks.filter((task) => task.priority === "high" && task.status !== "completed"),
  ).slice(0, 4);
}

export function groupTasksByStatus(tasks) {
  return {
    pending: sortTasks(tasks.filter((task) => task.status === "pending")),
    in_progress: sortTasks(tasks.filter((task) => task.status === "in_progress")),
    completed: sortTasks(tasks.filter((task) => task.status === "completed")),
  };
}

export function getTaskScheduleMinutes(task, date) {
  return Number(task.plannedMinutesByDate?.[date] || 0);
}

export function buildRecommendations(tasks, goals) {
  const overdue = getOverdueTasks(tasks);
  const alerts = getPriorityAlerts(tasks);
  const goalSummaries = getGoalSummaries(goals, tasks);
  const laggingGoals = goalSummaries.filter((goal) => goal.progress < 50);

  const recommendations = [];

  if (alerts.length) {
    recommendations.push({
      id: "rec-priority",
      title: "Finish high-priority open work first",
      detail: `${alerts.length} high-priority tasks still need attention.`,
      tone: "warning",
    });
  }

  if (overdue.length) {
    recommendations.push({
      id: "rec-overdue",
      title: "Move overdue work into a realistic plan",
      detail: `${overdue.length} tasks are overdue and should be rescheduled.`,
      tone: "danger",
    });
  }

  if (laggingGoals.length) {
    recommendations.push({
      id: "rec-goal",
      title: "Protect time for slower goals",
      detail: `${laggingGoals[0].title} is behind its current target.`,
      tone: "warning",
    });
  }

  recommendations.push({
    id: "rec-focus",
    title: "Keep daily scope narrow",
    detail: "Aim for two or three meaningful tasks per day.",
    tone: "positive",
  });

  return recommendations;
}

export function getTaskLevelCompletion(task) {
  return Object.fromEntries(
    Object.entries(task.phases || {}).map(([key, items]) => [
      key,
      items.length
        ? Math.round(
            (items.filter((item) => item.done).length / items.length) * 100,
          )
        : 0,
    ]),
  );
}

export function getStatusLabelRank(status) {
  return statusOrder[status] ?? 99;
}
