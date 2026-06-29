import { useAppContext } from "../context/AppContext";
import { SectionHeader } from "../components/common/SectionHeader";
import { ProgressBar } from "../components/common/ProgressBar";
import { formatMinutes, getWeeklyTone } from "../utils/planner";

export function ProgressPage() {
  const { goalSummaries, weeklyStats, overdue } = useAppContext();

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Progress"
        title="Weekly goal progress and visual alerts"
        description="Track planned work versus completed work and estimated versus actual time."
      />

      <section className="page-two-column">
        <article className="panel">
          <div className="panel-title-row">
            <h3>Weekly progress snapshot</h3>
            <span className={`tag tone-${getWeeklyTone(weeklyStats.progress)}`}>
              {weeklyStats.progress}%
            </span>
          </div>
          <div className="stack-list">
            <div className="meta-card">
              <span>Tasks planned vs completed</span>
              <strong>
                {weeklyStats.total} / {weeklyStats.completed}
              </strong>
            </div>
            <div className="meta-card">
              <span>Estimated vs actual time</span>
              <strong>
                {formatMinutes(weeklyStats.estimatedMinutes)} /{" "}
                {formatMinutes(weeklyStats.actualMinutes)}
              </strong>
            </div>
            <ProgressBar
              value={weeklyStats.progress}
              tone={getWeeklyTone(weeklyStats.progress)}
            />
          </div>
        </article>

        <article className="panel">
          <div className="panel-title-row">
            <h3>Visual alerts</h3>
            <span className="tag">{overdue.length}</span>
          </div>
          <div className="stack-list">
            {overdue.map((task) => (
              <article key={task.id} className="insight-card is-danger">
                <strong>{task.name}</strong>
                <p>{task.description}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="stack-list">
        {goalSummaries.map((goal) => (
          <article key={goal.id} className="panel">
            <div className="panel-title-row">
              <h3>{goal.title}</h3>
              <span className={`tag ${goal.progress >= 70 ? "tone-positive" : "tone-warning"}`}>
                {goal.progress}%
              </span>
            </div>
            <p>{goal.description}</p>
            <div className="meta-grid">
              <div className="meta-card">
                <span>Tasks planned</span>
                <strong>{goal.taskCount}</strong>
              </div>
              <div className="meta-card">
                <span>Tasks completed</span>
                <strong>{goal.completedCount}</strong>
              </div>
              <div className="meta-card">
                <span>Estimated time</span>
                <strong>{formatMinutes(goal.estimatedMinutes)}</strong>
              </div>
              <div className="meta-card">
                <span>Actual time</span>
                <strong>{formatMinutes(goal.actualMinutes)}</strong>
              </div>
            </div>
            <ProgressBar
              value={goal.progress}
              tone={goal.progress >= 70 ? "positive" : "warning"}
            />
          </article>
        ))}
      </section>
    </div>
  );
}
