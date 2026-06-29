import { ProgressBar } from "./ProgressBar";
import { formatMinutes } from "../../utils/planner";

export function GoalCard({ goal }) {
  return (
    <article className="goal-card">
      <div className="task-card-head">
        <div>
          <h3>{goal.title}</h3>
          <p>{goal.description}</p>
        </div>
        <span className={`tag priority-${goal.importance}`}>{goal.importance}</span>
      </div>

      <div className="meta-row">
        <span className="tag">{goal.category || "General"}</span>
        <span className="tag">{goal.horizon}</span>
        <span className="tag">{goal.taskCount} tasks</span>
        <span className="tag">{formatMinutes(goal.actualMinutes)}</span>
      </div>

      <div className="progress-meta">
        <span>Goal progress</span>
        <strong>{goal.progress}%</strong>
      </div>
      <ProgressBar value={goal.progress} tone={goal.progress >= 70 ? "positive" : "warning"} />
    </article>
  );
}
