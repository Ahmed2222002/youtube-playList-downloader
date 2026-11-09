// Using i18n language
import i18next from "i18next";

export function formatAmount(value) {
  return Number(value.toFixed(2));
}

export function getCurrencySymbol() {
  const lang = i18next.language;
  return lang === "ar" ? "جنيه" : "EGP";
}
