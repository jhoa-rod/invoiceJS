import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { GoalCard } from "../components/common/GoalCard";
import { SectionHeader } from "../components/common/SectionHeader";

export function GoalsPage() {
  const { goalSummaries, addGoal } = useAppContext();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    horizon: "short_term",
    importance: "high",
  });

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    addGoal(form);
    setForm({
      title: "",
      description: "",
      category: "",
      horizon: "short_term",
      importance: "high",
    });
  }

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Goals"
        title="Keep goals separate from daily execution"
        description="See progress per goal and create new medium or short-term objectives."
      />

      <section className="page-two-column">
        <div className="stack-list">
          {goalSummaries.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>

        <form className="panel stack-list" onSubmit={handleSubmit}>
          <h3>Create goal</h3>
          <label className="field">
            <span>Title</span>
            <input value={form.title} onChange={(event) => updateField("title", event.target.value)} />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Category</span>
            <input
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Horizon</span>
            <select
              value={form.horizon}
              onChange={(event) => updateField("horizon", event.target.value)}
            >
              <option value="short_term">Short term</option>
              <option value="medium_term">Medium term</option>
            </select>
          </label>
          <label className="field">
            <span>Importance</span>
            <select
              value={form.importance}
              onChange={(event) => updateField("importance", event.target.value)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <button className="action-button" type="submit">
            Save goal
          </button>
        </form>
      </section>
    </div>
  );
}
