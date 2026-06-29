import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { SectionHeader } from "../components/common/SectionHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ProgressBar } from "../components/common/ProgressBar";
import { formatDate } from "../utils/date";
import { formatMinutes, getGoalById, getTaskById, getTaskLevelCompletion } from "../utils/planner";

function PhaseColumn({ title, items, onAdd, onToggle }) {
  const [draft, setDraft] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!draft.trim()) {
      return;
    }
    onAdd(draft.trim());
    setDraft("");
  }

  return (
    <article className="panel">
      <div className="panel-title-row">
        <h3>{title}</h3>
        <span className="tag">{items.length}</span>
      </div>
      <div className="stack-list">
        {items.map((item) => (
          <label key={item.id} className="check-row">
            <input type="checkbox" checked={item.done} onChange={onToggle(item.id)} />
            <span>{item.title}</span>
          </label>
        ))}
      </div>
      <form className="stack-list" onSubmit={handleSubmit}>
        <label className="field">
          <span>Add step</span>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} />
        </label>
        <button className="ghost-button" type="submit">
          Add
        </button>
      </form>
    </article>
  );
}

export function TaskDetailPage() {
  const { taskId } = useParams();
  const {
    state,
    updateTask,
    addTaskPhase,
    toggleTaskPhase,
  } = useAppContext();

  const task = getTaskById(state.tasks, taskId);
  const goal = task ? getGoalById(state.goals, task.goalId) : null;
  const levels = useMemo(() => (task ? getTaskLevelCompletion(task) : {}), [task]);

  if (!task) {
    return <EmptyState title="Task not found" description="This task does not exist." />;
  }

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Task detail"
        title={task.name}
        description="A dedicated workspace for the task, its execution plan, and progress."
      />

      <section className="page-two-column">
        <article className="panel stack-list">
          <div className="panel-title-row">
            <h3>Task overview</h3>
            <span className={`tag priority-${task.priority}`}>{task.priority}</span>
          </div>
          <p>{task.description}</p>
          <div className="meta-grid">
            <div className="meta-card">
              <span>Goal</span>
              <strong>{goal?.title}</strong>
            </div>
            <div className="meta-card">
              <span>Deadline</span>
              <strong>{formatDate(task.dueDate, state.language)}</strong>
            </div>
            <div className="meta-card">
              <span>Estimated time</span>
              <strong>{formatMinutes(task.estimatedMinutes)}</strong>
            </div>
            <div className="meta-card">
              <span>Actual time</span>
              <strong>{formatMinutes(task.actualMinutes)}</strong>
            </div>
          </div>

          <label className="field">
            <span>Status</span>
            <select
              value={task.status}
              onChange={(event) => updateTask(task.id, { status: event.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="field">
            <span>Progress</span>
            <input
              type="range"
              min="0"
              max="100"
              value={task.progress}
              onChange={(event) =>
                updateTask(task.id, { progress: Number(event.target.value) })
              }
            />
          </label>
          <ProgressBar
            value={task.progress}
            tone={task.progress >= 70 ? "positive" : "warning"}
          />
          <label className="field">
            <span>Notes</span>
            <textarea
              value={task.notes}
              onChange={(event) => updateTask(task.id, { notes: event.target.value })}
            />
          </label>
        </article>

        <article className="panel stack-list">
          <h3>Execution levels</h3>
          <div className="meta-grid">
            <div className="meta-card">
              <span>Monthly completion</span>
              <strong>{levels.monthly || 0}%</strong>
            </div>
            <div className="meta-card">
              <span>Weekly completion</span>
              <strong>{levels.weekly || 0}%</strong>
            </div>
            <div className="meta-card">
              <span>Daily completion</span>
              <strong>{levels.daily || 0}%</strong>
            </div>
          </div>
          <p>
            Break the task into a main goal, monthly milestones, weekly phases,
            and daily actions.
          </p>
        </article>
      </section>

      <section className="status-board">
        <PhaseColumn
          title="Monthly plan"
          items={task.phases.monthly}
          onAdd={(title) => addTaskPhase(task.id, "monthly", title)}
          onToggle={(phaseId) => () => toggleTaskPhase(task.id, "monthly", phaseId)}
        />
        <PhaseColumn
          title="Weekly plan"
          items={task.phases.weekly}
          onAdd={(title) => addTaskPhase(task.id, "weekly", title)}
          onToggle={(phaseId) => () => toggleTaskPhase(task.id, "weekly", phaseId)}
        />
        <PhaseColumn
          title="Daily plan"
          items={task.phases.daily}
          onAdd={(title) => addTaskPhase(task.id, "daily", title)}
          onToggle={(phaseId) => () => toggleTaskPhase(task.id, "daily", phaseId)}
        />
      </section>
    </div>
  );
}
