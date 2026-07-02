export const HERO_OVERLINE = "AI · LLM · агенты · практика";

// Заголовок собирается из частей, чтобы акцентное слово красилось в primary
// без градиентов (Editorial Ink: один цветовой акцент, сплошной).
export const HERO_TITLE_PARTS = {
  before: "Разборы ",
  accent: "AI-инструментов",
  after: " для реальной разработки",
};

export const HERO_SUMMARY =
  "Кейсы, гайды и честные разборы: что из AI-инструментов реально работает " +
  "в проде, а что — хайп. Без воды, с примерами из практики.";

export const HERO_PANEL_TITLE = "В журнале";
export const HERO_PANEL_DESCRIPTION =
  "LLM, агенты, Claude Code и инструменты — что попробовал, что прижилось " +
  "в работе и почему.";

export const HERO_PANEL_LINKS = [
  { label: "Новости AI", href: "/news" },
  { label: "Хронология LLM", href: "/llm-timeline" },
  { label: "Релизы моделей", href: "/changelog" },
  { label: "Обо мне", href: "/portfolio" },
];
