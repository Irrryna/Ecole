
import React from 'react';
import { useTranslation } from 'react-i18next';

const NewsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <h1>{t('news')}</h1>
      <p><i>Contenu à venir...</i></p>
    </div>
  );
};

export default NewsPage;
