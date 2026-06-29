import { useLanguage } from "../hooks/useLanguage";

export type AppSection =
  | "dashboard"
  | "clientTasks"
  | "handledChats"
  | "internalTasks"
  | "import";

interface AppNavigationProps {
  activeSection: AppSection;
  onChange: (section: AppSection) => void;
}

const sectionLabels: AppSection[] = [
  "dashboard",
  "clientTasks",
  "handledChats",
  "internalTasks",
  "import",
];

export function AppNavigation({ activeSection, onChange }: AppNavigationProps) {
  const { t } = useLanguage();

  return (
    <nav className="mb-6 overflow-x-auto rounded-[28px] border border-white/70 bg-white/90 p-3 shadow-soft">
      <div className="flex min-w-max gap-2">
        {sectionLabels.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => onChange(section)}
            className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
              activeSection === section ? "bg-ink text-white" : "bg-slate-50 text-ink hover:-translate-y-0.5"
            }`}
          >
            {t(section)}
          </button>
        ))}
      </div>
    </nav>
  );
}
