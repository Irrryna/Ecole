import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google"; // npm i @react-oauth/google

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API = process.env.REACT_APP_API_URL || "/api";

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      login(data);
      navigate("/portal", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async (cred) => {
    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: cred.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");
      login(data);
      navigate("/portal", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container section narrow">
      <div className="card form">
        <div className="card__top">
          <h1>{t("auth.login.title")}</h1>
          <Link to="/" className="muted">
            ← {t("common.backHome") || "Retour à l’accueil"}
          </Link>
        </div>

        {error && (
          <p className="muted" style={{ color: "#b42318" }}>
            {error}
          </p>
        )}

        <form onSubmit={onSubmit}>
          <label>
            {t("auth.login.email")}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </label>
          <label>
            {t("auth.login.password")}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
            />
          </label>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "…" : t("auth.login.btn")}
          </button>

          <div style={{ marginTop: 12 }}>
            <GoogleLogin
              onSuccess={onGoogle}
              onError={() => setError("Google login error")}
            />
          </div>

          <p className="muted" style={{ marginTop: 8 }}>
            <Trans
              i18nKey="auth.login.noAccount"
              components={{ a: <Link to="/register" /> }}
            >
              Pas encore de compte ? <a>Créer un compte</a>
            </Trans>
          </p>
        </form>
      </div>
    </div>
  );
}
