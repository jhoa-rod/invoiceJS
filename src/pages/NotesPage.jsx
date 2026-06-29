import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { SectionHeader } from "../components/common/SectionHeader";
import { NoteCard } from "../components/common/NoteCard";

export function NotesPage() {
  const { state, addNote } = useAppContext();
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "personal",
    relatedGoalId: "",
    relatedTaskId: "",
  });

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    addNote(form);
    setForm({
      title: "",
      content: "",
      type: "personal",
      relatedGoalId: "",
      relatedTaskId: "",
    });
  }

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Notes"
        title="Notes, complications, and reminders"
        description="Keep observations in their own module instead of hiding them inside forms."
      />

      <section className="page-two-column">
        <form className="panel stack-list" onSubmit={handleSubmit}>
          <h3>New note</h3>
          <label className="field">
            <span>Title</span>
            <input value={form.title} onChange={(event) => updateField("title", event.target.value)} />
          </label>
          <label className="field">
            <span>Content</span>
            <textarea
              value={form.content}
              onChange={(event) => updateField("content", event.target.value)}
            />
          </label>
          <label className="field">
            <span>Type</span>
            <select value={form.type} onChange={(event) => updateField("type", event.target.value)}>
              <option value="personal">Personal</option>
              <option value="complication">Complication</option>
              <option value="reminder">Reminder</option>
            </select>
          </label>
          <label className="field">
            <span>Related goal</span>
            <select
              value={form.relatedGoalId}
              onChange={(event) => updateField("relatedGoalId", event.target.value)}
            >
              <option value="">None</option>
              {state.goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Related task</span>
            <select
              value={form.relatedTaskId}
              onChange={(event) => updateField("relatedTaskId", event.target.value)}
            >
              <option value="">None</option>
              {state.tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </label>
          <button className="action-button" type="submit">
            Save note
          </button>
        </form>

        <div className="stack-list">
          {state.notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              goalName={state.goals.find((goal) => goal.id === note.relatedGoalId)?.title}
              taskName={state.tasks.find((task) => task.id === note.relatedTaskId)?.name}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
