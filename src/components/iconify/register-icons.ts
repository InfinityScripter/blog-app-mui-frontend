import type { IconifyJSON } from "@iconify/react";

import { addCollection } from "@iconify/react";

import iconBundle from "./icon-bundle.json";

// ----------------------------------------------------------------------

/**
 * Офлайн-бандл иконок: все имена, встречающиеся в src, собраны на этапе
 * разработки (npm run icons:build) в icon-bundle.json и регистрируются здесь
 * один раз при загрузке модуля. Без этого каждый глиф тянулся в рантайме с
 * api.iconify.design и при недоступности CDN (блокировщики, офлайн)
 * рендерился пустым span — невидимая иконка.
 *
 * Имя, отсутствующее в бандле, по-прежнему уходит в сетевой фолбэк —
 * тест icon-bundle.test.ts ловит такие и требует перегенерации.
 */
const collections: IconifyJSON[] = Object.values(iconBundle);

/**
 * Именно экспортируемая функция с явным вызовом в iconify.tsx, а НЕ голый
 * `import "./register-icons"`: package.json объявляет `sideEffects` только для
 * css, поэтому бандлер молча выбрасывает side-effect-only импорты — регистрация
 * не выполнялась вовсе, и все иконки продолжали тянуться с CDN.
 */
export function registerIconCollections(): void {
  collections.forEach((collection) => {
    addCollection(collection);
  });
}
