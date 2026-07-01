# LLM History Timeline — design

**Дата:** 2026-07-01
**Ветка:** `claude/llm-history-timeline`
**Роут:** `/llm-timeline` — пункт навигации «История LLM»

## Что строим

Публичная страница с вертикальным таймлайном самых заметных больших языковых
моделей от старых к новым (~40 моделей). Клик по модели раскрывает inline-панель
с подробностями. Данные — статичный курируемый массив во фронтенде (не бэкенд).

Это **отдельная фича** от существующего `/changelog` (bot-maintained лента свежих
релизов из таблицы `model_releases`). Таймлайн — курируемая история вех LLM,
changelog — динамическая лента новинок. Они не пересекаются по данным.

## Решения (зафиксированы с пользователем)

| Вопрос | Решение |
|--------|---------|
| Источник данных | Статичный курируемый массив во фронте (`const.ts`), без бэкенда |
| Размещение | Новая страница `/llm-timeline` + пункт в навигации |
| Детали при клике | Inline-раскрытие (Collapse-аккордеон), одна открыта за раз |
| Визуал | Вертикальный timeline с осью (MUI `@mui/lab`), группировка по годам |
| Охват | Широкий, ~40+ моделей |
| Название/роут | «История LLM» → `/llm-timeline` |

## Архитектура

По гайдлайну репо (sections-раскладка: данные/типы/утилиты/hooks отдельно от JSX;
один компонент = один файл ≤200 строк; `max-lines` locked-at-error).

```
src/app/llm-timeline/
  layout.tsx        # шелл-обёртка (паттерн src/app/changelog/layout.tsx)
  page.tsx          # server component: metadata + JSON-LD ItemList + <LlmTimelineView>
src/sections/llm-timeline/
  const.ts          # LLM_MODELS: массив ~40 моделей (данные, без логики)
  types.ts          # LlmModel и вспомогательные типы
  utils.ts          # группировка по годам, сортировка, vendor→color, форматтеры
  hooks/
    use-timeline-selection.ts   # состояние выбранной (раскрытой) модели
  view/
    llm-timeline-view.tsx       # "use client": ось + рендер по годам
  timeline-entry.tsx            # одна точка на оси: dot + карточка-триггер
  timeline-detail.tsx           # раскрытая панель деталей модели
  timeline-year-label.tsx       # разделитель года на оси
  index.ts          # баррель: export * from "./hooks/use-timeline-selection"
```

## Модель данных

```ts
// src/sections/llm-timeline/types.ts
export interface LlmModel {
  id: string;
  slug: string;              // стабильный ключ, kebab (для JSON-LD / будущих anchor)
  vendor: string;            // "OpenAI" | "Anthropic" | ... (lowercase mapится в цвет)
  name: string;              // "GPT-4", "Claude 3.5 Sonnet"
  releaseDate: string;       // ISO "YYYY-MM-DD" — только проверяемые даты
  contextTokens: number | null;  // размер контекста; null если неизвестно
  params: string | null;         // "175B", "8x7B MoE" и т.п.; null если не раскрыт
  highlight: string;         // одна строка — чем модель важна (для карточки-триггера)
  description: string;       // 2-4 предложения для раскрытой панели
  capabilities: string[];    // теги: "multimodal", "reasoning", "code", "open-weights"
  sourceUrl: string;         // офиц. анонс или paper
}
```

**Принцип данных:** как в changelog — **NEVER invented**. Неизвестные значения =
`null` / пустой массив, не выдумываем. Даты и контекст только из проверяемых
источников (офиц. анонсы, paper). `sourceUrl` обязателен на каждой модели.

