"use client";

import type { RefObject } from "react";

import { useRef, useEffect } from "react";

// ----------------------------------------------------------------------

interface UseFeedInfiniteScrollOptions {
  /** Наблюдать, только пока есть что подгружать. false → observer отключён. */
  hasMore: boolean;
  /** Вызывается, когда sentinel входит во viewport. Оберни в useCallback. */
  onLoadMore: () => void;
  /**
   * Упреждение в px — за сколько до края экрана начинать подгрузку, чтобы
   * следующая порция появлялась ещё до того, как пользователь упрётся в конец.
   */
  rootMargin?: number;
  /**
   * Меняй при каждом раскрытии порции (например, число видимых постов). Это
   * пере-инициализирует observer, из-за чего `observe()` заново публикует
   * текущее состояние пересечения. Без этого, если после подгрузки sentinel
   * всё ещё во viewport (новых постов мало), «вход» не повторяется и лента
   * застревает — IntersectionObserver срабатывает только на смену состояния.
   */
  resetKey?: number;
}

interface UseFeedInfiniteScrollReturn {
  /** Повесить на невидимый div в конце списка. */
  sentinelRef: RefObject<HTMLDivElement | null>;
}

/**
 * Авто-подгрузка ленты через нативный IntersectionObserver: когда невидимый
 * sentinel в конце списка попадает во viewport (с упреждением `rootMargin`),
 * дёргается `onLoadMore`. Данные уже в памяти, так что «подгрузка» — это просто
 * раскрытие следующего среза, а не сетевой запрос; поэтому дебаунс/анти-гонка
 * не нужны — reveal синхронный.
 *
 * SSR-безопасно: observer создаётся в effect (только браузер). Если у sentinel
 * нет DOM-узла (потому что `!hasMore`) — наблюдать не за чем, effect тихо выходит;
 * на следующем рендере с `hasMore` он переинициализируется через deps.
 */
export function useFeedInfiniteScroll(
  options: UseFeedInfiniteScrollOptions,
): UseFeedInfiniteScrollReturn {
  const { hasMore, onLoadMore, rootMargin = 200, resetKey = 0 } = options;
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: `${rootMargin}px` },
    );

    observer.observe(node);

    return () => observer.disconnect();
    // resetKey в deps: пере-подписка после каждой подгрузки заново эмитит
    // текущее пересечение, иначе застрявший во viewport sentinel молчит.
  }, [hasMore, onLoadMore, rootMargin, resetKey]);

  return { sentinelRef };
}
