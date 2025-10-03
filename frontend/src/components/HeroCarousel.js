import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import OptimizedImg from "./OptimizedImg";       
import "./HeroCarousel.css";

export default function HeroCarousel(){
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  const slides = [
    { base: "slide1", alt: "Élèves en classe" },
    { base: "slide2", alt: "Activité culturelle du samedi" },
    { base: "slide3", alt: "Événement communautaire" }
  ];

  const next = () => setIndex(i => (i + 1) % slides.length);
  const prev = () => setIndex(i => (i - 1 + slides.length) % slides.length);
  const go   = (i) => setIndex(i);

  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(next, 6000);
    return () => clearInterval(timer.current);
  }, [index]);

  return (
    <div className="hero" id="hero" aria-label="Bienvenue">
      {/* ornements (optionnels) */}
      <img className="ornament ornament--top-right" src="/corner-top-right.png" alt="" aria-hidden="true" />
      <img className="ornament ornament--bottom-left" src="/corner-bottom-left.png" alt="" aria-hidden="true" />

      <div className="carousel">
        <div className="carousel__track" style={{ transform:`translateX(-${index*100}%)` }}>
          {slides.map((s, i) => (
            <div key={s.base} className="carousel__slide">
              <OptimizedImg
                baseName={s.base}
                alt={s.alt}
                sizes="100vw"
                width={1920} height={1080}    // adapte si ton ratio réel est différent
                priority={i === 0}            // seule la 1ère est LCP
              />
            </div>
          ))}
        </div>

        <button className="carousel__control prev" onClick={prev} aria-label="Image précédente">‹</button>
        <button className="carousel__control next" onClick={next} aria-label="Image suivante">›</button>

        <div className="carousel__dots" aria-label="Sélecteur d’images">
          {slides.map((_, i) => (
            <button key={i} aria-current={i === index} onClick={() => go(i)} />
          ))}
        </div>
      </div>

      <div className="hero__content container">
        <h1>{t("hero.title")}</h1>
        <h3>{t("hero.subtitle")}</h3>
        <div className="hero__cta">
          <a href="#apropos" className="btn">{t("hero.cta_discover")}</a>
          <a href="/planning" className="btn btn--ghost">{t("hero.cta_planning")}</a>
        </div>
      </div>
    </div>
  );
}
