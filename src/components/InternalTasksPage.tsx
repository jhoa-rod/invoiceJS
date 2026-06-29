import { useMemo, useState, type FormEvent } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { InternalTask, InternalTaskFormValues } from "../types/internalTask";
import { exportInternalTasksCsv } from "../utils/exportInternalTasksCsv";
import {
  DEFAULT_INTERNAL_TASK_STATUSES,
  INTERNAL_TASK_PRIORITY_OPTIONS,
  buildStatusList,
  getCompletionTimingLabel,
  getInternalTaskStatusTranslationKey,
  getPriorityTranslationKey,
  normalizeInternalTaskStatus,
  normalizeText,
} from "../utils/taskHelpers";
import { InternalTaskDetailModal } from "./InternalTaskDetailModal";
import { InternalTaskForm } from "./InternalTaskForm";
import { InternalTaskTable } from "./InternalTaskTable";

interface InternalTasksPageProps {
  tasks: InternalTask[];
  userId?: string;
  onCreate: (task: InternalTask) => void;
  onUpdate: (task: InternalTask) => void;
  onDelete: (task: InternalTask) => void;
}

const initialValues: InternalTaskFormValues = {
  title: "",
  clientName: "",
  intercomLink: "",
  taskType: "",
  description: "",
  category: "",
  priority: "",
  status: "to do",
  assignee: "",
  dueDate: "",
  estimatedCompletionDate: "",
  completedAt: "",
  notes: "",
  relatedLink: "",
};

