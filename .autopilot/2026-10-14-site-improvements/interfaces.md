# Границы

## Границы, решённые в спецификации

- **`src/utils/seo-alternates.ts` → `localizedAlternates(locale, path)`** — уже есть,
  не меняется. Возвращает `{ alternates: { canonical, languages } }`; `path` — путь без
  локали со слэшами вокруг (`/changelog/` или `/changelog/<slug>/`). Её подключают
  страницы чейнджлога, записи чейнджлога, политики и согласия.
- **Подписи** — next-intl, ключи в `messages/ru.json` и `messages/en.json`; оба файла
  правит только таск 01.
- **Карточка новости и её картинка** — `src/sections/news/**` и `src/components/image/**`
  принадлежат таску 02.
- **Шов для тестов** — Vitest, тесты рядом с кодом в `src/**/*.test.ts(x)`;
  явный `import { it, expect, describe } from "vitest"`.

## Правила проекта (из CLAUDE.md и AGENTS.md — прочитай их)
- Без `as`, без `any`; без `for-of`/`while`; ≤200 строк на файл (eslint `max-lines` — ошибка).
- Хуки — в `hooks/`; секции не импортируют друг друга.
- Шапку/подвал проверять в браузере, не grep по HTML.
- Не трогать: `package.json`, `yarn.lock`, бэкенд, `e2e/`, `src/config-global.ts`.
- Публичной статистики LLM (`/llm-stats`) нет намеренно — не возвращать.

## Как запускать
- Зависимости стоят (`yarn install` уже выполнен).
- Одна проверка всего: `npx tsc --noEmit -p . && npm run lint && npm run fm:check && npm run test:unit`
- Один файл тестов: `npx vitest run <путь>`
- Сборка (в конце): `npm run build`. Локальный сайт: `npm run dev` (порт 3033) или `npm run start` после сборки.
