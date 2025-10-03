import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstname:"", lastname:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API = process.env.REACT_APP_API_URL || "/api";

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const payload = {
        firstName: form.firstname,
        lastName:  form.lastname,
        email:     form.email,
        password:  form.password
      };
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Si l’API renvoie { token, user, role } => login direct, 
      // sinon aller au login
      if (data?.token) { login(data); navigate("/portal", { replace:true }); }
      else { navigate("/login", { replace:true }); }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section narrow">
      <div className="card form">
        <h1>{t("auth.register.title")}</h1>
        {error && <p className="muted" style={{color:"#b42318"}}>{error}</p>}
        <form onSubmit={onSubmit}>
          <label>{t("auth.register.firstname")}
            <input name="firstname" value={form.firstname} onChange={onChange} required />
          </label>
          <label>{t("auth.register.lastname")}
            <input name="lastname" value={form.lastname} onChange={onChange} required />
          </label>
          <label>{t("auth.register.email")}
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label>{t("auth.register.password")}
            <input name="password" type="password" value={form.password} onChange={onChange} required />
          </label>
          <label>{t("auth.register.confirm")}
            <input name="confirm" type="password" value={form.confirm} onChange={onChange} required />
          </label>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "…" : t("auth.register.btn")}
          </button>

          <p className="muted" style={{marginTop:8}}>
            <Trans i18nKey="auth.register.haveAccount" components={{ a: <a href="/login" /> }}>
              Déjà un compte ? <a href="/login">Se connecter</a>
            </Trans>
          </p>
        </form>
      </div>
    </div>
  );
}
