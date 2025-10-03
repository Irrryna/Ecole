import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import fr from "./locales/fr/common.json";
import uk from "./locales/uk/common.json"; 

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { fr: { translation: fr }, uk: { translation: uk } },
    fallbackLng: "fr",
    supportedLngs: ["fr", "uk"],
    load: "languageOnly",
    lowerCaseLng: true,
    detection: { order: ["localStorage", "htmlTag", "navigator", "querystring"], caches: ["localStorage"] },
    interpolation: { escapeValue: false },
  });

i18n.on("languageChanged", (lng) => { document.documentElement.lang = lng || "fr"; });

export default i18n;
