# GEO-шаблон постов — дизайн

Дата: 2026-07-04. Ставка #4 из `DEEP-ANALYSIS.md` (payoff High, эффорт S). Один репозиторий: `blog-app-mui-frontend`.

## Цель

Повысить попадание постов в цитаты LLM (ChatGPT / Perplexity / Claude) и rich-результаты Google/Yandex. Пять элементов, компаундятся на каждом посте. Дизайн-язык — Editorial Ink (`.stitch/DESIGN.md`): warm paper, один vermilion-акцент, JetBrains Mono для метаданных, hairline-разделители, **иерархия через типографику и spacing, не через цветные боксы**. Ноль эмодзи в UI.

## Скоуп (5 элементов)

1. **BLUF-блок «Коротко»** — существующий `post.description`, поднятый в выделенный блок перед телом. Vermilion левая hairline (2px) + mono-overline «Коротко». НЕ цветная плашка. Покрыты все посты (description заполнен везде).
2. **FAQ-аккордеон + FAQPage JSON-LD** — парсим секцию `## FAQ` / `## Частые вопросы` из контента, формат A (`### вопрос` → абзац-ответ), вырезаем из тела (не дублируется), рендерим как hairline-ruled `<details>`-аккордеон. Эмитим `FAQPage` schema для rich-результата.
3. **Видимая «Обновлено» дата** — mono, vermilion, рядом с «мин чтения», отделено hairline-точкой. Из `post.updatedAt` (fallback `createdAt`). Показываем только если `updatedAt` заметно позже `createdAt` (см. ниже) — иначе шум.
4. **`/llms.txt`** — route, отдающий markdown-карту сайта для LLM: заголовок сайта + список постов (title + description + URL).
5. **Явный allow AI-краулерам** в `robots.txt` — GPTBot / ChatGPT-User / ClaudeBot / Claude-Web / PerplexityBot / Google-Extended → `Allow: /` (декларация; сейчас разрешены дефолтом через `User-agent: *`).

Уже готово, НЕ трогаем: JSON-LD Article/NewsArticle, canonical, sitemap, OG-картинки, RSS, «мин чтения», кликабельные теги, Yandex Clean-param.

## Архитектура

### Единица 1. Парсер контента — `src/utils/post-geo-content.ts`

Чистый модуль, ноль JSX. Публичный API:

```ts
interface FaqItem {
  question: string;
  answer: string;
} // answer — markdown-строка
interface ParsedPostContent {
  body: string; // контент без FAQ-секции (markdown)
  faq: FaqItem[]; // [] если секции нет
}
function parsePostContent(content?: string): ParsedPostContent;
```

Логика:

1. Пусто → `{ body: "", faq: [] }`.
2. Нормализация в markdown: `isMarkdownContent(content) ? content : htmlToMarkdown(content)` (реюз `src/components/markdown/html-to-markdown.ts`). Так парсер работает и на Tiptap-HTML, и на bot-markdown.
3. Найти FAQ-заголовок: `^##\s+(FAQ|Часто задаваемые вопросы|Частые вопросы)\s*$` (регистронезависимо, `m`-флаг). Нет → `{ body: нормализованный, faq: [] }`.
4. FAQ-секция = от заголовка до следующего `^##\s` того же уровня или конца строки. `body` = контент минус эта секция (вырезать срез, склеить, `trim`).
5. Внутри секции распарсить `### вопрос` → текст-ответ до следующего `###`/`##`/конца. `question` = текст заголовка (trim). `answer` = markdown-блок под ним (trim, может содержать списки/код/таблицы). Заголовки без тела и пустые ответы отбрасываем.
6. Юнит-тесты покрывают: нет-FAQ, HTML-вход, markdown-вход, несколько `###`, `##`-секция после FAQ (граница), пустой ответ, регистр заголовка, `## Частые вопросы` алиас, ответ со списком/кодом.

