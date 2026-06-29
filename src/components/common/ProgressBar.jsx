export function ProgressBar({ value = 0, tone = "positive" }) {
  return (
    <div className="progress-track">
      <div
        className={`progress-fill is-${tone}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
