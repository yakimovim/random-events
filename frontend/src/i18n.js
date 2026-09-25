import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  debug: false,
  fallbackLng: "ru",
  resources: {
    ru: {
      translation: {
        repeatDays_one: "Повторять каждый день",
        repeatDays_few: "Повторять каждые {{count}} дня",
        repeatDays_many: "Повторять каждые {{count}} дней",
        offsetDays_one: "± день",
        offsetDays_few: "± {{count}} дня",
        offsetDays_many: "± {{count}} дней",
      },
    },
  },
});
