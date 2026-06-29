import { useLanguage } from "../hooks/useLanguage";
import type { StatusFilter } from "../types/task";
import { getStatusTranslationKey } from "../utils/taskHelpers";

interface TaskFiltersProps {
  clientQuery: string;
  intercomLinkFilter: string;
  detailsFilter: "" | "late" | "onTime";
  taskTypeFilter: string;
  statusFilter: StatusFilter;
  createdDateFilter: string;
  estimatedDateFilter: string;
  completedDateFilter: string;
  availableStatuses: string[];
  onClientQueryChange: (value: string) => void;
  onIntercomLinkFilterChange: (value: string) => void;
  onDetailsFilterChange: (value: "" | "late" | "onTime") => void;
  onTaskTypeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onCreatedDateFilterChange: (value: string) => void;
  onEstimatedDateFilterChange: (value: string) => void;
  onCompletedDateFilterChange: (value: string) => void;
  onExportCsv: () => void;
}

export function TaskFilters(props: TaskFiltersProps) {
  const { t } = useLanguage();

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-ink">{t("clientTasks")}</h2>
        </div>
        <button
          type="button"
          onClick={props.onExportCsv}
          className="rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          {t("exportCsv")}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-6">
        <input
          value={props.clientQuery}
          onChange={(event) => props.onClientQueryChange(event.target.value)}
          placeholder={t("clientName")}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
        />
        <input
          value={props.intercomLinkFilter}
          onChange={(event) => props.onIntercomLinkFilterChange(event.target.value)}
          placeholder={t("intercomLink")}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
        />
        <select
          value={props.statusFilter}
          onChange={(event) => props.onStatusFilterChange(event.target.value as StatusFilter)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
        >
          <option value="All">{t("allStatuses")}</option>
          {props.availableStatuses.map((status) => {
            const translationKey = getStatusTranslationKey(status);
            return (
              <option key={status} value={status}>
                {translationKey ? t(translationKey) : status}
              </option>
            );
          })}
        </select>
        <input
          type="date"
          value={props.createdDateFilter}
          onChange={(event) => props.onCreatedDateFilterChange(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
        />
        <input
          type="date"
          value={props.estimatedDateFilter}
          onChange={(event) => props.onEstimatedDateFilterChange(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
        />
        <input
          value={props.taskTypeFilter}
          onChange={(event) => props.onTaskTypeFilterChange(event.target.value)}
          placeholder={t("taskType")}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
        />
        <input
          type="date"
          value={props.completedDateFilter}
          onChange={(event) => props.onCompletedDateFilterChange(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
        />
        <select
          value={props.detailsFilter}
          onChange={(event) => props.onDetailsFilterChange(event.target.value as "" | "late" | "onTime")}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-4 focus:ring-slate-900/10"
        >
          <option value="">{t("details")}</option>
          <option value="late">{t("late")}</option>
          <option value="onTime">{t("onTime")}</option>
        </select>
      </div>
    </section>
  );
}
