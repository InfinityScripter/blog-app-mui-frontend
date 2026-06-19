# Personal Blog + Portfolio — Specification

## Executive Summary

Трансформация текущего разрозненного проекта в личный портал Михаила Талалаева об AI/LLM/agents для русскоязычной аудитории. Лендинг — новостная лента + hero. Блог — основной продукт. Воронка через Telegram. Dashboard — только управление постами.

---

## Problem Statement

Текущий проект содержит нерабочий функционал (чат, канбан, календарь, overview-дашборды, mail, products), который создаёт технический долг и отвлекает от основной цели. Нет чёткого позиционирования. Лендинг не цепляет аудиторию. Нет воронки читатель → подписчик.

---

## Success Criteria

- Лендинг загружается за < 2 сек, показывает ленту постов и hero без скролла
- Читатель за < 30 сек понимает о чём сайт и кто автор
- CTA в Telegram работает
- Dashboard содержит только управление постами
- Нет сломанных маршрутов или заглушек в nav

---

## User Personas

**Читатель-разработчик** — интересуется AI-инструментами, ищет практический опыт и выводы, не академику. Мобильный или desktop. Русскоязычный.

**Рекрутер/коллега** — заходит через портфолио, хочет быстро понять стек и проекты.

**Автор (Михаил)** — управляет контентом через dashboard, пишет короткие TIL-заметки и глубокие разборы об AI.

---

## User Journey

### Читатель (основной)

```
Главная (лента постов + hero)
  → кликает пост из ленты
  → читает пост (/post/[id])
  → видит "похожие посты" внизу
  → кликает CTA в Telegram
  → подписывается
```

### Рекрутер/коллега

```
Главная → видит hero с позиционированием → кликает "Портфолио" → /portfolio
```

### Автор

```
/dashboard → список постов → новый пост / редактировать
```

---

## Functional Requirements

### P0 — Must Have

**Лендинг (переработать `src/sections/home/`)**

- Hero-секция: имя + 2 предложения о чём сайт + 2 CTA ("Читать блог" → /post, "Telegram" → внешняя ссылка)
- Лента последних постов прямо под hero (вертикальный список, не grid)
- Карточка поста: thumbnail (optional) + теги (макс 2) + заголовок + excerpt (2 строки) + footer (дата relative, время чтения, просмотры)
- Горизонтальный скролл-бар фильтра тегов под hero (AI/LLM, Agents, Claude Code, Проекты)
- Кнопка "Показать ещё" (не infinite scroll)
- Секция Telegram-подписки в конце страницы

**Блог (/post, /post/[id]) — сохранить, доработать**

- Добавить теги/категории к постам (поле tags в БД и UI)
- Показывать время чтения на карточке и в статье
- Блок "Похожие посты" внизу статьи (по тегам, 3 карточки)
- Счётчик просмотров (инкремент при заходе на /post/[id])

**Dashboard — очистить**

- Убрать из nav: chat, kanban, calendar, group, two, three
- Оставить: посты (list + create + edit), admin (посты + юзеры)
- Добавить поле tags при создании/редактировании поста

**Portfolio (/portfolio) — оставить, не трогать**

### P1 — Should Have

- Секция Skills на лендинге (короткий визуальный блок технологий)
- Секция About на лендинге (3-4 предложения о себе)
- Breadcrumbs / Back на странице поста
- OG-теги для постов (og:title, og:description, og:image)
- Sitemap для SEO

### P2 — Nice to Have

- Email-подписка (форма + API endpoint → сохранять email в БД)
- Счётчик view count отображается на карточках в ленте
- Серия постов ("Часть 1 из N") с навигацией prev/next

---

## What to REMOVE

### Frontend — убрать страницы и секции

- `/app/dashboard/chat/` → удалить
- `/app/dashboard/kanban/` → удалить
- `/app/dashboard/calendar/` → удалить
- `/app/dashboard/group/`, `/dashboard/two/`, `/dashboard/three/` → удалить
- `src/sections/chat/` → удалить
- `src/sections/kanban/` → удалить
- `src/sections/calendar/` → удалить
- `src/sections/overview/` → удалить (banking, booking, e-commerce dashboard)
- `src/sections/faqs/` → удалить (статика без ценности)
- `/app/faqs/` → удалить
- `src/sections/home/home-advertisement.tsx` → удалить
- `src/sections/home/home-pricing.tsx` → удалить
- `src/sections/home/home-for-designer.tsx` → удалить
- `src/sections/home/home-faqs.tsx` → удалить
- `src/sections/home/home-zone-ui.tsx` → удалить
- `src/sections/home/home-hugepack-elements.tsx` → удалить
- `src/sections/home/home-languages.tsx` → удалить
- `src/sections/home/home-testimonials.tsx` → удалить
- Dashboard nav-пункты: убрать chat, kanban, calendar, group

### Backend — убрать API routes

- `src/pages/api/chat/` → удалить
- `src/pages/api/kanban/` → удалить
- `src/pages/api/calendar/` → удалить
- `src/pages/api/mail/` → удалить
- `src/pages/api/product/` → удалить
- `src/_mock/` → удалить (или оставить только если используется в активных routes)