### Единица 2. FAQPage JSON-LD — расширение `src/app/post/[id]/json-ld.ts`

Новая функция `buildFaqJsonLd(faq: FaqItem[])`:

- `[]` → `null` (caller скипает `<script>`).
- Иначе `{ "@context":"https://schema.org", "@type":"FAQPage", mainEntity: faq.map(...) }`, где каждый item = `Question` + `acceptedAnswer: { "@type":"Answer", text: <plain-text ответа> }`.
- Ответ в schema — **plain text** (markdown-разметку снять простым stripping — реюз подхода `getReadingTime`: убрать теги/маркеры). Schema.org `text` не рендерит markdown.
- Не трогает существующий `buildPostJsonLd`. Оба JSON-LD эмитятся в `page.tsx` двумя `<script>`.

Парсинг для JSON-LD идёт в `page.tsx` (server, SSG/ISR) — schema попадает в статический HTML для краулеров. `page.tsx` зовёт `parsePostContent(post.content)`, передаёт `faq` в `buildFaqJsonLd`.

### Единица 3. BLUF-блок — `src/sections/blog/post-bluf.tsx`

Презентационный компонент. Props: `{ text?: string }`. Пусто/пробелы → `null`.

- Vermilion левая hairline `2px solid`, `pl: 2.5`.
- Mono-overline «Коротко» (реюз `monoLabelSx` из `src/theme/styles/editorial.ts`, цвет vermilion → `color: "primary.main"`).
- Текст: `Typography variant="h6"`-ish, `fontWeight: 500`, `line-height: 1.5`.
- ≤200 строк (тривиально).

### Единица 4. FAQ-аккордеон — `src/sections/blog/post-faq.tsx`

Презентационный. Props: `{ items: FaqItem[] }`. `[]` → `null`.

- Mono-overline «Ответы» + `Typography variant="h4"` заголовок «Частые вопросы».
- MUI `Accordion` (disableGutters, elevation 0, прозрачный фон) на item; hairline `borderTop`, последний — `borderBottom`. НЕ карточка-бокс.
- `AccordionSummary`: вопрос Manrope 600; иконка-знак `+`→поворот на `×` через vermilion `Iconify` (`mingcute:add-line`, rotate 45° при `expanded` — CSS), НЕ дефолтный шеврон.
- `AccordionDetails`: ответ через существующий `<Markdown>` (ответ — markdown-строка, поддержит списки/код/таблицы).
- Клиентский компонент (Accordion — стейт). Файл ≤200 строк.

### Единица 5. Строка «Обновлено» — правка `post-details-home-view.tsx`

- Рядом с «мин чтения» в существующем mono-Box: добавить hairline-точку `•` + «Обновлено <fDate(updatedAt)>».
- Показывать только если `updatedAt` есть И (updatedAt − createdAt) > 24ч (иначе «обновлено» == «опубликовано», шум). Хелпер `isMeaningfullyUpdated(createdAt, updatedAt)` в `post-geo-content.ts` (чистая функция, тестируемая).
- Цвет «Обновлено» — `primary.main` (vermilion).

### Единица 6. Интеграция во view — `post-details-home-view.tsx`

- Заменить прямой `<Markdown children={currentPost.content} />` на: `const { body, faq } = parsePostContent(currentPost?.content)` → `<Markdown children={body} />`.
- `description` больше НЕ рендерить голым `Typography subtitle1` — вместо него `<PostBluf text={currentPost?.description} />` в той же позиции (перед телом).
- После тегов, перед `<PostNewsletterCta />`: `<PostFaq items={faq} />`.
- Порядок: Hero → breadcrumbs → [мин чтения + Обновлено] → BLUF → body → теги/avatars → FAQ → Newsletter → комментарии → related → свежее. (Совпадает с утверждённым мокапом.)
- View — клиентский; парсинг там дублирует серверный (дёшево, чистая функция). ОК: SSG-HTML для краулеров идёт из `page.tsx` JSON-LD + первый render; интерактивный аккордеон — из view.

