# Бесконечная лента на главной (infinite scroll)

**Дата:** 2026-07-05
**Скоуп:** `src/sections/home/home-feed/` (frontend only)

## Проблема

На главной ([`home-feed.tsx`](../../../src/sections/home/home-feed/home-feed.tsx)) лента
показывает первые `FEED_PAGE_SIZE` постов, дальше — кнопка «Показать ещё», которая
открывает следующую порцию. Нужна автоматическая подгрузка при скролле вместо клика.

## Ключевой факт

Все посты **уже загружены в память** через `useGetPosts()` (client-side SWR, без
серверной пагинации). «Показать ещё» — это чистый reveal среза in-memory массива
(`feedPosts.slice(0, visibleCount)`), не сетевой запрос. Значит:

- сеть/бэкенд не трогаем;
- «подгрузка» = увеличение `visibleCount`;
- никакой библиотеки не нужно — нативный `IntersectionObserver` делает всё.

## Решение

`IntersectionObserver` + невидимый sentinel внизу списка. Когда sentinel входит во
viewport (с упреждением `rootMargin: 200px`), `visibleCount` растёт на `FEED_PAGE_SIZE`.

Кнопка «Показать ещё» **остаётся как fallback** для доступности (клавиатура,
screen-reader, браузер без IntersectionObserver, JS-ошибка в observer).

### Отвергнутые альтернативы

- **`react-intersection-observer`** — лишняя зависимость (~2kb) ради того, что нативный
  API делает сам. Оправдано только при использовании в 3+ местах; здесь одно.
- **Серверная пагинация + `useSWRInfinite`** — крупный рефактор fe+be ради настоящей
  lazy-загрузки по сети. Не оправдано: постов немного, они и так все в памяти.
- **Переиспользовать `src/hooks/use-infinite-scroll.ts`** — существующий глобальный хук
  с фейковым `setTimeout(500)` и `window` scroll-листенером (хуже IntersectionObserver),
  плюс он сам держит slice-логику, которая у нас уже в компоненте (`visibleCount`).
  Не используем и **не трогаем** (вне скоупа).

## Архитектура

Новый **локальный** хук `use-feed-infinite-scroll.ts` в
`src/sections/home/home-feed/hooks/` (гайдлайн: бизнес-логика в `hooks/`, отдельно от
JSX; локальный для модуля хук → в модульной `hooks/`).

### Интерфейс

```ts
interface UseFeedInfiniteScrollOptions {
  /** Подгружать, только пока есть что показывать. false → observer отключён. */
  hasMore: boolean;
  /** Вызывается при появлении sentinel во viewport. */
  onLoadMore: () => void;
  /** Упреждение (px) — за сколько до края экрана начинать подгрузку. По умолч. 200. */
  rootMargin?: number;
}

interface UseFeedInfiniteScrollReturn {
  /** Повесить на невидимый div в конце списка. */
  sentinelRef: RefObject<HTMLDivElement | null>;
}

function useFeedInfiniteScroll(
  options: UseFeedInfiniteScrollOptions,
): UseFeedInfiniteScrollReturn;
```

Изоляция: компонент не знает про `IntersectionObserver`; хук не знает про посты/теги.

### Поведение хука

- `useRef<HTMLDivElement>(null)` — sentinelRef.
- `useEffect` создаёт `IntersectionObserver` **только в браузере** (хук `"use client"`,
  observer в effect → SSR-safe). Наблюдает `sentinelRef.current`.
- Callback: при `entry.isIntersecting && hasMore` → `onLoadMore()`.
- Deps effect: `[hasMore, onLoadMore, rootMargin]`. Cleanup — `observer.disconnect()`.
- Если `sentinelRef.current == null` (sentinel не в DOM, т.к. `!hasMore`) — observer
  просто не за кем наблюдать; при следующем рендере с `hasMore` effect переинициализируется.
- `onLoadMore` в компоненте оборачиваем в `useCallback`, чтобы effect не пересоздавался
  на каждый рендер.

### Изменения в `home-feed.tsx`

- Вызвать `useFeedInfiniteScroll({ hasMore, onLoadMore })`, где
  `onLoadMore = useCallback(() => setVisibleCount((c) => c + FEED_PAGE_SIZE), [])`.
- Отрендерить `<Box ref={sentinelRef} />` (невидимый, высота 1px) в конце списка,
  только пока `hasMore`.
- Кнопка «Показать ещё» — оставить, тот же `onClick`, что и `onLoadMore` (переиспользовать
  колбэк). Рендерится, только пока `hasMore`.

### Изменения в `const.ts`

