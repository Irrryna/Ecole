import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const API = process.env.REACT_APP_API_URL || "/api";

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOkMsg("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        firstName: form.firstname,
        lastName: form.lastname,
        email: form.email,
        password: form.password,
      };
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setOkMsg(
        t("auth.register.checkEmail") ||
          "Un e-mail de confirmation vous a été envoyé."
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section narrow">
      <div className="card form">
        <div className="card__top">
          <h1>{t("auth.register.title")}</h1>
          <Link to="/" className="muted">
            ← {t("common.backHome") || "Retour à l’accueil"}
          </Link>
        </div>

        {error && (
          <p className="muted" style={{ color: "#b42318" }}>
            {error}
          </p>
        )}
        {okMsg && (
          <p className="muted" style={{ color: "#046b1a" }}>
            {okMsg}
          </p>
        )}

        <form onSubmit={onSubmit}>
          <label>
            {t("auth.register.firstname")}
            <input
              name="firstname"
              value={form.firstname}
              onChange={onChange}
              required
            />
          </label>
          <label>
            {t("auth.register.lastname")}
            <input
              name="lastname"
              value={form.lastname}
              onChange={onChange}
              required
            />
          </label>
          <label>
            {t("auth.register.email")}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </label>
          <label>
            {t("auth.register.password")}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
            />
          </label>
          <label>
            {t("auth.register.confirm")}
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={onChange}
              required
            />
          </label>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "…" : t("auth.register.btn")}
          </button>

          <p className="muted" style={{ marginTop: 8 }}>
            <Trans
              i18nKey="auth.register.haveAccount"
              components={{ a: <Link to="/login" /> }}
            >
              Déjà un compte ? <a>Se connecter</a>
            </Trans>
          </p>
        </form>
      </div>
    </div>
  );
}
