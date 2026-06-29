import { useAppContext } from "../context/AppContext";
import { SectionHeader } from "../components/common/SectionHeader";
import { TaskCard } from "../components/common/TaskCard";
import { formatMinutes } from "../utils/planner";

export function WeeklyTasksPage() {
  const { state, weeklyTasks } = useAppContext();

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Weekly tasks"
        title="Weekly execution view"
        description="See weekly workload, estimated time, and progress in one separated page."
      />

      <div className="stack-list">
        {weeklyTasks.map((task) => (
          <div key={task.id} className="panel weekly-row">
            <TaskCard
              task={task}
              goal={state.goals.find((goal) => goal.id === task.goalId)}
              compact
            />
            <div className="weekly-metrics">
              <div>
                <span>Weekly time target</span>
                <strong>{formatMinutes(task.weeklyTargetMinutes)}</strong>
              </div>
              <div>
                <span>Actual time</span>
                <strong>{formatMinutes(task.actualMinutes)}</strong>
              </div>
              <div>
                <span>Progress</span>
                <strong>{task.progress}%</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
