import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function AuthLayout({ children }) {
  const { t } = useAppContext();

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <p className="eyebrow">{t.appName}</p>
        <h1>{t.appTagline}</h1>
        <p className="auth-copy">
          Weekly planning, detailed task execution, notes, and summaries in one
          modular workspace.
        </p>
        {children}
        <div className="auth-links">
          <Link to="/login">{t.auth.switchToLogin}</Link>
          <Link to="/register">{t.auth.switchToRegister}</Link>
        </div>
      </div>
    </div>
  );
}
