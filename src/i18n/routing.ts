import { defineRouting } from "next-intl/routing";

// English, Portuguese, French, Dutch, German were already offered by the
// (previously non-functional) LanguageSwitcher. Polish and Romanian added per
// the "Multi-language — Eastern European languages in scope" roadmap item.
// Spanish (Spain) and Italian added 2026-07-22.
export const locales = ["en", "pt", "fr", "nl", "de", "pl", "ro", "es", "it"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});