### Единица 7. `/llms.txt` — `src/app/llms.txt/route.ts`

- Next Route Handler, `GET`, `Content-Type: text/plain; charset=utf-8`.
- Тело (markdown-конвенция llms.txt):

  ```
  # aifirst.us.com
  > Русскоязычный блог про AI/LLM/агентов: кейсы, гайды, честные разборы.

  ## Посты
  - [Заголовок](https://aifirst.us.com/post/<id>/): описание
  ...
  ```

- Данные: `getPosts()` из `blog-ssr` (реюз, unbounded default). Try/catch — backend недоступен → отдать заголовок+секции без списка (не 500). См. память [[prerender-fetch-must-be-guarded]].
- ISR: `export const revalidate = 3600`.

### Единица 8. `robots.txt` — правка `public/robots.txt`

Добавить перед `Sitemap:` явные allow-блоки:

```
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
```

(Статический файл в `public/` — Next отдаёт как есть. `/llms.txt` — динамический route, не конфликтует.)

## Данные и поток

- Контент поста (`post.content`, HTML или markdown) — единственный источник FAQ/BLUF/body. Ноль изменений в БД, боте, бэкенде.
- BLUF = `post.description` (существует). FAQ = секция `## FAQ` в контенте. «Обновлено» = `post.updatedAt`.
- Server (`page.tsx`, SSG/ISR): `parsePostContent` → FAQPage JSON-LD в статический HTML.
- Client (`view`): `parsePostContent` → BLUF + body + FAQ-аккордеон интерактивно.

## Обработка ошибок / edge-cases

- Нет FAQ-секции → блока нет, `body` == весь контент (старые посты не ломаются).
- Пустой `description` → BLUF-блока нет (голого subtitle тоже; регресс минимальный — description почти всегда есть).
- `updatedAt` ≈ `createdAt` → «Обновлено» скрыто.
- FAQ-ответ с markdown → рендерится через `<Markdown>`; в JSON-LD — plain text.
- llms.txt при недоступном backend → заголовок без списка, не падает.
- Контент — HTML от Tiptap → нормализуется turndown'ом до парсинга.

## Тестирование

- Юнит (`src/utils/__tests__/post-geo-content.test.ts` или рядом по конвенции проекта): `parsePostContent` (9+ кейсов выше) + `isMeaningfullyUpdated`.
- Build-verify: `next build` зелёный, роут `/llms.txt` в манифесте.
- Browser-verify (preview, порт из [[worktree-preview-env-trap]]): пост с FAQ-секцией → BLUF+аккордеон+«Обновлено» рендерятся; пост без FAQ → блоков нет, тело целое; FAQPage JSON-LD в `<head>` (view-source); `/llms.txt` отдаёт text/plain; dark-mode ок.
- Gates: `npm run lint` 0, `tsc --noEmit` 0, `npm run knip` (новые файлы wired).

## Ограничения / конвенции

- MUI-sx + kebab-case файлы, ≤200 строк, один компонент = один файл, хуки в `hooks/` (парсер — util, не хук). Дизайн-язык Editorial Ink строго. Ноль новых зависимостей (turndown/react-markdown уже есть).
- Секции isolation: `post-bluf`/`post-faq` живут в `sections/blog`, импортятся только из blog-view.
- Ноль `as`/`any` (память [[no-as-no-any-enum-params]]); функциональный стиль массивов, без for-of/while (память [[frontend-no-loops-es5-eslint]]).

## Deferred (не в этой итерации)

- Отдельные DB-поля faq/tldr + бот-заполнение (вариант B развилки) — потом отдельной фичей если зайдёт.
- Обучение бота писать `## FAQ`/BLUF в промпте — тривиально, отдельный bot-PR.
- Anchor-ссылки на вопросы, «поделиться вопросом».
- llms-full.txt (полные тела).
