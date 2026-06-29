import { useState, type FormEvent } from "react";
import { useLanguage } from "../hooks/useLanguage";
import type { Task, TaskFormValues } from "../types/task";
import { createTask, validateTask } from "../utils/taskHelpers";
import { TaskFields } from "./TaskFields";

interface TaskFormProps {
  onCreateTask: (task: Task) => void;
  availableStatuses: string[];
  clientSuggestions: string[];
}

const initialValues: TaskFormValues = {
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
};

export function TaskForm({ onCreateTask, availableStatuses, clientSuggestions }: TaskFormProps) {
  const { t } = useLanguage();
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormValues, string>>>({});

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

    onCreateTask(createTask(values));
    setValues(initialValues);
    setErrors({});
  };

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-soft">
      <div className="mb-6 flex flex-col gap-2">
        <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
          {t("addTask")}
        </span>
        <h2 className="text-2xl font-extrabold text-ink">{t("formTitle")}</h2>
        <p className="max-w-2xl text-sm text-muted">{t("formSubtitle")}</p>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <TaskFields
          values={values}
          errors={errors}
          setValues={setValues}
          availableStatuses={availableStatuses}
          clientSuggestions={clientSuggestions}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">{t("helperText")}</p>
          <button
            type="submit"
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            {t("createTask")}
          </button>
        </div>
      </form>
    </section>
  );
}
