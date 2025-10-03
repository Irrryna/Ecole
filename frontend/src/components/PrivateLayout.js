import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateLayout(){
  const { user, logout } = useAuth();
  const linksCommon = [
    {to:"/portal/announcements", label:"Annonces"},
    {to:"/portal/planning", label:"Planning"},
  ];
  const linksParent = [{to:"/portal/homework", label:"Devoirs"}];
  const linksTeacher = [
    {to:"/portal/homework/manage", label:"Gérer devoirs"},
    {to:"/portal/students", label:"Élèves"},
    {to:"/portal/posts", label:"Articles"}
  ];
  const linksAdmin = [{to:"/portal/admin", label:"Administration"}];
  const role = user?.role;

  const nav = [
    ...linksCommon,
    ...(role==="PARENT" ? linksParent: []),
    ...(role==="TEACHER" ? linksTeacher: []),
    ...(role==="ADMIN" ? [...linksTeacher, ...linksAdmin] : [])
  ];

  return (
    <div className="container section" style={{display:"grid", gridTemplateColumns:"260px 1fr", gap:24}}>
      <aside className="card" style={{position:"sticky", top:90, alignSelf:"start"}}>
        <h3 style={{marginTop:0}}>Portail — {role}</h3>
        <nav style={{display:"grid", gap:8}}>
          {nav.map(l=> <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
          <Link to="/" style={{marginTop:8}}>← Retour au site</Link>
          <button className="btn btn--outline" onClick={logout} style={{marginTop:8}}>Déconnexion</button>
        </nav>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
