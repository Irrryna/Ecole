import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);
export const useAuth = ()=> useContext(AuthCtx);

export default function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(()=>{
    if(!token) return;
    fetch(`${process.env.REACT_APP_API_URL || ""}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r=> r.ok ? r.json() : null).then(data=>{
      if(data) setUser(data);
    }).catch(()=>{});
  },[token]);

  const login = (payload)=>{ // {token, role, user}
    localStorage.setItem("token", payload.token);
    setToken(payload.token);
    setUser({ ...payload.user, role: payload.role });
  };
  const logout = ()=>{
    localStorage.removeItem("token");
    setToken(null); setUser(null);
    window.location.href="/";
  };

  return <AuthCtx.Provider value={{ user, token, login, logout }}>{children}</AuthCtx.Provider>;
}
