import type { InternalTask } from "../types/internalTask";
import { downloadCsv } from "./exportCsv";
import { getCompletionTimingLabel } from "./taskHelpers";

export function exportInternalTasksCsv(tasks: InternalTask[]) {
  downloadCsv(
    `internal-tasks-${new Date().toISOString().slice(0, 10)}.csv`,
    ["title", "clientName", "intercomLink", "taskType", "priority", "status", "createdAt", "estimatedCompletionDate", "completedAt", "description", "lateOrOnTime"],
    tasks.map((task) => [
      task.title,
      task.clientName ?? "",
      task.intercomLink ?? "",
      task.taskType ?? "",
      task.priority ?? "",
      task.status,
      task.createdAt,
      task.estimatedCompletionDate ?? task.dueDate ?? "",
      task.completedAt ?? "",
      task.description ?? "",
      (() => {
        const timing = getCompletionTimingLabel(task.estimatedCompletionDate ?? task.dueDate, task.completedAt);
        if (timing === "late") return "Late";
        if (timing === "onTime") return "On time";
        return "";
      })(),
    ]),
  );
}
