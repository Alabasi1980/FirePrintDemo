"use client";

import { useTranslation } from "@/hooks/useTranslation";
import React from "react";

export function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { isRtl, lang } = useTranslation();

  return (
    <div dir={isRtl ? "rtl" : "ltr"} lang={lang} className={isRtl ? "font-arabic" : ""}>
      {children}
    </div>
  );
}
