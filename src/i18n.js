import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
i18n
    .use(Backend)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
    lng: "en",
    fallbackLng: "en",
    backend: {
        loadPath: isDev ? "/locales/{{lng}}.json" : "./locales/{{lng}}.json",
    },
    debug: isDev,
    interpolation: {
        escapeValue: false, // react already safes from xss
    },
});
export default i18n;
