import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { SectionHeader } from "../components/common/SectionHeader";
import { TaskCard } from "../components/common/TaskCard";
import { EmptyState } from "../components/common/EmptyState";
import { todayKey } from "../utils/date";
import { getDailyTasks, getTaskScheduleMinutes } from "../utils/planner";

export function DailyTasksPage() {
  const { state, updateTaskSchedule } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const tasks = getDailyTasks(state.tasks, selectedDate);

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Daily planning"
        title="Plan what should happen today"
        description="Assign daily time to each task with a cleaner dedicated view."
        action={
          <label className="field inline-field">
            <span>Date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>
        }
      />

      <div className="stack-list">
        {tasks.length ? (
          tasks.map((task) => (
            <div key={task.id} className="panel task-schedule-row">
              <TaskCard
                task={task}
                goal={state.goals.find((goal) => goal.id === task.goalId)}
                compact
              />
              <label className="field schedule-field">
                <span>Planned minutes for this day</span>
                <input
                  type="number"
                  min="0"
                  value={getTaskScheduleMinutes(task, selectedDate)}
                  onChange={(event) =>
                    updateTaskSchedule(task.id, selectedDate, event.target.value)
                  }
                />
              </label>
            </div>
          ))
        ) : (
          <EmptyState
            title="No tasks on this date"
            description="Choose another day or assign planned time from the task detail."
          />
        )}
      </div>
    </div>
  );
}
