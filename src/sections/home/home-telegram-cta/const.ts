import { CONFIG } from "src/config-global";

export const TELEGRAM_URL = CONFIG.social.telegramChannel;

export const HOME_SECTION_LINKS = [
  { key: "news", href: "/news" },
  { key: "changelog", href: "/changelog" },
  { key: "llmCompare", href: "/llm-compare" },
] as const;
