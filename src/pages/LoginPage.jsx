import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, t } = useAppContext();
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const result = login({ email, password });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/");
  }

  return (
    <form className="panel auth-form" onSubmit={handleSubmit}>
      <h2>{t.auth.welcome}</h2>
      <label className="field">
        <span>{t.auth.email}</span>
        <input value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="field">
        <span>{t.auth.password}</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="action-button" type="submit">
        {t.auth.signIn}
      </button>
      <p className="muted-text">{t.auth.demoHint}</p>
    </form>
  );
}
