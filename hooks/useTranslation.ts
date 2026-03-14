"use client";

import { useUserStore } from "@/store/useUserStore";
import en from "@/lib/locales/en.json";
import ar from "@/lib/locales/ar.json";

const translations = { en, ar };

export function useTranslation() {
  const { settings } = useUserStore();
  const lang = settings.uiLanguage || "en";
  const t = translations[lang];

  return { t, lang, isRtl: lang === "ar" };
}
