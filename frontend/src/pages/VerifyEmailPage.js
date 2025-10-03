// src/pages/VerifyEmailPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

export default function VerifyEmailPage() {
  const [ok, setOk] = useState(false);
  const [msg, setMsg] = useState("...");
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const token = sp.get("token");
  const API = process.env.REACT_APP_API_URL || "/api";

  useEffect(() => {
    if (!token) {
      setMsg("Token manquant");
      return;
    }
    fetch(`${API}/auth/verify-email?token=${encodeURIComponent(token)}`, {
      credentials: "include",
    })
      .then((r) => {
        if (r.redirected) {
          navigate("/login?verified=1", { replace: true });
          return;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.message) setMsg(data.message);
        if (data?.ok || data?.isEmailVerified) setOk(true);
      })
      .catch(() => setMsg("Erreur"));
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="container section narrow">
      <div className="card">
        <h1>Vérification de l’e-mail</h1>
        <p className="muted">{msg}</p>
        <p>
          <Link to="/login">Aller à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
