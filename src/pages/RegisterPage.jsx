import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, t } = useAppContext();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = register(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/");
  }

  return (
    <form className="panel auth-form" onSubmit={handleSubmit}>
      <h2>{t.auth.register}</h2>
      <label className="field">
        <span>{t.auth.name}</span>
        <input value={form.name} onChange={(event) => updateField("name", event.target.value)} />
      </label>
      <label className="field">
        <span>{t.auth.email}</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </label>
      <label className="field">
        <span>{t.auth.password}</span>
        <input
          type="password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="action-button" type="submit">
        {t.auth.signUp}
      </button>
    </form>
  );
}
