import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";        
import { useNavigate } from "react-router-dom";          

export default function Login(){
  const { t } = useTranslation();
  const { login } = useAuth();                          
  const navigate = useNavigate();                       
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const API = process.env.REACT_APP_API_URL || "/api";   //  REACT_APP_API_URL=/api

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();                     // lire  1 fois
      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data);                                       // stocke token + user + role
      navigate("/portal", { replace: true });            // va au portail
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section narrow">
      <div className="card form">
        <h1>{t("auth.login.title")}</h1>
        {error && <p className="muted" style={{color:"#b42318"}}>{error}</p>}
        <form onSubmit={onSubmit}>
          <label>{t("auth.login.email")}
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label>{t("auth.login.password")}
            <div className="password-input-container">
              <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={onChange} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn">
                {showPassword ? "👁️" : "👁️"}
              </button>
            </div>
          </label>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "…" : t("auth.login.btn")}
          </button>
          <p className="muted" style={{marginTop:8}}>
            <Trans i18nKey="auth.login.noAccount" components={{ a: <a href="/register" /> }}>
              Pas encore de compte ? <a href="/register">Créer un compte</a>
            </Trans>
          </p>
        </form>
      </div>
    </div>
  );
}
