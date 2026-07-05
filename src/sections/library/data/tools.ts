import type { ToolItem } from "../types";

// ----------------------------------------------------------------------
// Curated tool-directory — AI tools worth knowing, grouped by category.
// Pricing is the tool's own model (free / freemium / paid / open-source),
// not a specific price — «NEVER invented».

export const TOOL_ITEMS: ToolItem[] = [
  // --- Agents / coding agents -----------------------------------------
  {
    id: "claude-code",
    name: "Claude Code",
    category: "agents",
    pricing: "paid",
    url: "https://www.anthropic.com/claude-code",
    what: "Агентный CLI-инструмент от Anthropic: правит код в вашем репозитории, гоняет тесты, ведёт задачу end-to-end.",
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "ide",
    pricing: "freemium",
    url: "https://cursor.com/",
    what: "IDE на базе VS Code с глубокой ИИ-интеграцией: чат по кодовой базе, agent-режим, автодополнение.",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "ide",
    pricing: "paid",
    url: "https://github.com/features/copilot",
    what: "Автодополнение и чат в редакторе от GitHub — самый распространённый AI-ассистент для кода.",
  },
  {
    id: "aider",
    name: "Aider",
    category: "agents",
    pricing: "open-source",
    url: "https://aider.chat/",
    what: "Открытый парный программист в терминале: работает с git, применяет правки по вашему описанию.",
  },
  // --- Chat assistants -------------------------------------------------
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "chat",
    pricing: "freemium",
    url: "https://chatgpt.com/",
    what: "Самый массовый чат-ассистент от OpenAI: текст, голос, картинки, инструменты и кастомные GPT.",
  },
  {
    id: "claude-ai",
    name: "Claude",
    category: "chat",
    pricing: "freemium",
    url: "https://claude.ai/",
    what: "Чат-ассистент Anthropic с сильным ризонингом и артефактами; хорош для длинных документов и кода.",
  },
  // --- Search / research ----------------------------------------------
  {
    id: "perplexity",
    name: "Perplexity",
    category: "search",
    pricing: "freemium",
    url: "https://www.perplexity.ai/",
    what: "Поисковый ассистент с ответами и ссылками на источники — замена «загуглить» для research.",
  },
  {
    id: "notebooklm",
    name: "NotebookLM",
    category: "search",
    pricing: "free",
    url: "https://notebooklm.google.com/",
    what: "Исследование по вашим документам от Google: сводки, вопросы к источникам, аудио-обзоры.",
  },
  // --- Images ----------------------------------------------------------
  {
    id: "midjourney",
    name: "Midjourney",
    category: "images",
    pricing: "paid",
    url: "https://www.midjourney.com/",
    what: "Генерация изображений с сильной художественной эстетикой — стандарт для концептов и артов.",
  },
  {
    id: "comfyui",
    name: "ComfyUI",
    category: "images",
    pricing: "open-source",
    url: "https://www.comfy.org/",
    what: "Открытый node-редактор пайплайнов генерации изображений (Stable Diffusion и др.) с полным контролем.",
  },
  // --- Audio -----------------------------------------------------------
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "audio",
    pricing: "freemium",
    url: "https://elevenlabs.io/",
    what: "Синтез и клонирование речи высокого качества, дубляж и озвучка — лидер по натуральности голоса.",
  },
  {
    id: "whisper",
    name: "Whisper",
    category: "audio",
    pricing: "open-source",
    url: "https://github.com/openai/whisper",
    what: "Открытая модель распознавания речи от OpenAI: точная транскрипция и перевод для десятков языков.",
  },
  // --- Eval ------------------------------------------------------------
  {
    id: "langfuse",
    name: "Langfuse",
    category: "eval",
    pricing: "open-source",
    url: "https://langfuse.com/",
    what: "Открытый observability для LLM-приложений: трейсы, оценки, стоимость и качество ответов в проде.",
  },
  {
    id: "artificial-analysis",
    name: "Artificial Analysis",
    category: "eval",
    pricing: "free",
    url: "https://artificialanalysis.ai/",
    what: "Независимые бенчмарки моделей: качество, скорость и цена в сравнимом виде — для выбора модели.",
  },
  // --- Orchestration ---------------------------------------------------
  {
    id: "langchain",
    name: "LangChain",
    category: "orchestration",
    pricing: "open-source",
    url: "https://www.langchain.com/",
    what: "Фреймворк для сборки LLM-приложений и агентов: цепочки, инструменты, память, интеграции.",
  },
  {
    id: "llamaindex",
    name: "LlamaIndex",
    category: "data",
    pricing: "open-source",
    url: "https://www.llamaindex.ai/",
    what: "Библиотека для RAG: индексация ваших данных и подключение их к LLM для ответов по контексту.",
  },
  {
    id: "ollama",
    name: "Ollama",
    category: "orchestration",
    pricing: "open-source",
    url: "https://ollama.com/",
    what: "Простой локальный запуск открытых моделей одной командой — приватность и работа офлайн.",
  },
];
