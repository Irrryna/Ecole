import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Navbar.css";

const links = [
  { label: "Home", anchor: "hero" },
  { label: "À propos", anchor: "apropos" },
  { label: "Actualités", anchor: "actus" },
  { label: "Professeurs", anchor: "profs" },
  { label: "Blog", anchor: "blog" },
  { label: "Contacts", anchor: "contact" },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);

  const href = (anchor) => (onHome ? `#${anchor}` : `/#${anchor}`);

  return (
    <header className={`site-header`}>
      <nav className="navbar container">
        <Link
          to="/"
          className="brand"
          aria-label="Accueil — École Ukrainienne à Lyon"
        >
          <img src="/brand-192.png?v=3" class="brand_logo" alt="Logo École" />

          <div className="brand__text">
            <span className="brand__title">École Ukrainienne</span>
            <span className="brand__subtitle">à Lyon</span>
          </div>
        </Link>

        <button
          className="nav-toggle"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="burger" />
        </button>

        <ul className="nav__links">
          <li>
            <a href="/#apropos">{t("nav.about")}</a>
          </li>
          <li>
            <a href="/#actus">{t("nav.news")}</a>
          </li>
          <li>
            <a href="/#profs">{t("nav.teachers")}</a>
          </li>
          <li>
            <a href="/#blog">{t("nav.blog")}</a>
          </li>
          <li>
            <Link to="/planning">{t("nav.planning")}</Link>
          </li>
          <li>
            <Link to="/login" className="btn btn--ghost">
              {t("nav.login")}
            </Link>
          </li>
          <li>
            <Link to="/register" className="btn">
              {t("nav.signup")}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
