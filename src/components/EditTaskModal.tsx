import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { Task, TaskFormValues } from "../types/task";
import { updateTaskRecord, validateTask } from "../utils/taskHelpers";
import { TaskFields } from "./TaskFields";

interface EditTaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
  availableStatuses: string[];
  clientSuggestions: string[];
}

export function EditTaskModal({
  task,
  onClose,
  onSave,
  availableStatuses,
  clientSuggestions,
}: EditTaskModalProps) {
  const { t } = useLanguage();
  const [values, setValues] = useState<TaskFormValues>({
    clientName: "",
    chatLink: "",
    intercomLink: "",
    taskDescription: "",
    taskTitle: "",
    details: "",
    taskDetails: "",
    taskType: "",
    estimatedCompletionDate: "",
    status: "to do",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormValues, string>>>({});

  useEffect(() => {
    if (!task) return;

    setValues({
      clientName: task.clientName,
      chatLink: task.intercomLink ?? task.chatLink ?? "",
      intercomLink: task.intercomLink ?? task.chatLink ?? "",
      taskDescription: task.taskTitle ?? task.taskDescription,
      taskTitle: "",
      details: task.taskDetails ?? task.details ?? "",
      taskDetails: task.taskDetails ?? task.details ?? "",
      taskType: task.taskType ?? "",
      estimatedCompletionDate: task.estimatedCompletionDate ?? "",
      status: task.status,
    });
    setErrors({});
  }, [task]);

  if (!task) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateTask(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(
        Object.fromEntries(
          Object.entries(nextErrors).map(([field, key]) => [field, key ? t(key) : ""]),
        ) as Partial<Record<keyof TaskFormValues, string>>,
      );
      return;
    }

    onSave(updateTaskRecord(task, values));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              {t("editTask")}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-ink">{task.clientName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-line px-4 py-2 text-sm font-semibold text-slate-600"
          >
            {t("cancel")}
          </button>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <TaskFields
            values={values}
            errors={errors}
            setValues={setValues}
            availableStatuses={availableStatuses}
            clientSuggestions={clientSuggestions}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-line px-5 py-3 text-sm font-semibold text-ink"
            >
              {t("cancel")}
            </button>
            <button type="submit" className="rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-white">
              {t("update")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
