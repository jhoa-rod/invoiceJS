import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const menu = (t) => [
  { to: "/", label: t.nav.dashboard },
  { to: "/tasks/new", label: t.nav.newTask },
  { to: "/goals", label: t.nav.goals },
  { to: "/tasks/weekly", label: t.nav.weekly },
  { to: "/tasks/daily", label: t.nav.daily },
  { to: "/tasks/status", label: t.nav.status },
  { to: "/progress", label: t.nav.progress },
  { to: "/summaries/weekly", label: t.nav.weeklySummary },
  { to: "/summaries/monthly", label: t.nav.monthlySummary },
  { to: "/summaries/yearly", label: t.nav.yearlySummary },
  { to: "/notes", label: t.nav.notes },
  { to: "/settings", label: t.nav.settings },
];

export function AppLayout({ children }) {
  const { currentUser, logout, t } = useAppContext();

  return (
    <div className="workspace">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <p className="eyebrow">{t.appName}</p>
          <h1>{t.appTagline}</h1>
        </div>

        <nav className="sidebar-nav">
          {menu(t).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "is-active" : ""}`
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <strong>{currentUser?.name}</strong>
          <span>{currentUser?.email}</span>
          <button className="ghost-button" type="button" onClick={logout}>
            {t.common.logout}
          </button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t.appName}</p>
            <h2>{t.appTagline}</h2>
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
