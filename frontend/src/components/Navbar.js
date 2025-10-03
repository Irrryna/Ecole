import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const links = [
  { label: "Home", anchor: "hero" },
  { label: "À propos", anchor: "apropos" },
  { label: "Actualités", anchor: "actus" },
  { label: "Professeurs", anchor: "profs" },
  { label: "Blog", anchor: "blog" },
  { label: "Contacts", anchor: "contact" },
];

export default function Navbar(){
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);

  const href = (anchor) => onHome ? `#${anchor}` : `/#${anchor}`;

  return (
    <header className={`site-header`}>
      <nav className="navbar container">
        <Link to="/" className="brand" aria-label="Accueil — École Ukrainienne à Lyon">
          <img src="/logo.png" alt="" className="brand__logo" />
          <div className="brand__text">
            <span className="brand__title">École Ukrainienne</span>
            <span className="brand__subtitle">à Lyon</span>
          </div>
        </Link>

        <button className="nav-toggle" aria-expanded={open} onClick={()=>setOpen(!open)}>
          <span className="burger" />
        </button>

        <ul className={`nav ${open ? "is-open":""}`}>
          {links.map(l=>(
            <li key={l.anchor}><a href={href(l.anchor)} onClick={()=>setOpen(false)}>{l.label}</a></li>
          ))}
          <li><Link to="/planning" onClick={()=>setOpen(false)}>Planning parental</Link></li>
          <li><Link className="btn btn--outline" to="/login" onClick={()=>setOpen(false)}>Connexion / Inscription</Link></li>
        </ul>
      </nav>
    </header>
  );
}
