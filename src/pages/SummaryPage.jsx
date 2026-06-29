import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { SectionHeader } from "../components/common/SectionHeader";
import { StatCard } from "../components/common/StatCard";
import { GoalCard } from "../components/common/GoalCard";
import { buildRecommendations, computeTaskStats, getGoalSummaries, getTasksForPeriod } from "../utils/planner";

export function SummaryPage() {
  const { period = "weekly" } = useParams();
  const { state } = useAppContext();

  const tasks = getTasksForPeriod(state.tasks, period);
  const stats = computeTaskStats(tasks);
  const goalSummaries = getGoalSummaries(state.goals, tasks);
  const recommendations = buildRecommendations(tasks, state.goals);
  const leadingGoals = goalSummaries.filter((goal) => goal.progress >= 70);
  const laggingGoals = goalSummaries.filter((goal) => goal.progress < 50);

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow={`${period} summary`}
        title={`${period.charAt(0).toUpperCase() + period.slice(1)} review`}
        description="Keep summaries separated from the dashboard with their own decision-focused view."
      />

      <section className="stats-grid">
        <StatCard label="Total tasks" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} tone="positive" />
        <StatCard label="Pending" value={stats.pending} tone="warning" />
        <StatCard label="In progress" value={stats.inProgress} />
      </section>

      <section className="stats-grid">
        <StatCard label="Completion rate" value={`${stats.progress}%`} helper="Average task progress" />
        <StatCard label="Estimated time" value={stats.estimatedMinutes} helper="minutes planned" />
        <StatCard label="Actual time" value={stats.actualMinutes} helper="minutes invested" />
        <StatCard label="Recommendations" value={recommendations.length} helper="generated insights" />
      </section>

      <section className="page-two-column">
        <article className="panel">
          <div className="panel-title-row">
            <h3>Goals advancing well</h3>
            <span className="tag">{leadingGoals.length}</span>
          </div>
          <div className="stack-list">
            {leadingGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-title-row">
            <h3>Goals behind plan</h3>
            <span className="tag">{laggingGoals.length}</span>
          </div>
          <div className="stack-list">
            {laggingGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-title-row">
          <h3>Recommendations</h3>
        </div>
        <div className="stack-list">
          {recommendations.map((item) => (
            <article key={item.id} className={`insight-card is-${item.tone}`}>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
