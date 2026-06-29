import { useAppContext } from "../context/AppContext";
import { SectionHeader } from "../components/common/SectionHeader";
import { TaskCard } from "../components/common/TaskCard";

export function TaskStatusPage() {
  const { state, statusGroups } = useAppContext();

  const columns = [
    { key: "pending", title: "Pending" },
    { key: "in_progress", title: "In progress" },
    { key: "completed", title: "Completed" },
  ];

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Task status"
        title="Clickable status overview"
        description="Open any task from this board and inspect its detail view."
      />

      <section className="status-board">
        {columns.map((column) => (
          <div key={column.key} className="panel">
            <div className="panel-title-row">
              <h3>{column.title}</h3>
              <span className="tag">{statusGroups[column.key].length}</span>
            </div>
            <div className="stack-list">
              {statusGroups[column.key].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  goal={state.goals.find((goal) => goal.id === task.goalId)}
                  compact
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
