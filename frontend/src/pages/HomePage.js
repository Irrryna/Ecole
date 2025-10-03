import { useTranslation } from "react-i18next";
import HeroCarousel from "../components/HeroCarousel";

export default function HomePage(){
  const { t } = useTranslation();

  return (
    <>
      <HeroCarousel />

      {/* À PROPOS */}
      <section className="section" id="apropos">
        <div className="container grid-2">
          <div>
            <h2>{t("about.title")}</h2>
            <p>{t("about.p1")}</p>
            <ul>
              <li>{t("about.li1")}</li>
              <li>{t("about.li2")}</li>
              <li>{t("about.li3")}</li>
            </ul>
          </div>
          <div className="card highlight">
            <h3>{t("about.info")}</h3>
            <dl className="facts" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px 16px',marginTop:'10px'}}>
              <div><dt>{t("about.facts.foundation")}</dt><dd>{t("about.factsValues.foundation")}</dd></div>
              <div><dt>{t("about.facts.location")}</dt><dd>{t("about.factsValues.location")}</dd></div>
              <div><dt>{t("about.facts.audience")}</dt><dd>{t("about.factsValues.audience")}</dd></div>
              <div><dt>{t("about.facts.languages")}</dt><dd>{t("about.factsValues.languages")}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* ACTUALITÉS */}
      <section className="section section--tint" id="actus">
        <div className="container">
          <h2>{t("news.title")}</h2>
          <div className="cards cards--3">
            <article className="card">
              <span className="badge">Nouveau</span>
              <h3>{t("news.card1.title")}</h3>
              <p>{t("news.card1.text")}</p>
              <a className="btn btn--ghost" href="/articles">{t("news.card1.action")}</a>
            </article>
            <article className="card">
              <h3>{t("news.card2.title")}</h3>
              <p>{t("news.card2.text")}</p>
              <a className="btn btn--ghost" href="/news">{t("news.card2.action")}</a>
            </article>
            <article className="card">
              <h3>{t("news.card3.title")}</h3>
              <p>{t("news.card3.text")}</p>
              <a className="btn btn--ghost" href="/news">{t("news.card3.action")}</a>
            </article>
          </div>
        </div>
      </section>

      {/* PROFESSEURS */}
      <section className="section" id="profs">
        <div className="container">
          <h2>{t("teachers.title")}</h2>
          <div className="cards cards--4">
            <article className="card card--profile">
              <img src="https://placehold.co/320x320" alt="Portrait 1" />
              <h3>Olena K.</h3><p>Langue & littérature</p>
            </article>
            <article className="card card--profile">
              <img src="https://placehold.co/320x320" alt="Portrait 2" />
              <h3>Mykola P.</h3><p>Histoire & culture</p>
            </article>
            <article className="card card--profile">
              <img src="https://placehold.co/320x320" alt="Portrait 3" />
              <h3>Halyna S.</h3><p>Arts & musique</p>
            </article>
            <article className="card card--profile">
              <img src="https://placehold.co/320x320" alt="Portrait 4" />
              <h3>Irina D.</h3><p>Cycle primaire</p>
            </article>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="section section--tint" id="blog">
        <div className="container">
          <h2>{t("blog.title")}</h2>
          <div className="cards cards--3">
            <article className="card">
              <h3>{t("blog.card1.title")}</h3>
              <p>{t("blog.card1.text")}</p>
              <a className="btn btn--ghost" href="/articles">{t("blog.card1.action")}</a>
            </article>
            <article className="card">
              <h3>{t("blog.card2.title")}</h3>
              <p>{t("blog.card2.text")}</p>
              <a className="btn btn--ghost" href="/articles">{t("blog.card2.action")}</a>
            </article>
            <article className="card">
              <h3>{t("blog.card3.title")}</h3>
              <p>{t("blog.card3.text")}</p>
              <a className="btn btn--ghost" href="/articles">{t("blog.card3.action")}</a>
            </article>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="container grid-2">
          <div>
            <h2>{t("contact.title")}</h2>
            <p>{t("contact.school")}</p>
            <p><strong>{t("contact.email")} :</strong> contact@ecole-ukrainienne-lyon.fr</p>
            <p><strong>{t("contact.address")} :</strong> (à préciser) — Lyon</p>
            <p><strong>{t("contact.hours")} :</strong> {t("contact.hoursValue")}</p>
          </div>
          <form className="card form" onSubmit={(e)=>e.preventDefault()}>
            <label>{t("contact.form.name")}<input type="text" required /></label>
            <label>Email<input type="email" required /></label>
            <label>{t("contact.form.message")}<textarea rows="4" required /></label>
            <button className="btn" type="submit">{t("contact.form.send")}</button>
          </form>
        </div>
      </section>
    </>
  );
}
