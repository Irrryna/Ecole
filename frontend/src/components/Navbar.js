import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { token, logout } = useAuth(); // Use token and logout from AuthContext

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="main-nav">
      <div className="nav-links">
        <NavLink to="/" end>{t('home')}</NavLink>
        <NavLink to="/news">{t('news')}</NavLink>
        <NavLink to="/teachers">{t('teachers')}</NavLink>
        <NavLink to="/articles">{t('articles')}</NavLink>
        <NavLink to="/schedule">{t('schedule')}</NavLink>
        {token ? (
          <>
            <NavLink to="/dashboard">{t('dashboard')}</NavLink>
            <button onClick={logout} className="nav-logout-button">{t('logout')}</button>
          </>
        ) : (
          <>
            <NavLink to="/login">{t('login')}</NavLink>
            <NavLink to="/register">{t('register')}</NavLink>
          </>
        )}
      </div>
      <div className="lang-switcher">
        <button onClick={() => changeLanguage('fr')} disabled={i18n.language === 'fr'}>FR</button>
        <button onClick={() => changeLanguage('uk')} disabled={i18n.language === 'uk'}>UK</button>
      </div>
    </nav>
  );
};

export default Navbar;