Комментарий над `FEED_PAGE_SIZE` сейчас: «…each click adds this many more. Not infinite
scroll by design.» — обновить: порция теперь подгружается и по скроллу (авто), и по
кнопке-fallback.

### Обновить `index.ts`

Ре-экспорт нового хука не обязателен (используется только внутри модуля), но добавим
для консистентности с `useFeedTags`:
`export { useFeedInfiniteScroll } from "./hooks/use-feed-infinite-scroll";`

## Граничные случаи

- **Смена фильтра тегов:** `handleToggleTag` уже сбрасывает `visibleCount` на
  `FEED_PAGE_SIZE`. `hasMore` пересчитывается → observer переинициализируется через deps.
- **`hasMore === false`:** sentinel и кнопка не в DOM; effect с `hasMore=false` не
  вызывает `onLoadMore`.
- **Быстрый скролл до низа:** один срез = +`FEED_PAGE_SIZE`. Если sentinel остаётся во
  viewport после подгрузки (мало новых постов) — следующий intersection-тик снова
  триггерит, пока `hasMore` не станет false. Ступенчатой блокировки не нужно: reveal
  синхронный, гонок нет (в отличие от сетевой загрузки).
- **SSR / отсутствие IntersectionObserver:** observer создаётся в `useEffect` (не на
  сервере). Если API нет в браузере — авто-подгрузка не работает, но кнопка-fallback
  работает.

## Ограничения по коду (из CLAUDE.md / memory)

- Один компонент = один файл, ≤200 строк. `home-feed.tsx` 131 стр + ~5. Хук ~35 стр. OK.
- Хук в `hooks/`, не рядом с JSX. ✅
- Никаких `as`/`any`, строковые параметры — юнионы. Здесь типы простые, ассершены не нужны.
- kebab-case имена файлов, MUI `sx`, без хардкода палитры. ✅

## Проверка

1. Dev-сервер в worktree: symlink `node_modules`, скопировать `.env.local`, `next dev`
   **без `--turbo`**, порт 3055 (backend на :7272).
2. Playwright: открыть `/`, сделать `browser_snapshot` (посчитать посты), проскроллить
   вниз, `browser_wait_for`, снова снять snapshot — постов стало больше **без клика**.
3. Проверить fallback-кнопку: клик всё ещё добавляет порцию.
4. `npm run lint` — 0 ошибок (max-lines locked at error, no-loops правила).

## Итоги реализации (что уточнилось при верификации)

Два момента всплыли только на живой проверке в браузере — спека выше описывает
замысел, здесь — фактическая реализация:

1. **`resetKey` в интерфейсе хука.** IntersectionObserver срабатывает только на
   _смену_ состояния пересечения. Если после раскрытия порции sentinel остаётся во
   viewport (добавилось мало постов), «вход» не повторяется и лента застревает.
   Решение: опциональный `resetKey: number` (в компоненте = `visibleCount`); при его
   изменении effect переподписывается, а `observe()` заново эмитит текущее пересечение —
   подгрузка каскадит, пока sentinel не уйдёт из зоны или `hasMore` не станет false.
   Важно: `resetKey` имеет дефолт `0`, чтобы длина deps-массива была постоянной
   (React требует стабильную длину; иначе — рантайм-варнинг и нестабильный effect).

2. **Геометрия sentinel.** Не 1px-div _перед_ кнопкой (так он при скролле в самый
   низ оказывался выше viewport из-за высоты блока кнопки и не пересекался), а
   `position:absolute`-бокс высотой `FEED_SENTINEL_PRELOAD` (400px, вынесено в `const.ts`),
   привязанный к низу обёртки кнопки и растянутый вверх. Его верхняя кромка = зона
   упреждения: авто-подгрузка стартует за ~600px (400 высота + 200 `rootMargin`) до
   конца ленты. `pointerEvents:none`, чтобы не перехватывать клики по кнопке под ним.

**Проверено (Playwright, viewport 1000×800, `FEED_PAGE_SIZE=3` временно для теста):**
прогрессивный скролл 3 → 6 → 8 постов **без клика**, каскад отработал; в конце
кнопка и sentinel исчезают (`hasMore=false`). Fallback-кнопка: клик 3 → 6 без скролла.
0 ошибок в консоли. `FEED_PAGE_SIZE` возвращён на 10; tsc и eslint зелёные.

> Примечание: preview-сервер Claude (headless) отдаёт `window.innerHeight === 0`, из-за
> чего IntersectionObserver против viewport-root там не срабатывает в принципе. Проверка
> инфинит-скролла требует Playwright (реальный Chromium с ненулевым viewport).
