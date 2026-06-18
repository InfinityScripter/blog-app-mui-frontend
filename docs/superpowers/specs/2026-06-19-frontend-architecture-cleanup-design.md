# Frontend Architecture Cleanup — Design

**Date:** 2026-06-19
**Repo:** blog-app-mui-frontend
**Goal:** Привести фронтенд к нормальной архитектуре — закрепить конвенции через линтер,
убрать мёртвый/моковый код из прод-сборки, изолировать демо-шаблон, поставить gate (pre-commit + CI).

---

## Реальное состояние (важно: расходится с CLAUDE.md)

- **Стек: Next.js 14 app-router**, НЕ Vite/SPA. CLAUDE.md описывает Vite — это неверно.
  Признаки: `next dev/build`, `next.config.mjs`, `.next/`, `next-env.d.ts`, `src/app/`.
- Шаблон **Minimals.cc**. 912 TS/TSX файлов.
- Конвенция именования: **kebab-case** файлы и папки (консистентно по всему репо).
- Стилизация: **MUI v7 + `sx`**, без CSS Modules.
- Линтер «чистый» обманчиво: `no-unused-vars`, `import/no-cycle`, `import/order`,
  `no-restricted-imports` — **выключены** в `.eslintrc.cjs`. 0 errors сегодня = линтер не смотрит.
- **knip: 414 неиспользуемых файлов (45% репо).** `_examples` = 254 файла демо.
- Авторский код: `sections/{blog,admin,portfolio}`, `actions/`, `auth/`, `app/` routes.
  `sections/blog` ещё на `.jsx` (не TS).

## Решения (приняты пользователем)

| Тема        | Решение                                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Конвенция   | Закрепить **kebab-case** (текущую). Без массовых переименований. Пример-правило из antd-проекта (PascalCase/FC+memo/CSS Modules) НЕ применяется. |
| Линтер      | Корректность + import-order + строгая типизация. Включить как **error**, легаси заморозить (ratchet).                                            |
| Gate        | **pre-commit (есть lint-staged) + новый CI** (GitHub Actions).                                                                                   |
| Rollout     | **По папкам, по очереди.** Каждый этап — отдельный коммит.                                                                                       |
| `_examples` | **Вынести в `/examples` вне `src/`** + dev-only route. Не терять (фабрика компонентов на будущее), но из прода исключить.                        |
| Mock        | Составить карту использования, удалить **только реально мёртвый**. Не ломать kanban/calendar/chat вслепую.                                       |

## Anti-goals (YAGNI)

- Не переименовываем kebab→Pascal.
- Не вводим CSS Modules.
- Не настраиваем monorepo workspaces (overkill).
- Не рефакторим логику фич — только архитектура/конвенции/мёртвый код.

---

## Этапы (порядок исполнения)

### Этап 0 — Починить CLAUDE.md

Исправить описание стека: Vite/SPA → Next.js 14 app-router. Обновить команды (`npm run dev` = `next dev -p 3033`).
**Проверка:** ручной review, команды из CLAUDE.md реально работают.

### Этап 1 — Изолировать `_examples`

- Переместить `src/sections/_examples` → `/examples` (вне `src/`).
- Убрать прод-ссылку из `src/sections/chart-view/view.tsx` (единственная связь).
- Подключить через dev-only Next route (рендерится только при `NODE_ENV !== 'production'`).
- Добавить `/examples` в `tsconfig.exclude` основного билда + отдельный tsconfig для examples (опционально).
  **Проверка:** `yarn build` (examples не в бандле), `yarn lint` (examples вне основного flow), граф сборки чист.

### Этап 2 — Карта и удаление мёртвого mock + knip-конфиг

- Построить карту: что из `src/_mock` реально импортируется прод-роутами (kanban/calendar/chat/mail).
- Удалить только то, что не используется приложением.
- Создать `knip.json` (entry points для Next app-router) → отсеять ложные срабатывания.
- Перепроверить оставшиеся ~160 unused: реальные мёртвые удалить, ложные — занести в knip ignore.
  **Проверка:** `yarn build`, `yarn knip` (unused падает), `yarn e2e` (фичи живы).

### Этап 3 — Линтер-фундамент (ratchet)

- Включить как **error**: `no-unused-vars` (через unused-imports), `import/order`,
  `import/no-cycle`, `react-hooks/exhaustive-deps`, `no-restricted-imports` (границы sections).
- Заморозить легаси: baseline-подход — строгие правила глобально, но накопленные нарушения
  в вендорном коде через узкие `overrides`/файловые disable, чтобы репо оставался коммитируемым.
- `no-restricted-imports`: запрет импорта одной секции из другой (sections isolation из CLAUDE.md).
  **Проверка:** `yarn lint` = 0 errors после заморозки. Новый код — чистый.

### Этап 4 — CI gate

- `.github/workflows/frontend-ci.yml`: на PR прогон `lint` + `tsc --noEmit` + `knip` + `madge --circular`.
- pre-commit (lint-staged) остаётся — локальный быстрый фидбэк; CI — истина (нельзя обойти `--no-verify`).
  **Проверка:** открыть тестовый PR/прогнать workflow локально через `act` или dry-run; проверить, что битый код блокируется.

### Этап 5 — Авторский код → чистый (по папкам)

Порядок: `actions/` → `auth/` → `sections/blog` (**jsx→tsx**) → `sections/admin` → `sections/portfolio` → `app/`.
На этих папках поднять правила с warn→error локально (overrides по путям), починить нарушения.
**Проверка после каждой папки:** `yarn lint` (папка), `yarn build`, `tsc --noEmit`.

### Этап 6 — Строгая типизация

- `tsconfig`: `target` es5 → esnext (Next транспилирует сам).
- Подключить `typescript-eslint` type-checked ruleset (`parserOptions.project`) — сперва на авторских папках.
- Включить `no-explicit-any`, `no-floating-promises` как error на авторском коде.
  **Проверка:** `tsc --noEmit`, `yarn build`, `yarn lint`.

---

## Файл-правило (заменяет antd-пример пользователя)

Создать `.cursor`/`.claude` правило, отражающее РЕАЛЬНУЮ конвенцию:

- Папки и файлы: **kebab-case** (`post-item.tsx`, `custom-popover/`).
- Co-location рядом с крупным компонентом: `const.ts`, `types.ts`, `utils.ts`, `index.ts`.
- Стили: MUI `sx` + палитра темы (`alpha`, `theme.palette`); статические токены — CSS рядом, `@import` в `global.css`.
- Sections isolation: секция не импортирует другую секцию (enforced `no-restricted-imports`).
- Формы: только `RHF*` компоненты (React Hook Form + Zod), не raw MUI inputs.
- Импорты: группы через `import/order` + perfectionist.

---

## Проверка (общая, для каждого этапа)

1. `yarn lint` — 0 errors на затронутых папках.
2. `yarn build` (`next build`) — сборка цела.
3. `npx tsc --noEmit` — типы целы.
4. `yarn knip` — unused не растёт.
5. `npx madge --circular src` — нет новых циклов.
6. `yarn e2e` — на этапах с blog/admin (помнить про CORS-порт 3055).
7. `git diff` review перед коммитом — особенно на перемещении/удалении файлов.

Доказательство (вывод команд) приносится в ответе, ручная проверка пользователем не запрашивается.
