import type { ReadingItem } from "../types";

// ----------------------------------------------------------------------
// Curated reading-list — the external AI/LLM sources worth your time.
// Opinionated, not exhaustive. Every URL is the source's canonical home.

export const READING_ITEMS: ReadingItem[] = [
  // --- Blogs -----------------------------------------------------------
  {
    id: "simonwillison",
    title: "Simon Willison's Weblog",
    author: "Simon Willison",
    kind: "blog",
    url: "https://simonwillison.net/",
    lang: "en",
    why: "Практичный дневник о работе с LLM: инструменты, промпты, разборы новых моделей почти в день релиза.",
  },
  {
    id: "interconnects",
    title: "Interconnects",
    author: "Nathan Lambert",
    kind: "blog",
    url: "https://www.interconnects.ai/",
    lang: "en",
    why: "Глубоко про RLHF, пост-тренинг и открытые модели от человека внутри индустрии.",
  },
  {
    id: "lilianweng",
    title: "Lil'Log",
    author: "Lilian Weng",
    kind: "blog",
    url: "https://lilianweng.github.io/",
    lang: "en",
    why: "Эталонные лонгриды-разборы: агенты, галлюцинации, диффузия — база для понимания, а не новостей.",
  },
  {
    id: "karpathy",
    title: "Andrej Karpathy",
    author: "Andrej Karpathy",
    kind: "blog",
    url: "https://karpathy.ai/",
    lang: "en",
    why: "Первоисточник интуиции про то, как на самом деле работают нейросети и LLM, от одного из ключевых людей области.",
  },
  // --- Newsletters -----------------------------------------------------
  {
    id: "the-batch",
    title: "The Batch",
    author: "DeepLearning.AI",
    kind: "newsletter",
    url: "https://www.deeplearning.ai/the-batch/",
    lang: "en",
    why: "Еженедельный дайджест новостей ИИ с колонкой Эндрю Ына — трезвый взгляд без хайпа.",
  },
  {
    id: "latent-space",
    title: "Latent Space",
    author: "swyx & Alessio",
    kind: "newsletter",
    url: "https://www.latent.space/",
    lang: "en",
    why: "Рассылка и подкаст для AI-инженеров: продакшн-практика, интервью с создателями инструментов.",
  },
  {
    id: "import-ai",
    title: "Import AI",
    author: "Jack Clark",
    kind: "newsletter",
    url: "https://importai.substack.com/",
    lang: "en",
    why: "Исследовательский срез недели с акцентом на риски и политику ИИ от сооснователя Anthropic.",
  },
  // --- Landmark posts --------------------------------------------------
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    author: "Vaswani et al., Google",
    kind: "paper",
    url: "https://arxiv.org/abs/1706.03762",
    lang: "en",
    why: "Статья, породившая архитектуру Transformer — фундамент всех современных LLM.",
  },
  {
    id: "building-effective-agents",
    title: "Building Effective Agents",
    author: "Anthropic",
    kind: "post",
    url: "https://www.anthropic.com/research/building-effective-agents",
    lang: "en",
    why: "Честный разбор, когда агент реально нужен, а когда хватит цепочки промптов — без магии.",
  },
  {
    id: "prompt-engineering-guide",
    title: "Prompt Engineering Guide",
    author: "DAIR.AI",
    kind: "post",
    url: "https://www.promptingguide.ai/",
    lang: "en",
    why: "Систематизированный справочник приёмов промптинга с примерами — хорошая точка входа.",
  },
  // --- Video / podcast -------------------------------------------------
  {
    id: "3blue1brown-nn",
    title: "Neural Networks (визуальный курс)",
    author: "3Blue1Brown",
    kind: "video",
    url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
    lang: "en",
    why: "Лучшее визуальное объяснение, как устроены нейросети и трансформеры — интуиция за час.",
  },
];
