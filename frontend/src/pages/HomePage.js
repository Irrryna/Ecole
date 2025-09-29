
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../App.css';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <header className="home-header embroidery-border">
        <h1>{t('welcome_title')}</h1>
      </header>
      <section>
        <h2>{t('about_us')}</h2>
        <p>Contenu à propos de l'école...</p>
      </section>
      <section>
        <h2>{t('social_media')}</h2>
        <p>Liens vers les réseaux sociaux...</p>
      </section>
    </div>
  );
};

export default HomePage;
