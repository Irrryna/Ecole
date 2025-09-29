
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['fr', 'uk'],
    fallbackLng: 'fr',
    debug: true,
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      fr: {
        translation: {
          // Navbar
          home: 'Accueil',
          news: 'Actualités',
          teachers: 'Professeurs',
          articles: 'Articles',
          schedule: 'Planning Parental',
          login: 'Connexion',
          // Home Page
          welcome_title: "Bienvenue à l'école",
          about_us: 'À propos de nous',
          social_media: 'Nos réseaux sociaux',
        }
      },
      
      uk: {
        translation: {
          // Navbar
          home: 'Головна',
          news: 'Новини',
          teachers: 'Вчителі',
          articles: 'Статті',
          schedule: 'Батьківський розклад',
          login: 'Увійти',
          // Home Page
          welcome_title: 'Ласкаво просимо до школи',
          about_us: 'Про нас',
          social_media: 'Наші соціальні мережі',
        }
      }
    }
  });

export default i18n;
