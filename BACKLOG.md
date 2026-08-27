# BACKLOG — полный прогон проверок фронтенда

Дата: 2026-08-27. Метод: прогнаны все verification gates из AGENTS.md + CI
(`frontend-ci.yml`), статические проверки правил CLAUDE.md, ревью последнего
коммита, аудит зависимостей. Каждая находка проверена вручную (file:line).

## Результаты гейтов

| Гейт                             | Результат | Комментарий                                                                                                                                       |
| -------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn install --frozen-lockfile` | ✅        | lockfile в синхроне                                                                                                                               |
| `npx tsc --noEmit`               | ✅        | 0 ошибок                                                                                                                                          |
| `yarn lint`                      | ✅        | 0 ошибок и предупреждений                                                                                                                         |
| `yarn test:unit`                 | ✅        | 32 файла, 217/217                                                                                                                                 |
| `npx madge --circular`           | ✅        | циклов нет                                                                                                                                        |
| `yarn fm:check`                  | ✅        | prettier чист                                                                                                                                     |
| `yarn knip`                      | ❌        | 4 неиспользуемых экспортированных типа (см. B1)                                                                                                   |
| `yarn build`                     | ⚠️        | компиляция+типы ок; пререндер не проверить из песочницы (порт 8444 закрыт), в CI идёт против живого API. Билд выдал 3 предупреждения → B3, B6, B7 |
| e2e                              | —         | требует бэкенд :7272 + Postgres, вне CI (см. C5)                                                                                                  |
| Паритет i18n ru/en               | ✅        | 346/346 ключей                                                                                                                                    |
| Правила CLAUDE.md (сканы)        | ⚠️        | хуки/изоляция секций/layout'ы/SSG-guard'ы ок; расхождения — B2, B4, C6, C7                                                                        |

---

## A. Баги (чинить первыми)

### A1. `tagLabel` ходит по прототипной цепочке — тег `constructor` роняет страницу

`src/utils/tag-labels.ts:57`: `labels?.[tag.toLowerCase()] ?? tag`. Для тега
`constructor` lookup возвращает `Object.prototype.constructor` (функцию), `??`
не срабатывает. Chip/`h1` получает функцию («Functions are not valid as a React
child»), `__proto__` — объект (страница падает), а в `generateMetadata`
`/tag/[slug]` в `<title>` попадает `function Object() { [native code] }`.
Теги бота open-ended, английские теги уже есть — риск реальный. Проверено
воспроизведением в node.

**Фикс:** `Object.hasOwn(labels, key) ? labels[key] : tag` (или
`Object.create(null)`/`Map` для словарей). Добавить тест на `constructor` /
`__proto__`. Эффорт XS.

### A2. Вычисляемый `export { dynamic }` в двух dashboard-страницах молча игнорируется

`src/app/[locale]/dashboard/post/[id]/page.tsx:27` и `…/edit/page.tsx:39`:
`const dynamic = CONFIG.isStaticExport ? "auto" : "force-dynamic"; export { dynamic }`.
Next требует статически анализируемый литерал; билд пишет «can't recognize the
exported `dynamic` field … default config will be used» — страницы НЕ
force-dynamic, как задумано.

**Фикс:** статичный `export const dynamic = "force-dynamic"` (ветку static
export решить иначе — например, отдельным конфигом), убедиться, что варнинг из
билда ушёл. Эффорт XS–S.

### A3. Тесты `fDate` зависят от таймзоны машины

`src/utils/__tests__/format-time.test.ts:8`: фиксированный UTC-инстант
`2026-08-15T09:00:00.000Z` форматируется в локальном времени — на машине
UTC−10 и западнее рендерится «14 августа» и тесты падают, хотя код верен.

**Фикс:** полуденный инстант без `Z` либо пин `TZ` для сьюта. Эффорт XS.

---

## B. Нарушения собственных правил / гигиена

### B1. knip красный: 4 мёртвых экспортированных типа в `finance`

`FinanceOperationsTarget` (`src/actions/finance.ts:29`), `FinanceIconColor`,
`FinanceIcon` (`src/sections/finance/category-icons.ts:6,14`), `FinanceFlow`
(`src/types/finance.ts:3`). AGENTS.md требует «knip = 0», но в CI knip
non-blocking — дрифт уже начался.

**Фикс:** снять `export` / удалить типы; после нуля — обсудить перевод knip в
блокирующий гейт (false-positives вроде `critters` уже в ignore). Эффорт XS.

### B2. Двойной `AuthProvider`: лишний `GET /me` на каждый просмотр публичной страницы

`src/app/[locale]/layout.tsx:95` оборачивает всё дерево в `AuthProvider`, и
одновременно 8 роут-layout'ов (`news`, `changelog`, `library`, `llm-compare`,
`llm-timeline`, `newsletter`, `post`, `tag/[slug]`) оборачивают ещё раз.
Каждый экземпляр на маунте делает `GET /me` → два запроса вместо одного,
внутренний контекст затеняет внешний.

**Фикс:** убрать внутренние обёртки (8 файлов остаются `MainLayout`-only, как
`(index)/layout.tsx`), проверить dashboard/auth-роуты. Источник паттерна —
устаревший сниппет в CLAUDE.md (см. B4). Эффорт S.

### B3. ESLint не знает про Next: плагин не подключён

Билд предупреждает «The Next.js plugin was not detected in your ESLint
configuration». Правила `next/core-web-vitals` (no-img-element,
no-html-link-for-pages, sync-scripts и т.д.) не работают.

**Фикс:** добавить `eslint-config-next` в extends `.eslintrc.cjs`, починить
что вылезет. Эффорт S.

### B4. CLAUDE.md устарел и учит антипаттерну

Готча №1 описывает мир до `[locale]`: «корневой `src/app/layout.tsx` оборачивает
только AuthProvider», роуты `src/app/<route>/layout.tsx` — реально корневой
layout — bare passthrough, всё живёт в `src/app/[locale]/layout.tsx`, роуты — в
`src/app/[locale]/<route>/`. Список роутов неполон (нет `newsletter`, `post`,
`tag`). Шаблонный сниппет предписывает оборачивать `AuthProvider` в каждом новом
layout — это и породило B2. Упоминание «скрипт цветовой схемы в корневом
layout.tsx» тоже указывает не туда.

**Фикс:** переписать готчу №1 (+1a-путь скрипта темы) под текущую структуру;
сниппет — `MainLayout`-only. Эффорт S.

### B5. Деприкейтнутые MUI API в теме

`src/theme/create-theme.ts:5` — `experimental_extendTheme` (билд пишет
«has been stabilized, use extendTheme»), `src/theme/theme-provider.tsx:9` —
`Experimental_CssVarsProvider`. Есть шим `src/theme/mui-deprecated-shims.d.ts`.

**Фикс:** мигрировать на стабильные `extendTheme`/`CssVarsProvider` (или
`ThemeProvider` + `cssVariables` MUI v7), удалить шим. Эффорт S–M.

### B6. Инлайновые `as`-ассерты вопреки правилу №2 AGENTS.md

~10 реальных инлайновых ассертов: `JSON.parse(...) as X` в
`src/server/llm-stats/adapters/*` и `cache.ts`, `(err as Error).message` в
`scan.ts`, `as T` в `src/utils/fetch-retry.ts:86`, `as ControlProviderName` в
`src/sections/admin/utils.ts:24`, `TypedAutocomplete` в
`rhf-autocomplete.tsx:16`, `as Post` в тесте home-feed. Lint это не ловит —
правило живёт только в доке.

**Фикс:** либо включить `@typescript-eslint/consistent-type-assertions`
(`assertionStyle: never`) и переписать места на схемы/narrowing (для
`JSON.parse` — zod уже в зависимостях), либо честно задокументировать эти
классы исключений в AGENTS.md. Эффорт M.

### B7. Дубль CSS подсветки кода (~150 строк × 2)

`src/components/editor/components/code-highlight-block.css` и
`src/components/markdown/code-highlight-block.css` идентичны с точностью до
одного селектора (`code[as='code']` vs `code`). Палитра темы подсветки будет
дрейфовать.

**Фикс:** один общий файл (селектор объединить через запятую), импорт из обоих
мест. Эффорт XS.

---

## C. Процесс и инфраструктура

### C1. Allow-list Vitest не покрывает четыре директории с кодом

`vitest.config.ts` include: `server/llm-stats`, `app`, `components`, `utils`,
`routes`, `sections`. Тесты, добавленные в `src/actions/**`, `src/hooks/**`,
`src/auth/**`, `src/layouts/**`, молча не запустятся.

**Фикс:** `src/**/*.test.ts` одной строкой (или добавить недостающие диры).
Эффорт XS.

### C2. Дубль `toAppLocale(useLocale())` в ~15 компонентах

post-details-tags, post-item(±latest/feed/feed-featured), post-comment-item,
post-details-hero, post-details-home-view, post-list-home-view, tag-list-view,
release-card, release-header, home-feed, til-card, timeline-entry, news-item.
Третья локаль или смена источника локали = 15 правок.

**Фикс:** `useAppLocale()` в `src/hooks/` (по правилу №7 CLAUDE.md), заменить
call sites. Эффорт S.

### C3. Зависимости: security-патчи и EOL-мажоры

Минорные (низкий риск, сделать скопом): next 15.4.8→15.5.x (патчи
безопасности), axios 1.13→1.20, tiptap 3.11→3.30, @playwright/test,
@typescript-eslint, prettier, next-intl, @hookform/resolvers.
Мажорные (по одному, отдельными PR): eslint 8 (EOL) → 10 + flat config —
самый назревший; knip 5→6; eslint-plugin-react-hooks 5→7; apexcharts 5→7;
framer-motion 12→13; @vercel/analytics 1→2. Крупные (отдельное решение, не
скопом): next 16, MUI 9. Эффорт: миноры S, каждый мажор S–M.

### C4. knip в CI non-blocking — правило «0 unused» не защищено

Комментарий в workflow ссылается на false-positives, но реальные FP уже закрыты
`ignoreDependencies`. Из-за `|| true` появился B1.

**Фикс:** после B1 убрать `|| true` в `frontend-ci.yml`; новые FP — добавлять в
ignore с комментарием. Эффорт XS.

### C5. e2e нигде не запускаются автоматически

`yarn e2e` требует живой бэкенд + Postgres и не входит в CI (осознанно), но и
по расписанию их никто не гоняет — регрессии всплывут только вручную.

**Фикс-варианты (по возрастанию эффорта):** nightly workflow с docker-compose
(backend + Postgres + seed); или прод-smoke сабсет (только read-only specs
против prod). Эффорт M.

### C6. Правило «no while» из CLAUDE.md не энфорсится

`src/layouts/components/searchbar/utils.ts:64` содержит `while` — lint зелёный.
Правило №5 живёт только в доке.

**Фикс:** либо `no-restricted-syntax` для `WhileStatement` (+ переписать
searchbar на функциональный обход), либо смягчить формулировку в CLAUDE.md до
фактически энфорсимого набора (for-of ловится airbnb). Эффорт XS–S.

### C7. Секция `finance` не отражена в доках

Скрытая admin-страница `/dashboard/finance` (учёт по выпискам Т-Банка) — три
коммита, а в CLAUDE.md/AGENTS.md ни слова (в отличие от llm-stats, у которого
есть свой раздел). Следующий агент/разработчик не знает контракта
(`/api/finance/*`, классификатор на бэке).

**Фикс:** короткий раздел в AGENTS.md по образцу «LLM stats dashboard». Эффорт XS.

---

## Порядок работ (рекомендация)

1. **Скоп «за один присест»:** A1 + A3 + B1 + C1 + C4 + B7 (все XS, каждый — с
   тестом/проверкой гейта).
2. **Скоп «роутинг/доки»:** B2 + B4 + C7 (связаны: код и доки чинятся вместе).
3. **Скоп «lint»:** B3 + C6 (+ решение по B6) — один PR по конфигу ESLint.
4. A2, B5, C2 — отдельными маленькими PR.
5. C3 — миноры сейчас, мажоры по одному; C5 — спланировать отдельно.

Что НЕ трогать: публичный /llm-stats не отстраивать (решение владельца,
см. IMPROVEMENT-PLAN.md); секции изоляцию, SSG-guard'ы, i18n-паритет — уже
чисто, регрессий не найдено.
