export function NoteCard({ note, taskName, goalName }) {
  return (
    <article className="note-card">
      <div className="task-card-head">
        <div>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
        <span className={`tag note-${note.type}`}>{note.type}</span>
      </div>
      <div className="meta-row">
        {goalName ? <span className="tag">{goalName}</span> : null}
        {taskName ? <span className="tag">{taskName}</span> : null}
      </div>
    </article>
  );
}
