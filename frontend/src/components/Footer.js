import { useTranslation } from "react-i18next";

export default function Footer(){
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/logo.png" alt="" aria-hidden="true" />
          <div>
            <strong>{t("brand.title")} Saint-Nicolas</strong><br/>Lyon — Est. 2015
          </div>
        </div>
        <nav className="footer__nav">
          <a href="/#apropos">{t("nav.about")}</a>
          <a href="/#actus">{t("nav.news")}</a>
          <a href="/#profs">{t("nav.teachers")}</a>
          <a href="/#blog">{t("nav.blog")}</a>
          <a href="/#contact">{t("nav.contacts")}</a>
          <a href="/planning">{t("nav.planning")}</a>
        </nav>
        <div className="footer__legal">
          © {new Date().getFullYear()} • {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