**Оставить:** `src/pages/api/post/`, `auth/`, `admin/`, `upload.ts`

---

## Technical Architecture

### Data Model — изменения

**posts** (добавить поля):

```sql
ALTER TABLE posts ADD COLUMN tags TEXT[] DEFAULT '{}';
ALTER TABLE posts ADD COLUMN reading_time INT; -- минуты, вычислять при сохранении
ALTER TABLE posts ADD COLUMN views INT DEFAULT 0;
```

**Новый endpoint:** `POST /api/post/[id]/view` — инкремент views при каждом посещении статьи (без дублей по session — можно localStorage).

### System Components

| Компонент                | Статус       | Действие                              |
| ------------------------ | ------------ | ------------------------------------- |
| Landing page             | Переработать | Hero + лента постов из /api/post/list |
| Blog list `/post`        | Сохранить    | Добавить фильтр по тегам              |
| Blog post `/post/[id]`   | Сохранить    | Добавить похожие + счётчик            |
| Dashboard posts          | Сохранить    | Добавить поле tags                    |
| Dashboard nav            | Очистить     | Убрать лишние пункты                  |
| Auth                     | Сохранить    | Без изменений                         |
| Admin panel              | Сохранить    | Без изменений                         |
| Portfolio `/portfolio`   | Сохранить    | Без изменений                         |
| Chat / Kanban / Calendar | Удалить      | Код + API + DB tables опционально     |

### Security Model

Без изменений. Auth через JWT. Только автор (admin) создаёт посты.

---

## Non-Functional Requirements

- **Performance**: Главная < 2s FCP. Lazy-load изображений в карточках.
- **Mobile-first**: 85% русской аудитории — мобильные. Single-column лента. Touch targets ≥ 44px.
- **SEO**: Публичные маршруты (/, /post, /post/[id]) — SSR/ISR. OG-теги.
- **Dark mode**: Уже есть, сохранить.

---

## Out of Scope

- OAuth (Google/Yandex) — оставить как есть, не дорабатывать
- Комментарии от внешних пользователей — не трогать (уже есть в БД, остаётся)
- Email-рассылка через сторонний сервис (Buttondown/ConvertKit) — P2
- Монетизация — не в этом спринте
- **Удаление chat/kanban/calendar таблиц из БД — НЕ делаем.** Таблицы оставляем, удаляем только код (frontend + API routes)

---

## Implementation Phases

### Phase 1 — Чистка (1-2 дня)

1. Удалить dashboard routes: chat, kanban, calendar, group, two, three
2. Удалить секции: overview, faqs, home-sections (лишние)
3. Удалить backend API: chat, kanban, calendar, mail, product
4. Убрать из dashboard nav лишние пункты
5. Убедиться что `/post`, `/post/[id]`, `/dashboard/post`, `/admin` работают

### Phase 2 — Данные (1 день)

1. Добавить поля `tags`, `reading_time`, `views` в таблицу posts
2. Добавить endpoint `POST /api/post/[id]/view`
3. Обновить endpoints list/create/edit для поддержки tags
4. Добавить поле tags в форму редактирования поста в dashboard

### Phase 3 — Лендинг (2-3 дня)

1. Переработать `src/sections/home/` — убрать лишнее, добавить:
   - `HomeHero` — позиционирование + 2 CTA
   - `HomePostsFeed` — лента постов из API с фильтром тегов
   - `HomeTelegramCta` — блок подписки в конце
2. Обновить `src/app/(index)/page.tsx`
3. Адаптировать под mobile (single-column, ≥44px targets)

### Phase 4 — Блог доработки (1 день)

1. Добавить блок "Похожие посты" на `/post/[id]`
2. Показывать reading_time и теги в карточках и на странице поста
3. OG-теги для статей

---

## Open Questions for Implementation

- Нужен ли счётчик просмотров на карточках в ленте или только внутри статьи?
- Какой Telegram-канал линковать? (нужна ссылка)
- Удалять ли chat/kanban/calendar таблицы из PostgreSQL?
- Регистрация пользователей — оставить форму доступной или скрыть?

---

## Appendix: Research Findings

**Лучшие паттерны русских тех-порталов (Habr, vc.ru, tproger):**

- Вертикальный список, не grid — доминирующий паттерн
- Карточка: теги + заголовок + excerpt + дата (relative) + время чтения + просмотры
- "Показать ещё" (load more button) > infinite scroll для качественного вовлечения
- Горизонтальный скролл-бар фильтра тегов под hero
- Блок "похожие посты" — самый высокий ROI для session depth

**Воронка (leerob.io, joshwcomeau.com pattern):**

- Inline CTA прямо в посте ("если понравилось...")
- Конкретный оффер Telegram ("глубокие разборы AI-инструментов каждую неделю, без воды")
- Welcome-сообщение в канале новому подписчику

**Аудитория:** 85% мобильные → single column, lazy images, touch targets.
