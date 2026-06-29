import { useAppContext } from "../context/AppContext";
import { SectionHeader } from "../components/common/SectionHeader";

export function SettingsPage() {
  const { state, currentUser, setLanguage, updateSettings } = useAppContext();

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Settings"
        title="Configuration and language"
        description="Keep language and future account options in a proper settings area."
      />

      <section className="page-two-column">
        <article className="panel stack-list">
          <h3>Account</h3>
          <div className="meta-card">
            <span>Name</span>
            <strong>{currentUser?.name}</strong>
          </div>
          <div className="meta-card">
            <span>Email</span>
            <strong>{currentUser?.email}</strong>
          </div>
          <p className="muted-text">
            This is a mock authentication layer prepared to connect to a real backend later.
          </p>
        </article>

        <article className="panel stack-list">
          <h3>Preferences</h3>
          <label className="field">
            <span>Language</span>
            <select
              value={state.language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </label>
          <label className="field">
            <span>Default summary</span>
            <select
              value={state.settings.preferredSummary}
              onChange={(event) =>
                updateSettings({ preferredSummary: event.target.value })
              }
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>
        </article>
      </section>
    </div>
  );
}