export function InternalTasksPage({ tasks, userId, onCreate, onUpdate, onDelete }: InternalTasksPageProps) {
  const { t } = useLanguage();
  const [values, setValues] = useState<InternalTaskFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof InternalTaskFormValues, string>>>({});
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<InternalTask | null>(null);
  const [titleFilter, setTitleFilter] = useState("");
  const [taskTypeFilter, setTaskTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [createdDateFilter, setCreatedDateFilter] = useState("");
  const [estimatedDateFilter, setEstimatedDateFilter] = useState("");
  const [completedDateFilter, setCompletedDateFilter] = useState("");
  const [detailsFilter, setDetailsFilter] = useState<"" | "late" | "onTime">("");

  const statuses = useMemo(
    () => buildStatusList([...DEFAULT_INTERNAL_TASK_STATUSES, ...tasks.map((task) => task.status)]),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesTitle = titleFilter ? task.title.toLowerCase().includes(titleFilter.toLowerCase()) : true;
        const matchesTaskType = taskTypeFilter ? (task.taskType ?? "").toLowerCase().includes(taskTypeFilter.toLowerCase()) : true;
        const matchesStatus = statusFilter ? task.status === statusFilter : true;
        const matchesPriority = priorityFilter ? (task.priority ?? "") === priorityFilter : true;
        const matchesCreatedDate = createdDateFilter ? task.createdAt.slice(0, 10) === createdDateFilter : true;
        const estimatedDate = task.estimatedCompletionDate ?? task.dueDate ?? "";
        const matchesEstimatedDate = estimatedDateFilter ? estimatedDate.slice(0, 10) === estimatedDateFilter : true;
        const matchesCompletedDate = completedDateFilter ? (task.completedAt ?? "").slice(0, 10) === completedDateFilter : true;
        const matchesDetails = detailsFilter
          ? getCompletionTimingLabel(task.estimatedCompletionDate ?? task.dueDate, task.completedAt) === detailsFilter
          : true;
        return matchesTitle && matchesTaskType && matchesStatus && matchesPriority && matchesCreatedDate && matchesEstimatedDate && matchesCompletedDate && matchesDetails;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [completedDateFilter, createdDateFilter, detailsFilter, estimatedDateFilter, priorityFilter, statusFilter, taskTypeFilter, tasks, titleFilter]);

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setEditingTaskId(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof InternalTaskFormValues, string>> = {};
    if (!normalizeText(values.title)) nextErrors.title = t("taskTitleRequired");
    if (!normalizeText(values.status)) nextErrors.status = t("statusRequired");

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const estimatedCompletionDate = values.estimatedCompletionDate || values.dueDate || undefined;
    const status = normalizeInternalTaskStatus(values.status);
    const completedAt = status === "done" ? values.completedAt || new Date().toISOString() : undefined;

    const payload: InternalTask = {
      id: editingTaskId ?? crypto.randomUUID(),
      userId,
      title: normalizeText(values.title),
      clientName: undefined,
      intercomLink: undefined,
      taskType: normalizeText(values.taskType) || undefined,
      description: normalizeText(values.description) || undefined,
      category: undefined,
      priority: normalizeText(values.priority) || undefined,
      status,
      assignee: undefined,
      dueDate: estimatedCompletionDate,
      estimatedCompletionDate,
      completedAt,
      notes: normalizeText(values.description) || undefined,
      relatedLink: undefined,
      createdAt: editingTaskId
        ? tasks.find((task) => task.id === editingTaskId)?.createdAt ?? new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingTaskId) {
      onUpdate(payload);
    } else {
      onCreate(payload);
    }

    setSelectedTask(null);
    resetForm();
  };

  const handleEdit = (task: InternalTask) => {
    setEditingTaskId(task.id);
    setValues({
      title: task.title,
      clientName: "",
      intercomLink: "",
      taskType: task.taskType ?? "",
      description: task.description ?? task.notes ?? "",
      category: "",
      priority: task.priority ?? "",
      status: task.status,
      assignee: "",
      dueDate: task.estimatedCompletionDate ?? task.dueDate ?? "",
      estimatedCompletionDate: task.estimatedCompletionDate ?? task.dueDate ?? "",
      completedAt: task.completedAt ?? "",
      notes: "",
      relatedLink: "",
    });
    setErrors({});
  };

  return (
    <section className="grid gap-6">
      <div className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-soft">
        <div className="mb-5 flex flex-col gap-2">
          <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            {t("internalTasks")}
          </span>
          <h2 className="text-2xl font-extrabold text-ink">
            {editingTaskId ? t("editInternalTask") : t("addInternalTask")}
          </h2>
        </div>
        <InternalTaskForm
          values={values}
          errors={errors}
          availableStatuses={statuses}
          onChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={Boolean(editingTaskId)}
        />
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-ink">{t("internalTasks")}</h3>
            <p className="text-sm text-muted">{t("internalTasksDescription")}</p>
          </div>
          <button
            type="button"
            onClick={() => exportInternalTasksCsv(filteredTasks)}
            className="rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {t("exportCsv")}
          </button>
        </div>

        <div className="mb-5 grid gap-4 lg:grid-cols-6">
          <input
            value={titleFilter}
            onChange={(event) => setTitleFilter(event.target.value)}
            placeholder={t("title")}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
          >
            <option value="">{t("allStatuses")}</option>
            {statuses.map((status) => {
              const key = getInternalTaskStatusTranslationKey(status);
              return (
                <option key={status} value={status}>
                  {key ? t(key) : status}
                </option>
              );
            })}
          </select>
          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
          >
            <option value="">{t("allPriorities")}</option>
            {INTERNAL_TASK_PRIORITY_OPTIONS.map((priority) => {
              const key = getPriorityTranslationKey(priority);
              return (
                <option key={priority} value={priority}>
                  {key ? t(key) : priority}
                </option>
              );
            })}
          </select>
          <input
            value={taskTypeFilter}
            onChange={(event) => setTaskTypeFilter(event.target.value)}
            placeholder={t("taskType")}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
          />
          <input
            type="date"
            value={createdDateFilter}
            onChange={(event) => setCreatedDateFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
          />
          <input
            type="date"
            value={estimatedDateFilter}
            onChange={(event) => setEstimatedDateFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
          />
          <input
            type="date"
            value={completedDateFilter}
            onChange={(event) => setCompletedDateFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
          />
          <select
            value={detailsFilter}
            onChange={(event) => setDetailsFilter(event.target.value as "" | "late" | "onTime")}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
          >
            <option value="">{t("details")}</option>
            <option value="late">{t("late")}</option>
            <option value="onTime">{t("onTime")}</option>
          </select>
        </div>

        <InternalTaskTable tasks={filteredTasks} onSelect={setSelectedTask} />
      </section>

      <InternalTaskDetailModal
        task={selectedTask}
        availableStatuses={statuses}
        onClose={() => setSelectedTask(null)}
        onSave={(updatedTask) => {
          onUpdate(updatedTask);
          setSelectedTask(null);
        }}
      />
    </section>
  );
}
