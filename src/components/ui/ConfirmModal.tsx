interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-5 py-6 backdrop-blur-[2px] animate-[modalFade_200ms_ease-out]">
      <section className="w-full max-w-[420px] rounded-[18px] border border-line bg-card p-7 shadow-lg animate-[modalIn_200ms_ease-out]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label={cancelLabel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-card text-xl font-semibold text-muted transition hover:-translate-y-px hover:border-brand hover:text-ink hover:shadow-md"
          >
            ×
          </button>
        </div>

        <div className="mt-7 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-10 rounded-[10px] border border-line bg-card px-4 py-2 text-sm font-bold text-ink transition hover:-translate-y-px hover:border-brand hover:shadow-md"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              variant === "danger"
                ? "min-h-10 rounded-[10px] bg-danger px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md"
                : "min-h-10 rounded-[10px] bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
            }
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
