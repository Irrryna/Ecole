// src/components/Auth.js (admin — українською)
import { useState } from "react";

export default function AuthAdmin(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const API = process.env.REACT_APP_API_URL || "";

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try{
      const res = await fetch(`${API}/auth/login`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ email, password })
      });
      if(!res.ok) throw new Error("Помилка входу");
      // const data = await res.json();
      window.location.href = "/dashboard";
    }catch(e){ setErr(e.message); }
  };

  return (
    <div className="container section narrow">
      <div className="card form">
        <h1>Адміністративна панель — Вхід</h1>
        {err && <p className="muted" style={{color:"#b42318"}}>{err}</p>}
        <form onSubmit={submit}>
          <label>Ел. пошта
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
          </label>
          <label>Пароль
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
          </label>
          <button className="btn" type="submit">Увійти</button>
        </form>
      </div>
    </div>
  );
}
