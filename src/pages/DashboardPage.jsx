import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getWeeklyTone } from "../utils/planner";
import { SectionHeader } from "../components/common/SectionHeader";
import { StatCard } from "../components/common/StatCard";
import { ProgressBar } from "../components/common/ProgressBar";
import { TaskCard } from "../components/common/TaskCard";
import { EmptyState } from "../components/common/EmptyState";

export function DashboardPage() {
  const {
    state,
    weeklyStats,
    allStats,
    goalSummaries,
    alerts,
    recommendations,
    dailyTasks,
  } = useAppContext();

  const weeklyTone = getWeeklyTone(weeklyStats.progress);

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Dashboard"
        title="Weekly command center"
        description="A cleaner overview of your goals, task flow, and current momentum."
        action={
          <Link className="action-button inline-action" to="/tasks/new">
            Create task
          </Link>
        }
      />

      <section className="stats-grid">
        <StatCard label="Pending tasks" value={allStats.pending} helper="Open work" />
        <StatCard label="Completed" value={allStats.completed} helper="Closed tasks" tone="positive" />
        <StatCard label="In progress" value={allStats.inProgress} helper="Active now" tone="warning" />
        <StatCard
          label="Active goals"
          value={goalSummaries.length}
          helper="Tracked goals"
        />
      </section>

      <section className="panel-grid">
        <article className={`panel hero-panel tone-${weeklyTone}`}>
          <p className="eyebrow">Weekly progress</p>
          <h3>{weeklyStats.progress}% complete</h3>
          <p>
            {weeklyStats.completed} completed, {weeklyStats.pending} pending,{" "}
            {weeklyStats.inProgress} in progress this week.
          </p>
          <ProgressBar value={weeklyStats.progress} tone={weeklyTone} />
        </article>

        <article className="panel quick-links">
          <p className="eyebrow">Quick access</p>
          <div className="link-grid">
            <Link className="quick-link" to="/tasks/daily">
              Daily plan
            </Link>
            <Link className="quick-link" to="/tasks/weekly">
              Weekly plan
            </Link>
            <Link className="quick-link" to="/progress">
              Progress
            </Link>
            <Link className="quick-link" to="/notes">
              Notes
            </Link>
          </div>
        </article>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <SectionHeader
            eyebrow="Important work"
            title="Priority alerts"
            description="Key tasks that deserve attention now."
          />
          <div className="stack-list">
            {alerts.length ? (
              alerts.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  goal={state.goals.find((goal) => goal.id === task.goalId)}
                  compact
                />
              ))
            ) : (
              <EmptyState
                title="No urgent alerts"
                description="Your highest-priority work is under control."
              />
            )}
          </div>
        </article>

        <article className="panel">
          <SectionHeader
            eyebrow="Recommendations"
            title="What to do next"
            description="Simple guidance based on status, priority, and goal momentum."
          />
          <div className="stack-list">
            {recommendations.map((item) => (
              <article key={item.id} className={`insight-card is-${item.tone}`}>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <SectionHeader
            eyebrow="Today's tasks"
            title="Current daily focus"
            description="What is currently scheduled for today."
          />
          <div className="stack-list">
            {dailyTasks.length ? (
              dailyTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  goal={state.goals.find((goal) => goal.id === task.goalId)}
                  compact
                />
              ))
            ) : (
              <EmptyState title="Nothing planned today" description="Assign time from the daily planner." />
            )}
          </div>
        </article>

        <article className="panel">
          <SectionHeader
            eyebrow="Goal momentum"
            title="Active goals"
            description="Track the goals advancing well and the ones falling behind."
          />
          <div className="goal-mini-grid">
            {goalSummaries.map((goal) => (
              <article key={goal.id} className="mini-goal-card">
                <strong>{goal.title}</strong>
                <span>{goal.progress}% progress</span>
                <ProgressBar
                  value={goal.progress}
                  tone={goal.progress >= 70 ? "positive" : "warning"}
                />
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
