import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date";
import { formatMinutes } from "../../utils/planner";
import { useAppContext } from "../../context/AppContext";
import { ProgressBar } from "./ProgressBar";

export function TaskCard({ task, goal, compact = false, rightSlot }) {
  const { state, t } = useAppContext();

  return (
    <article className={`task-card ${compact ? "is-compact" : ""}`}>
      <div className="task-card-head">
        <div>
          <Link className="task-link" to={`/tasks/${task.id}`}>
            {task.name}
          </Link>
          <p>{task.description}</p>
        </div>
        {rightSlot || <span className={`status-pill is-${task.status}`}>{task.status}</span>}
      </div>

      <div className="meta-row">
        <span className={`tag priority-${task.priority}`}>{task.priority}</span>
        <span className="tag">{goal?.title || "Goal"}</span>
        <span className="tag">{formatDate(task.dueDate, state.language)}</span>
        <span className="tag">
          {t.common.estimated}: {formatMinutes(task.estimatedMinutes)}
        </span>
      </div>

      <div className="progress-meta">
        <span>{t.common.progress}</span>
        <strong>{task.progress}%</strong>
      </div>
      <ProgressBar value={task.progress} tone={task.progress >= 70 ? "positive" : "warning"} />
    </article>
  );
}