**Охват (~40, черновой список, финализируется при наполнении):**
OpenAI: GPT-1, GPT-2, GPT-3, GPT-3.5 (ChatGPT), GPT-4, GPT-4o, o1, o3.
Anthropic: Claude 1, Claude 2, Claude 3 (Opus/Sonnet/Haiku), Claude 3.5 Sonnet.
Google: BERT (веха), Gemini 1.0, Gemini 1.5, Gemini 2.0.
Meta: Llama 1, Llama 2, Llama 3, Llama 3.1.
Mistral: Mistral 7B, Mixtral 8x7B, Mistral Large.
DeepSeek: DeepSeek V2, DeepSeek V3, DeepSeek R1.
xAI: Grok-1, Grok-2. Alibaba: Qwen, Qwen2. Yandex: YandexGPT.
Cohere: Command R. Microsoft: Phi-2/Phi-3. (Точный набор — при наполнении.)

## Таймлайн UX

- MUI `@mui/lab` `Timeline` (dep уже в package.json: `@mui/lab ^7.0.0-beta.16`),
  вертикальная ось, сортировка **старые → новые**.
- Точки сгруппированы по годам; `timeline-year-label` — разделитель года на оси.
- Каждая точка (`timeline-entry`) = карточка-триггер: имя модели, вендор
  (цветной `Label`), дата, `highlight`-строка. `TimelineDot` окрашен по вендору.
- Клик по карточке → раскрывается `timeline-detail` под ней через `Collapse`
  (аккордеон: открытие одной закрывает предыдущую — состояние в
  `use-timeline-selection`). Внутри панели: `description`, контекст/параметры,
  capability-чипы, ссылка «Источник» на `sourceUrl`.
- Клавиатурная доступность: карточка-триггер — `button`-семантика, `aria-expanded`.

## Цвета вендоров

Семантические цвета темы (`LabelColor`), **не hex** — чтобы light/dark и смена
primary работали предсказуемо. Паттерн уже есть в `src/sections/changelog/const.ts`
(`VENDOR_TO_COLOR`). Дублируем маппинг в `llm-timeline/utils.ts` (секции не должны
импортировать друг друга — гайдлайн изоляции `sections/`); при желании позже
вынесем общий util, но в рамках этой задачи — локальная копия.

## SEO

`page.tsx` — server component (данные статичны, состояние раскрытия — в клиентском
`view`). Отдаёт:
- `metadata`: title/description/canonical/OpenGraph (паттерн `changelog/page.tsx`).
- JSON-LD `ItemList` из моделей (позиция + name), как в changelog list.

Сам `LlmTimelineView` — `"use client"` (нужно состояние раскрытия). Массив
`LLM_MODELS` импортируется и в server `page.tsx` (для JSON-LD), и передаётся
во view пропсом — единый источник.

## Навигация

Добавить пункт в `src/layouts/config-nav-main.tsx` между «Релизы» и «Обо мне»:
```ts
{ title: "История LLM", path: "/llm-timeline",
  icon: <Iconify width={22} icon="solar:clock-circle-bold-duotone" /> },
```

## Тесты

Unit на `utils.ts` (jest, паттерн `changelog/__tests__/utils.test.ts`):
- группировка моделей по годам сохраняет порядок старые→новые;
- сортировка по `releaseDate` возрастающая;
- `vendorColor` возвращает `default` для неизвестного вендора.

## Ограничения / вне скоупа

- Без бэкенда, без CRUD, без админки — данные правятся в `const.ts` руками.
- Без отдельных страниц деталей `[slug]` (детали — inline). `slug` в модели —
  задел на будущие anchor-ссылки, но роут `[slug]` в этой задаче не делаем.
- Без RSS/OG-per-model (это у changelog). Одна OG-картинка страницы — дефолтная.
- Данные наполняются лучшими усилиями по публичным источникам; список моделей
  и точные значения финализируются на этапе имплементации, неизвестное = null.

## Соответствие правилам репо

- Один компонент = один файл, ≤200 строк (`max-lines` error) — соблюдаем; крупные
  блоки режем на под-компоненты (`timeline-entry`, `timeline-detail`, `-year-label`).
- Хуки в `hooks/`, не рядом с JSX (`use-timeline-selection.ts`).
- Без `as`/`any`; строковые параметры — union/enum, где применимо.
- Цвета — палитра темы через `Label`/`sx`, без хардкод-hex.
- Функциональный стиль массивов (no for-of/while — es5 target + Airbnb).
