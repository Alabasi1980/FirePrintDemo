import type { Metadata } from "next";
import "./globals.css"; // Global styles

export const metadata: Metadata = {
  title: "My Google AI Studio App",
  description: "My Google AI Studio App",
};

import { DuelProvider } from "@/components/duel/DuelProvider";
import { LanguageWrapper } from "@/components/LanguageWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <DuelProvider>
          <LanguageWrapper>
            {children}
          </LanguageWrapper>
        </DuelProvider>
      </body>
    </html>
  );
}
