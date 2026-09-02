# Автопубликация записей таймлайна LLM — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Цель:** ночная джоба `ai-changelog-watcher` публикует готовые редакторские записи о новых моделях (заголовок, описание, любопытный факт) прямо на сайт — без копирования в `models-2026.ts`, без коммита, пуша и деплоя.

**Архитектура:** в бэкенде появляется отдельная таблица `llm_timeline_models`, повторяющая форму фронтовой записи `LlmModel` один в один. Джоба кладёт туда запись через `PUT /api/llm-timeline/<id>` под уже существующим токеном бота. Фронт на трёх страницах (`/llm-timeline`, `/changelog`, `/llm-compare`) читает этот список, приклеивает его к статическому массиву и отдаёт в `buildUnifiedLlmCatalog` как раньше. Бот и таблица фактов `model_releases` не трогаются: у бота два процесса-писателя, оба только создают строки и дедупятся ответом 409 по slug, и встраиваться в их строки значило бы вступить с ними в гонку (см. decision-log). Выключатель — флаг `autoPublishTimeline` в бек-админке, по образцу `autoPublishReleases`.

**Стек:** backend — Next.js 14 pages/api, `pg` + pg-mem в тестах, zod, jest, node-mocks-http; frontend — Next.js 15 App Router, Vitest; джоба — промпт-файл Claude Code + `curl`.

## Глобальные ограничения

- Бэкенд: yarn, один локфайл; `yarn test`, `yarn ts`, `yarn lint` зелёные; коммит форматирует husky.
- Фронт: `npx tsc --noEmit` 0 ошибок, `yarn lint` 0 ошибок и 0 предупреждений, `npx madge --circular --extensions ts,tsx src`, `yarn knip` 0 неиспользуемых, `yarn build`; без `as`/`any`/`@ts-ignore`; `max-lines` 200 (пустые строки и комментарии не считаются); ES5-таргет — без `for-of`. Новые файлы добавлять `git add -f` (глобальный `.gitignore` их прячет).
- Данные: правило «NEVER invented» — неизвестное число `null`, ничего не выдумывать. Ссылки только `http(s)`.
- Коммит-сообщения в стиле репозиториев: `feat(scope): описание по-русски`, без строки соавторства.
- Пуш и первый реальный вызов публикации — только после явного «да» от Миши (оба действия наружу).

---

## Допущения — поправь сейчас или продолжаю с ними

1. **Отдельная таблица, а не колонки в `model_releases`.** В чате я предлагала колонки; трассировка показала, что это ставит джобу в гонку с двумя писателями бота. Подробно — в decision-log (задача 8).
2. **Статическая запись побеждает удалённую с тем же `id`.** Рукописная карточка никогда не затирается джобой. Неверную удалённую запись убираем `DELETE`, а не правкой файла.
3. **Спорные записи джоба не публикует, а складывает в `.md`, как сегодня.** Критерий «уверена» — в задаче 11. Статуса «черновик» в базе и карточки в Телеграм в этой итерации нет — это вторая фаза, если понадобится.
4. **Джоба ходит в бэкенд токеном бота `BOT_API_TOKEN`.** Отдельного токена под джобу не заводим; цена — токен с правами админа появится на маке в `~/.stefania-skill-tokens.sh`.
5. **`releaseDate` хранится строкой `YYYY-MM-DD`, а не типом `DATE`.** Контракт фронта — календарный день строкой; колонка `DATE` через драйвер `pg` превращается в `Date` на местную полночь и при `toISOString()` уезжает на день.
6. **Старые 56 записей в базу не переносим.** Статический файл остаётся историей, база — живой хвост.
7. **Текст только по-русски**, как и сегодня у статических записей: на `/en/` карточки и так на русском, механизма перевода для них нет.
8. **`/llm-compare` тоже получает удалённый список** — ради одинаковой карточки на трёх страницах, правка одна и та же.

---

## Что известно из трассировки (кратко)

- `buildUnifiedLlmCatalog(timelineSource, comparableSource, releases)` — `src/utils/llm-catalog.ts:111`; три вызова: `changelog/page.tsx:50`, `llm-timeline/page.tsx:41`, `llm-compare/page.tsx:42`. Первый аргумент — просто массив `LlmModel`; порядок не важен, страницы сортируют сами.
- Факты бота (`releasedAt`, `contextTokens`, `sourceUrl`) уже побеждают статический текст при совпадении по вендору, имени и дате ±1 день (`findRelease`, `:86-108`). Удалённые записи попадают под ту же логику бесплатно.
- Фетч релизов: `src/actions/blog-ssr.ts:120-149`, нативный `fetch` с `revalidate: 600`, через `fetchJsonWithRetry`; при недоступном бэкенде **бросает**, страницы не глотают ошибку (инцидент 2026-07-03). Новый фетч повторяет это.
- Бэкенд: `dbQuery<T>(sql, params)` → `pool.query<T>`; схема в `schemaSql` в `src/lib/db.ts` выполняется на каждом старте и под pg-mem; `resetDatabase()` чистит таблицы перед каждым тестом (`src/tests/setup.ts`).
- Токен бота: `Authorization: Bearer $BOT_API_TOKEN` → `requireAuth` резолвит владельца `OWNER_EMAIL` в админа (`src/middlewares/require-auth.ts:44-69`); путь через bearer без CSRF.
- `requireFeature(flag, { enabledInTest })` — внешняя обёртка, при выключенном флаге отвечает 404; под `NODE_ENV=test` без `enabledInTest: true` не работает вовсе.
- Флаги: `FlagKey` в `src/services/settings.ts:12`, `FLAG_DEFAULTS:17-22`, сид из env в `src/config-global.ts:22-23`, allow-list роута `src/pages/api/admin/settings/auto-publish.ts:15`, строгий полный `toEqual` в `src/tests/services/settings.test.ts:54-69`. Тумблеры в админке фронта — `src/sections/admin/admin-settings-view.tsx:28-43`, тип ключа — `src/actions/settings.ts:28`.
- Бот пишет в `model_releases` двумя путями (каталог и RSS), оба — только `POST /api/changelog/new`, 409 = «уже есть». Мы их не трогаем.
- Деплой: бэкенд — CI на пуш в `main` (scp → VDS → `systemctl restart blog-backend`); фронт — Vercel на пуш в `main`.
- На маке нет `BOT_API_TOKEN`; он есть только в `/opt/blog-backend/.env.production` на VDS.
- Рабочая копия фронта грязная: `models-2026.ts` (+329 строк — записи с 26 и 31 августа), `yarn.lock` (пере-резолв, все адреса на `registry.npmjs.org`), `next-env.d.ts`.

## Порядок

Бэкенд → пуш → проверка прода → фронт → пуш → токен и флаг (Миша) → джоба → первая публикация. Фронт можно писать параллельно с бэкендом, но выкатывать — после: страница бросит ошибку, если ручки ещё нет.

---

## Задача 0: чистое дерево во фронте (нужно «да» Миши)

**Files:**

- Commit only: `src/sections/llm-timeline/data/models-2026.ts`

- [ ] **Шаг 1: проверить, что в диффе только записи таймлайна**

Run: `cd /Users/talalaev-m/projects/blog-app-mui-frontend && git diff --stat HEAD -- src/sections/llm-timeline/data/models-2026.ts && git diff HEAD -- src/sections/llm-timeline/data/models-2026.ts | grep '^+' | grep -c 'name: '`
Expected: `1 file changed, 329 insertions(+)` и число новых `name:` — 5 (Ornith-1.5, DeepSeek-V4-Flash-Vision-Exp, Apodex 1.1, Qwen3.8-Flash-Next, GLM-5.3-Flash).

- [ ] **Шаг 2: закоммитить только этот файл** (после подтверждения)

```bash
cd /Users/talalaev-m/projects/blog-app-mui-frontend
git add src/sections/llm-timeline/data/models-2026.ts
git commit -m "feat(llm-timeline): пять релизов моделей с 18 по 26 августа"
```

`yarn.lock` и `next-env.d.ts` остаются незакоммиченными — они не относятся к фиче. Решение по ним отдельное.

---

## Задача 1 (бэкенд): таблица, тип, схема, сервис

**Files:**

- Create: `src/utils/pg-errors.ts`
- Modify: `src/services/model-release.ts:65-67` (перенести `isUniqueViolation`)
- Modify: `src/lib/db.ts` (после строки 184 — блок `model_releases`; и `resetDatabase` строка 430)
- Create: `src/types/llm-timeline-model.ts`
- Create: `src/schemas/llm-timeline-model.ts`
- Create: `src/services/llm-timeline-model.ts`
- Test: `src/tests/services/llm-timeline-model.test.ts`

**Interfaces:**

- Produces: `llmTimelineModelService.list(): Promise<LlmTimelineModel[]>`, `.upsert(id: string, payload: UpsertLlmTimelineModelInput): Promise<{ model: LlmTimelineModel; created: boolean }>`, `.remove(id: string): Promise<void>`; `upsertLlmTimelineModelSchema`, `llmTimelineIdParamSchema`; `isUniqueViolation(error: unknown): boolean`.

- [ ] **Шаг 1: вынести `isUniqueViolation` в общий файл**

`src/utils/pg-errors.ts`:

```ts
// Postgres unique_violation. Both the release and the timeline services turn
// it into a 409 instead of a 500.
export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}
```

В `src/services/model-release.ts` удалить локальную функцию (строки 65-67) и добавить импорт рядом с остальными:

```ts
import { isUniqueViolation } from "@/src/utils/pg-errors";
```

Run: `cd /Users/talalaev-m/projects/blog-app-mui-backend && yarn ts && yarn test src/tests/services/model-release.test.ts`
Expected: типы чистые, тесты релизов зелёные (поведение не менялось).

- [ ] **Шаг 2: написать падающий тест сервиса**

`src/tests/services/llm-timeline-model.test.ts`:

```ts
import "@jest/globals";
import { dbQuery } from "@/src/lib/db";
import { isAppError } from "@/src/types/api";
import { llmTimelineModelService } from "@/src/services/llm-timeline-model";

async function captureThrow(fn: () => Promise<unknown>): Promise<unknown> {
  try {
    await fn();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the call to throw, but it resolved");
}

const ID = "anthropic-claude-fable-5-1";

const payload = {
  slug: "claude-fable-5-1",
  vendor: "Anthropic",
  name: "Claude Fable 5.1",
  releaseDate: "2026-09-01",
  contextTokens: 1000000,
  params: null,
  highlight: "Чтение из кеша подешевело вчетверо.",
  description: "Обновление старшей модели Anthropic.",
  capabilities: ["agentic", "coding"],
  sourceUrl: "https://www.anthropic.com/claude-fable-and-mythos-5-1",
  wikiUrl: "https://en.wikipedia.org/wiki/Claude_(language_model)",
  funFact: null,
};

describe("llmTimelineModelService", () => {
  beforeEach(async () => {
    await dbQuery("DELETE FROM llm_timeline_models");
  });

  it("creates on the first upsert and updates on the second, keeping one row", async () => {
    const first = await llmTimelineModelService.upsert(ID, payload);
    expect(first.created).toBe(true);
    expect(first.model).toMatchObject({
      id: ID,
      slug: "claude-fable-5-1",
      releaseDate: "2026-09-01",
      contextTokens: 1000000,
      capabilities: ["agentic", "coding"],
      params: null,
      funFact: null,
    });

    const second = await llmTimelineModelService.upsert(ID, {
      ...payload,
      highlight: "Другой заголовок",
    });
    expect(second.created).toBe(false);
    expect(second.model.highlight).toBe("Другой заголовок");
    expect(second.model.createdAt).toBe(first.model.createdAt);
    expect(await llmTimelineModelService.list()).toHaveLength(1);
  });

  it("defaults capabilities to [] and unknowns to null", async () => {
    const { model } = await llmTimelineModelService.upsert(ID, {
      ...payload,
      contextTokens: undefined,
      params: undefined,
      capabilities: undefined,
      wikiUrl: undefined,
      funFact: undefined,
    });
    expect(model.capabilities).toEqual([]);
    expect(model.contextTokens).toBeNull();
    expect(model.params).toBeNull();
    expect(model.wikiUrl).toBeNull();
    expect(model.funFact).toBeNull();
  });

  it("lists oldest release first", async () => {
    await llmTimelineModelService.upsert("b-newer", {
      ...payload,
      slug: "newer",
      releaseDate: "2026-09-02",
    });
    await llmTimelineModelService.upsert("a-older", {
      ...payload,
      slug: "older",
      releaseDate: "2026-08-31",
    });
    const ids = (await llmTimelineModelService.list()).map((model) => model.id);
    expect(ids).toEqual(["a-older", "b-newer"]);
  });

  it("rejects a second id that reuses a slug with 409", async () => {
    await llmTimelineModelService.upsert(ID, payload);
    const error = await captureThrow(() =>
      llmTimelineModelService.upsert("other-id", payload),
    );
    expect(isAppError(error) && error.status).toBe(409);
  });

  it("remove deletes the row and answers 404 for an unknown id", async () => {
    await llmTimelineModelService.upsert(ID, payload);
    await llmTimelineModelService.remove(ID);
    expect(await llmTimelineModelService.list()).toHaveLength(0);
    const error = await captureThrow(() => llmTimelineModelService.remove(ID));
    expect(isAppError(error) && error.status).toBe(404);
  });
});
```

Run: `yarn test src/tests/services/llm-timeline-model.test.ts`
Expected: FAIL — `Cannot find module '@/src/services/llm-timeline-model'`.

- [ ] **Шаг 3: таблица в `schemaSql`**

В `src/lib/db.ts` сразу после строки 184 (`CREATE INDEX ... model_releases_vendor_idx`) добавить:

```sql
  -- Timeline entries published by the ai-changelog-watcher job (editorial text
  -- for models that have no hand-written entry in the frontend's static data).
  -- Same shape as the frontend LlmModel. release_date is a 'YYYY-MM-DD' string
  -- on purpose: a DATE column round-trips through pg as a local-midnight Date
  -- and shifts by a day on toISOString().
  CREATE TABLE IF NOT EXISTS llm_timeline_models (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    vendor TEXT NOT NULL,
    name TEXT NOT NULL,
    release_date TEXT NOT NULL,
    context_tokens INTEGER,
    params TEXT,
    highlight TEXT NOT NULL,
    description TEXT NOT NULL,
    capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    source_url TEXT NOT NULL,
    wiki_url TEXT,
    fun_fact TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE UNIQUE INDEX IF NOT EXISTS llm_timeline_models_slug_unique ON llm_timeline_models (slug);
  CREATE INDEX IF NOT EXISTS llm_timeline_models_release_date_idx ON llm_timeline_models (release_date);
```

В `resetDatabase()` после строки 430 (`DELETE FROM model_releases`) добавить:

```ts
await pool.query("DELETE FROM llm_timeline_models");
```

- [ ] **Шаг 4: тип**

`src/types/llm-timeline-model.ts`:

```ts
// Public contract of a timeline entry (camelCase, ISO timestamps, null for
// unknowns). Mirrors the frontend LlmModel plus created/updated stamps.
export interface LlmTimelineModel {
  id: string;
  slug: string;
  vendor: string;
  name: string;
  releaseDate: string;
  contextTokens: number | null;
  params: string | null;
  highlight: string;
  description: string;
  capabilities: string[];
  sourceUrl: string;
  wikiUrl: string | null;
  funFact: string | null;
  createdAt: string;
  updatedAt: string;
}
```

- [ ] **Шаг 5: zod-схема**

`src/schemas/llm-timeline-model.ts`:

```ts
import { z } from "zod";

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

// zod's url() accepts any scheme; the frontend puts these into href.
const httpUrl = z
  .string()
  .trim()
  .url()
  .max(2000)
  .refine((value) => /^https?:\/\//i.test(value), "must be an http(s) URL");

export const upsertLlmTimelineModelSchema = z.object({
  slug: z.string().trim().regex(KEBAB, "slug must be kebab-case").max(200),
  vendor: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(160),
  releaseDate: z
    .string()
    .trim()
    .regex(DAY, "releaseDate must be YYYY-MM-DD")
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "releaseDate must be a real day",
    ),
  contextTokens: z
    .number()
    .int()
    .nonnegative()
    .max(2147483647)
    .nullable()
    .optional(),
  params: z.string().trim().min(1).max(200).nullable().optional(),
  highlight: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).max(8000),
  capabilities: z.array(z.string().trim().min(1).max(40)).max(16).optional(),
  sourceUrl: httpUrl,
  wikiUrl: httpUrl.nullable().optional(),
  funFact: z.string().trim().min(1).max(2000).nullable().optional(),
});

export const llmTimelineIdParamSchema = z.object({
  id: z.preprocess(
    (value) => (Array.isArray(value) ? value[0] : value),
    z.string().trim().regex(KEBAB, "id must be kebab-case").max(200),
  ),
});

export type UpsertLlmTimelineModelInput = z.infer<
  typeof upsertLlmTimelineModelSchema
>;
export type LlmTimelineIdParam = z.infer<typeof llmTimelineIdParamSchema>;
```

- [ ] **Шаг 6: сервис**

`src/services/llm-timeline-model.ts`:

```ts
import { dbQuery } from "@/src/lib/db";
import { AppError } from "@/src/types/api";
import { HTTP } from "@/src/constants/http";
import { isUniqueViolation } from "@/src/utils/pg-errors";

import type { LlmTimelineModel } from "@/src/types/llm-timeline-model";
import type { UpsertLlmTimelineModelInput } from "@/src/schemas/llm-timeline-model";

interface LlmTimelineModelRow {
  id: string;
  slug: string;
  vendor: string;
  name: string;
  release_date: string;
  context_tokens: number | null;
  params: string | null;
  highlight: string;
  description: string;
  capabilities: string[];
  source_url: string;
  wiki_url: string | null;
  fun_fact: string | null;
  created_at: Date;
  updated_at: Date;
}

function toIso(value: Date): string {
  return new Date(value).toISOString();
}

function mapRow(row: LlmTimelineModelRow): LlmTimelineModel {
  return {
    id: row.id,
    slug: row.slug,
    vendor: row.vendor,
    name: row.name,
    releaseDate: row.release_date,
    contextTokens: row.context_tokens,
    params: row.params,
    highlight: row.highlight,
    description: row.description,
    capabilities: Array.isArray(row.capabilities) ? row.capabilities : [],
    sourceUrl: row.source_url,
    wikiUrl: row.wiki_url,
    funFact: row.fun_fact,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

async function list(): Promise<LlmTimelineModel[]> {
  const result = await dbQuery<LlmTimelineModelRow>(
    "SELECT * FROM llm_timeline_models ORDER BY release_date ASC, id ASC",
  );
  return result.rows.map(mapRow);
}

// UPDATE first, INSERT if nothing matched: one writer (the job), so no race
// to guard; ON CONFLICT would also need xmax tricks to report created/updated.
async function upsert(
  id: string,
  payload: UpsertLlmTimelineModelInput,
): Promise<{ model: LlmTimelineModel; created: boolean }> {
  const values = [
    id,
    payload.slug,
    payload.vendor,
    payload.name,
    payload.releaseDate,
    payload.contextTokens ?? null,
    payload.params ?? null,
    payload.highlight,
    payload.description,
    JSON.stringify(payload.capabilities ?? []),
    payload.sourceUrl,
    payload.wikiUrl ?? null,
    payload.funFact ?? null,
  ];
  try {
    const updated = await dbQuery<LlmTimelineModelRow>(
      `UPDATE llm_timeline_models
         SET slug = $2, vendor = $3, name = $4, release_date = $5, context_tokens = $6,
             params = $7, highlight = $8, description = $9, capabilities = $10::jsonb,
             source_url = $11, wiki_url = $12, fun_fact = $13, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      values,
    );
    if (updated.rows[0]) {
      return { model: mapRow(updated.rows[0]), created: false };
    }
    const inserted = await dbQuery<LlmTimelineModelRow>(
      `INSERT INTO llm_timeline_models
         (id, slug, vendor, name, release_date, context_tokens, params, highlight,
          description, capabilities, source_url, wiki_url, fun_fact)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13)
       RETURNING *`,
      values,
    );
    return { model: mapRow(inserted.rows[0]), created: true };
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError(
        HTTP.CONFLICT,
        "Another timeline model already uses this slug",
      );
    }
    throw error;
  }
}

async function remove(id: string): Promise<void> {
  const result = await dbQuery<{ id: string }>(
    "DELETE FROM llm_timeline_models WHERE id = $1 RETURNING id",
    [id],
  );
  if (result.rows.length === 0) {
    throw new AppError(HTTP.NOT_FOUND, "Timeline model not found");
  }
}

export const llmTimelineModelService = { list, upsert, remove };
```

- [ ] **Шаг 7: прогнать тесты**

Run: `yarn test src/tests/services/llm-timeline-model.test.ts src/tests/services/model-release.test.ts && yarn ts && yarn lint`
Expected: все зелёные, 0 ошибок типов и линтера.

- [ ] **Шаг 8: коммит**

```bash
git add src/utils/pg-errors.ts src/services/model-release.ts src/lib/db.ts src/types/llm-timeline-model.ts src/schemas/llm-timeline-model.ts src/services/llm-timeline-model.ts src/tests/services/llm-timeline-model.test.ts
git commit -m "feat(llm-timeline): таблица llm_timeline_models и сервис upsert/list/remove"
```

---

## Задача 2 (бэкенд): три ручки

**Files:**

- Create: `src/pages/api/llm-timeline/list.ts`
- Create: `src/pages/api/llm-timeline/[id].ts`
- Create: `src/pages/api/llm-timeline/[id]/delete.ts`
- Test: `src/tests/api/llm-timeline/llm-timeline.test.ts`

**Interfaces:**

- Consumes: `llmTimelineModelService`, схемы из задачи 1; флаг `autoPublishTimeline` из задачи 3 (тесты этой задачи требуют, чтобы задача 3 была сделана — иначе `requireFeature('autoPublishTimeline')` не скомпилируется). **Делать задачу 3 до шага 3 этой задачи.**
- Produces: `GET /api/llm-timeline/list` → 200 `{ models: LlmTimelineModel[] }` (голые ключи, как `/api/changelog/list`); `PUT /api/llm-timeline/[id]` → 201 `{ success, data: { model, created: true } }` при создании, 200 при обновлении; 404 при выключенном флаге; 401 без токена; 400 при невалидном теле; 409 при чужом slug; `DELETE /api/llm-timeline/[id]/delete` → 200 `{ success, data: { id } }`, 404 если нет.

- [ ] **Шаг 1: падающий API-тест**

`src/tests/api/llm-timeline/llm-timeline.test.ts`:

```ts
import "@jest/globals";
import bcrypt from "bcrypt";
import User from "@/src/models/User";
import { dbQuery } from "@/src/lib/db";
import { createMocks } from "node-mocks-http";
import { HTTP_METHOD } from "@/src/constants/http";
import { settingsService } from "@/src/services/settings";
import listHandler from "@/src/pages/api/llm-timeline/list";
import putHandler from "@/src/pages/api/llm-timeline/[id]";
import deleteHandler from "@/src/pages/api/llm-timeline/[id]/delete";

const BOT_TOKEN = "test_timeline_bot_token_value";
const OWNER_EMAIL = "owner@example.com";
const ID = "anthropic-claude-fable-5-1";

const BODY = {
  slug: "claude-fable-5-1",
  vendor: "Anthropic",
  name: "Claude Fable 5.1",
  releaseDate: "2026-09-01",
  contextTokens: 1000000,
  params: null,
  highlight: "Чтение из кеша подешевело вчетверо.",
  description: "Обновление старшей модели Anthropic.",
  capabilities: ["agentic", "coding"],
  sourceUrl: "https://www.anthropic.com/claude-fable-and-mythos-5-1",
  wikiUrl: null,
  funFact: null,
};

function botHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${BOT_TOKEN}`,
  };
}

async function put(id: string, body: unknown, headers = botHeaders()) {
  const { req, res } = createMocks({
    method: HTTP_METHOD.PUT,
    headers,
    query: { id },
    body,
  });
  await putHandler(req, res);
  return res;
}

describe("/api/llm-timeline", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(async () => {
    process.env.BOT_API_TOKEN = BOT_TOKEN;
    process.env.OWNER_EMAIL = OWNER_EMAIL;
    const passwordHash = await bcrypt.hash("ownerpassword", 10);
    await User.create({
      name: "Owner Admin",
      email: OWNER_EMAIL,
      passwordHash,
      role: "admin",
    });
    await dbQuery("DELETE FROM app_settings");
    settingsService.__resetCacheForTests();
    await settingsService.setFlag("autoPublishTimeline", true);
  });

  afterEach(() => {
    process.env.BOT_API_TOKEN = ORIGINAL_ENV.BOT_API_TOKEN;
    process.env.OWNER_EMAIL = ORIGINAL_ENV.OWNER_EMAIL;
  });

  it("PUT creates with 201, then updates the same id with 200", async () => {
    const created = await put(ID, BODY);
    expect(created._getStatusCode()).toBe(201);
    expect(JSON.parse(created._getData()).data).toMatchObject({
      created: true,
      model: { id: ID, slug: "claude-fable-5-1", releaseDate: "2026-09-01" },
    });

    const updated = await put(ID, { ...BODY, highlight: "Другой заголовок" });
    expect(updated._getStatusCode()).toBe(200);
    expect(JSON.parse(updated._getData()).data).toMatchObject({
      created: false,
      model: { highlight: "Другой заголовок" },
    });
  });

  it("PUT answers 404 when autoPublishTimeline is off (fail-closed kill switch)", async () => {
    await settingsService.setFlag("autoPublishTimeline", false);
    const res = await put(ID, BODY);
    expect(res._getStatusCode()).toBe(404);
  });

  it("PUT rejects a missing token with 401 and a bad body with 400", async () => {
    const anonymous = await put(ID, BODY, {
      "Content-Type": "application/json",
    });
    expect(anonymous._getStatusCode()).toBe(401);

    const badDate = await put(ID, { ...BODY, releaseDate: "2026-9-1" });
    expect(badDate._getStatusCode()).toBe(400);
    expect(JSON.parse(badDate._getData()).message).toMatch(/releaseDate/);

    const badUrl = await put(ID, { ...BODY, wikiUrl: "javascript:alert(1)" });
    expect(badUrl._getStatusCode()).toBe(400);

    const badId = await put("Not Kebab", BODY);
    expect(badId._getStatusCode()).toBe(400);
  });

  it("PUT answers 409 when another id already uses the slug", async () => {
    await put(ID, BODY);
    const clash = await put("inception-mercury-2-5", BODY);
    expect(clash._getStatusCode()).toBe(409);
  });

  it("GET list is public and returns oldest first", async () => {
    await put("b-newer", { ...BODY, slug: "newer", releaseDate: "2026-09-02" });
    await put("a-older", { ...BODY, slug: "older", releaseDate: "2026-08-31" });
    const { req, res } = createMocks({ method: HTTP_METHOD.GET });
    await listHandler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const { models } = JSON.parse(res._getData());
    expect(models.map((model: { id: string }) => model.id)).toEqual([
      "a-older",
      "b-newer",
    ]);
  });

  it("DELETE removes the entry even when the publish flag is off, 404 on repeat", async () => {
    await put(ID, BODY);
    await settingsService.setFlag("autoPublishTimeline", false);

    const first = createMocks({
      method: HTTP_METHOD.DELETE,
      headers: botHeaders(),
      query: { id: ID },
    });
    await deleteHandler(first.req, first.res);
    expect(first.res._getStatusCode()).toBe(200);

    const second = createMocks({
      method: HTTP_METHOD.DELETE,
      headers: botHeaders(),
      query: { id: ID },
    });
    await deleteHandler(second.req, second.res);
    expect(second.res._getStatusCode()).toBe(404);
  });
});
```

Run: `yarn test src/tests/api/llm-timeline`
Expected: FAIL — модули ручек не найдены.

- [ ] **Шаг 2: публичный список**

`src/pages/api/llm-timeline/list.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/src/lib/db";
import { HTTP } from "@/src/constants/http";
import { sendError } from "@/src/utils/response";
import { withRateLimit } from "@/src/middlewares/rate-limit";
import { llmTimelineModelService } from "@/src/services/llm-timeline-model";

// Public GET for the frontend SSR merge. Bare { models } like /api/changelog/list.
async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const models = await llmTimelineModelService.list();
    return res.status(HTTP.OK).json({ models });
  } catch (error) {
    return sendError(res, error);
  }
}

export default withRateLimit({
  routeName: "llmTimeline.list",
  windowMs: 60_000,
  max: 60,
})(handler);
```

- [ ] **Шаг 3: PUT за флагом** (после задачи 3)

`src/pages/api/llm-timeline/[id].ts`:

```ts
import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/src/lib/db";
import { ok, sendError } from "@/src/utils/response";
import { emitAudit } from "@/src/utils/audit-context";
import { HTTP, HTTP_METHOD } from "@/src/constants/http";
import { requireAuth } from "@/src/middlewares/require-auth";
import { withMethods } from "@/src/middlewares/with-methods";
import { requireAdmin } from "@/src/middlewares/require-admin";
import { requireFeature } from "@/src/middlewares/require-feature";
import { validateBody, validateQuery } from "@/src/middlewares/validate";
import { llmTimelineModelService } from "@/src/services/llm-timeline-model";
import {
  llmTimelineIdParamSchema,
  upsertLlmTimelineModelSchema,
} from "@/src/schemas/llm-timeline-model";

// Bot-token/admin PUT: the ai-changelog-watcher job publishes one timeline
// entry per call and re-PUTs to fix it. Gated by autoPublishTimeline so the
// admin can stop the job without touching the Mac it runs on.
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const { id } = llmTimelineIdParamSchema.parse(req.query);
    const { model, created } = await llmTimelineModelService.upsert(
      id,
      req.body,
    );
    emitAudit(req, {
      action: created
        ? "llm_timeline_model.created"
        : "llm_timeline_model.updated",
      targetType: "llm_timeline_model",
      targetId: model.id,
      metadata: {
        vendor: model.vendor,
        name: model.name,
        releaseDate: model.releaseDate,
      },
    });
    return ok(
      res,
      { model, created },
      { status: created ? HTTP.CREATED : HTTP.OK },
    );
  } catch (error) {
    return sendError(res, error);
  }
}

export default requireFeature("autoPublishTimeline", { enabledInTest: true })(
  requireAuth(
    requireAdmin(
      withMethods([HTTP_METHOD.PUT])(
        validateQuery(llmTimelineIdParamSchema)(
          validateBody(upsertLlmTimelineModelSchema)(handler),
        ),
      ),
    ),
  ),
);
```

- [ ] **Шаг 4: DELETE без флага**

`src/pages/api/llm-timeline/[id]/delete.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/src/lib/db";
import { HTTP_METHOD } from "@/src/constants/http";
import { ok, sendError } from "@/src/utils/response";
import { emitAudit } from "@/src/utils/audit-context";
import { requireAuth } from "@/src/middlewares/require-auth";
import { validateQuery } from "@/src/middlewares/validate";
import { withMethods } from "@/src/middlewares/with-methods";
import { requireAdmin } from "@/src/middlewares/require-admin";
import { llmTimelineIdParamSchema } from "@/src/schemas/llm-timeline-model";
import { llmTimelineModelService } from "@/src/services/llm-timeline-model";

// Retracting a wrong entry must work even when publishing is switched off, so
// no requireFeature here.
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const { id } = llmTimelineIdParamSchema.parse(req.query);
    await llmTimelineModelService.remove(id);
    emitAudit(req, {
      action: "llm_timeline_model.deleted",
      targetType: "llm_timeline_model",
      targetId: id,
    });
    return ok(res, { id });
  } catch (error) {
    return sendError(res, error);
  }
}

export default requireAuth(
  requireAdmin(
    withMethods([HTTP_METHOD.DELETE])(
      validateQuery(llmTimelineIdParamSchema)(handler),
    ),
  ),
);
```

- [ ] **Шаг 5: тесты**

Run: `yarn test src/tests/api/llm-timeline && yarn ts && yarn lint`
Expected: 6 тестов зелёные.

- [ ] **Шаг 6: коммит**

```bash
git add src/pages/api/llm-timeline src/tests/api/llm-timeline
git commit -m "feat(llm-timeline): ручки list, put за флагом autoPublishTimeline и delete"
```

---

## Задача 3 (бэкенд): флаг `autoPublishTimeline`

**Files:**

- Modify: `src/services/settings.ts:12,17-22`
- Modify: `src/config-global.ts:22-23`
- Modify: `src/pages/api/admin/settings/auto-publish.ts:15,37`
- Modify: `.env.example:81-82`, `.env.test:11-12`
- Test: `src/tests/services/settings.test.ts:54-69`

- [ ] **Шаг 1: падающий тест — полный набор флагов**

В `src/tests/services/settings.test.ts` заменить тест `getFlags returns every flag in the snapshot` (строки 54-69):

```ts
it("getFlags returns every flag in the snapshot", async () => {
  // Set every flag explicitly so the assertion is independent of the env-seeded
  // defaults; getFlags must surface the full FlagKey set, not just one. This
  // toEqual is a strict full-set match — a new FlagKey must be added here too.
  await settingsService.setFlag("pdCollection", false);
  await settingsService.setFlag("dogsBooking", true);
  await settingsService.setFlag("autoPublishReleases", true);
  await settingsService.setFlag("autoPublishNews", false);
  await settingsService.setFlag("autoPublishTimeline", true);
  const flags = await settingsService.getFlags();
  expect(flags).toEqual({
    pdCollection: false,
    dogsBooking: true,
    autoPublishReleases: true,
    autoPublishNews: false,
    autoPublishTimeline: true,
  });
});
```

Run: `yarn test src/tests/services/settings.test.ts`
Expected: FAIL — `'autoPublishTimeline'` не входит в `FlagKey` (ошибка типов ts-jest).

- [ ] **Шаг 2: ключ, дефолт, сид из env**

`src/services/settings.ts` строка 12:

```ts
export type FlagKey =
  | "pdCollection"
  | "dogsBooking"
  | "autoPublishReleases"
  | "autoPublishNews"
  | "autoPublishTimeline";
```

строки 17-22 — добавить в `FLAG_DEFAULTS`:

```ts
  autoPublishTimeline: FEATURES.autoPublishTimeline,
```

`src/config-global.ts` после строки 23:

```ts
  autoPublishTimeline: process.env.AUTO_PUBLISH_TIMELINE_ENABLED === 'true',
```

`.env.example` после строки 82:

```
# Timeline auto-publish: the ai-changelog-watcher job may PUT /api/llm-timeline/<id>.
# Off → the route answers 404 and the job falls back to a local draft file.
AUTO_PUBLISH_TIMELINE_ENABLED=false
```

`.env.test` после строки 12:

```
AUTO_PUBLISH_TIMELINE_ENABLED=false
```

- [ ] **Шаг 3: тумблер в admin-роуте**

`src/pages/api/admin/settings/auto-publish.ts` строка 15:

```ts
const AUTO_PUBLISH_KEYS = [
  "autoPublishReleases",
  "autoPublishNews",
  "autoPublishTimeline",
] as const;
```

строка 37:

```ts
throw new AppError(
  HTTP.BAD_REQUEST,
  "key must be autoPublishReleases, autoPublishNews or autoPublishTimeline",
);
```

- [ ] **Шаг 4: тесты**

Run: `yarn test src/tests/services/settings.test.ts src/tests/api/admin/settings.test.ts && yarn ts && yarn lint`
Expected: зелёные.

- [ ] **Шаг 5: коммит**

```bash
git add src/services/settings.ts src/config-global.ts src/pages/api/admin/settings/auto-publish.ts .env.example .env.test src/tests/services/settings.test.ts
git commit -m "feat(settings): флаг autoPublishTimeline по образцу autoPublishReleases"
```

---

## Задача 4 (бэкенд): документация, полный прогон, пуш и проверка прода

**Files:**

- Modify: `README.md:105-111` (таблица роутов `/api/changelog` — добавить три строки `/api/llm-timeline/*`)
- Modify: `CLAUDE.md:33` (список живых таблиц — добавить `llm_timeline_models`)

- [ ] **Шаг 1: README и CLAUDE.md**

В таблицу роутов README после строк про `/api/changelog` добавить:

```
| `GET /api/llm-timeline/list` | public | `{ models }` — записи таймлайна от джобы ai-changelog-watcher |
| `PUT /api/llm-timeline/[id]` | bot/admin, флаг `autoPublishTimeline` | upsert записи; 201 создана / 200 обновлена / 404 флаг выключен |
| `DELETE /api/llm-timeline/[id]/delete` | bot/admin | убрать запись |
```

(формат столбцов подогнать под существующую таблицу.)

В `CLAUDE.md:33` дописать `llm_timeline_models` в перечень таблиц.

- [ ] **Шаг 2: полный прогон**

Run: `yarn test && yarn ts && yarn lint && yarn build`
Expected: всё зелёное. Заодно проверить, что `dogs`-тесты не задеты (общий бэкенд с teacher.dog).

- [ ] **Шаг 3: коммит и пуш (после «да» Миши)**

```bash
git add README.md CLAUDE.md
git commit -m "docs(llm-timeline): ручки и таблица в README и CLAUDE.md"
git push origin main
```

- [ ] **Шаг 4: дождаться CI и проверить прод**

Run: `curl -sS https://api.aifirst.us.com:8444/api/llm-timeline/list`
Expected: `{"models":[]}` (таблица создалась на старте сервиса). Если 404 — деплой ещё идёт; проверить `gh run list --repo <backend> --limit 1`.

---

## Задача 5 (фронт): фетч и слияние списков

**Files:**

- Modify: `src/utils/axios.ts:164-167` (объект `endpoints`)
- Modify: `src/actions/blog-ssr.ts` (после `getReleases`, строка 149)
- Modify: `src/utils/llm-catalog.ts:71` (экспорт `isSafeHttpUrl`)
- Create: `src/utils/llm-timeline-source.ts`
- Test: `src/utils/__tests__/llm-timeline-source.test.ts`

**Interfaces:**

- Produces: `getTimelineModels(): Promise<LlmModel[]>`; `mergeTimelineModels(curated: LlmModel[], remote: LlmModel[]): LlmModel[]`; `endpoints.llmTimeline.list`.

- [ ] **Шаг 1: падающий тест слияния**

`src/utils/__tests__/llm-timeline-source.test.ts`:

```ts
import type { LlmModel } from "src/sections/llm-timeline/types";

import { it, expect, describe } from "vitest";

import { mergeTimelineModels } from "../llm-timeline-source";

function model(overrides: Partial<LlmModel>): LlmModel {
  return {
    id: "anthropic-claude-fable-5-1",
    slug: "claude-fable-5-1",
    vendor: "Anthropic",
    name: "Claude Fable 5.1",
    releaseDate: "2026-09-01",
    contextTokens: 1000000,
    params: null,
    highlight: "Чтение из кеша подешевело вчетверо.",
    description: "Обновление старшей модели Anthropic.",
    capabilities: ["agentic"],
    sourceUrl: "https://www.anthropic.com/claude-fable-and-mythos-5-1",
    wikiUrl: null,
    funFact: null,
    ...overrides,
  };
}

describe("mergeTimelineModels", () => {
  it("appends remote entries after the curated ones", () => {
    const curated = [model({ id: "openai-gpt-x", slug: "gpt-x" })];
    const remote = [model({})];
    const merged = mergeTimelineModels(curated, remote);
    expect(merged.map((item) => item.id)).toEqual([
      "openai-gpt-x",
      "anthropic-claude-fable-5-1",
    ]);
  });

  it("keeps the curated entry when a remote one has the same id", () => {
    const curated = [model({ highlight: "Рукописный заголовок" })];
    const remote = [model({ highlight: "Заголовок от джобы" })];
    const merged = mergeTimelineModels(curated, remote);
    expect(merged).toHaveLength(1);
    expect(merged[0].highlight).toBe("Рукописный заголовок");
  });

  it("drops a remote entry whose sourceUrl is not http(s)", () => {
    const remote = [model({ sourceUrl: "javascript:alert(1)" })];
    expect(mergeTimelineModels([], remote)).toEqual([]);
  });

  it("nulls an unsafe wikiUrl instead of dropping the entry", () => {
    const remote = [model({ wikiUrl: "javascript:alert(1)" })];
    const merged = mergeTimelineModels([], remote);
    expect(merged).toHaveLength(1);
    expect(merged[0].wikiUrl).toBeNull();
  });
});
```

Run: `cd /Users/talalaev-m/projects/blog-app-mui-frontend && npx vitest run src/utils/__tests__/llm-timeline-source.test.ts`
Expected: FAIL — модуль `../llm-timeline-source` не найден.

- [ ] **Шаг 2: экспорт `isSafeHttpUrl`**

`src/utils/llm-catalog.ts:71` — `function isSafeHttpUrl(` → `export function isSafeHttpUrl(`.

- [ ] **Шаг 3: слияние**

`src/utils/llm-timeline-source.ts`:

```ts
import type { LlmModel } from "src/sections/llm-timeline/types";

import { isSafeHttpUrl } from "./llm-catalog";

// Remote entries come from the backend (published by the changelog job). A
// hand-written static entry always wins over a remote one with the same id;
// a wrong remote entry is fixed by deleting it on the backend, not by editing
// the static file. URLs are external input, like the release feed.
export function mergeTimelineModels(
  curated: LlmModel[],
  remote: LlmModel[],
): LlmModel[] {
  const curatedIds = new Set(curated.map((model) => model.id));
  const additions = remote
    .filter(
      (model) => !curatedIds.has(model.id) && isSafeHttpUrl(model.sourceUrl),
    )
    .map((model) => ({
      ...model,
      wikiUrl:
        model.wikiUrl && isSafeHttpUrl(model.wikiUrl) ? model.wikiUrl : null,
    }));
  return [...curated, ...additions];
}
```

Run: `npx vitest run src/utils/__tests__/llm-timeline-source.test.ts`
Expected: 4 passed.

- [ ] **Шаг 4: адрес ручки**

`src/utils/axios.ts` после блока `changelog` (строка 167):

```ts
  llmTimeline: {
    list: "/api/llm-timeline/list",
  },
```

- [ ] **Шаг 5: фетч**

`src/actions/blog-ssr.ts`: в импорт типов добавить `LlmModel`:

```ts
import type { LlmModel } from "src/sections/llm-timeline/types";
```

и после `getReleases` (после строки 149):

```ts
/**
 * Timeline entries published by the changelog job — editorial text for models
 * that have no hand-written entry in the static data. Same ISR window and the
 * same "throw, don't cache empty" rule as the changelog.
 */
export async function getTimelineModels(): Promise<LlmModel[]> {
  const { models } = await fetchJsonWithRetry<{ models: LlmModel[] }>(
    `${SERVER_URL}${endpoints.llmTimeline.list}`,
    CHANGELOG_FETCH_INIT,
  );
  return models;
}
```

- [ ] **Шаг 6: проверки**

Run: `npx tsc --noEmit && yarn lint && npx vitest run src/utils`
Expected: 0 ошибок; `knip` пока пожалуется на неиспользуемый `getTimelineModels` — это снимет задача 6, поэтому `yarn knip` здесь не гоняем.

- [ ] **Шаг 7: коммит**

```bash
git add -f src/utils/llm-timeline-source.ts src/utils/__tests__/llm-timeline-source.test.ts
git add src/utils/axios.ts src/actions/blog-ssr.ts src/utils/llm-catalog.ts
git commit -m "feat(llm-timeline): фетч записей из бэкенда и слияние со статическим списком"
```

---

## Задача 6 (фронт): три страницы

**Files:**

- Modify: `src/app/[locale]/llm-timeline/page.tsx:2,39-45`
- Modify: `src/app/[locale]/changelog/page.tsx:2,49-54`
- Modify: `src/app/[locale]/llm-compare/page.tsx:2,41-46`

- [ ] **Шаг 1: `/llm-timeline`**

Строка 2:

```ts
import { getReleases, getTimelineModels } from "src/actions/blog-ssr";
```

после строки 7 (рядом с `buildUnifiedLlmCatalog`):

```ts
import { mergeTimelineModels } from "src/utils/llm-timeline-source";
```

строки 39-45:

```tsx
export default async function Page() {
  const [{ releases }, timelineModels] = await Promise.all([
    getReleases(),
    getTimelineModels(),
  ]);
  const catalog = buildUnifiedLlmCatalog(
    mergeTimelineModels(LLM_MODELS, timelineModels),
    COMPARABLE_MODELS,
    releases,
  );
```

- [ ] **Шаг 2: `/changelog`**

Строка 2 — тот же импорт `getReleases, getTimelineModels`; рядом со строкой 5 — импорт `mergeTimelineModels`. Строки 49-54:

```tsx
const [{ releases: feedReleases }, timelineModels] = await Promise.all([
  getReleases(),
  getTimelineModels(),
]);
const catalog = buildUnifiedLlmCatalog(
  mergeTimelineModels(LLM_MODELS, timelineModels),
  COMPARABLE_MODELS,
  feedReleases,
);
```

- [ ] **Шаг 3: `/llm-compare`**

Строка 2 — импорт `getReleases, getTimelineModels`; рядом со строкой 8 — импорт `mergeTimelineModels`. Строки 41-46:

```tsx
const [{ releases }, timelineModels] = await Promise.all([
  getReleases(),
  getTimelineModels(),
]);
const catalog = buildUnifiedLlmCatalog(
  mergeTimelineModels(LLM_MODELS, timelineModels),
  COMPARABLE_MODELS,
  releases,
);
```

Комментарий на строке 37 («Fully static — data is a curated constant, no fetch») уже неверен — заменить на:

```tsx
// Reads the release feed and the remote timeline entries with the same ISR
// window as /changelog; a persistent backend failure must throw, not cache.
```

- [ ] **Шаг 4: проверки**

Run: `npx tsc --noEmit && yarn lint && npx madge --circular --extensions ts,tsx src && yarn knip && npx vitest run`
Expected: всё зелёное, knip 0.

- [ ] **Шаг 5: коммит**

```bash
git add "src/app/[locale]/llm-timeline/page.tsx" "src/app/[locale]/changelog/page.tsx" "src/app/[locale]/llm-compare/page.tsx"
git commit -m "feat(llm-timeline): три страницы читают записи джобы из бэкенда"
```

---

## Задача 7 (фронт): тумблер в админке

**Files:**

- Modify: `src/actions/settings.ts:21-28`
- Modify: `src/sections/admin/admin-settings-view.tsx:28-43`

- [ ] **Шаг 1: тип ключа и снапшот флагов**

`src/actions/settings.ts` строки 21-24:

```ts
interface AdminFlags extends PublicSettings {
  autoPublishReleases: boolean;
  autoPublishNews: boolean;
  autoPublishTimeline: boolean;
}
```

строка 28:

```ts
export type AutoPublishKey =
  | "autoPublishReleases"
  | "autoPublishNews"
  | "autoPublishTimeline";
```

- [ ] **Шаг 2: третий тумблер**

`src/sections/admin/admin-settings-view.tsx` — в массив `AUTO_PUBLISH_TOGGLES` после элемента `autoPublishNews`:

```ts
  {
    key: "autoPublishTimeline",
    label: "Автопубликация записей таймлайна (llm-timeline)",
    hint: "Включено — ночная джоба сама публикует проверенные записи о новых моделях в /llm-timeline и /changelog. Выключено — джоба складывает их в локальный черновик, на сайт ничего не попадает.",
  },
```

Комментарий над массивом («The two auto-publish switches») → «The auto-publish switches».

- [ ] **Шаг 3: проверки и коммит**

Run: `npx tsc --noEmit && yarn lint`

```bash
git add src/actions/settings.ts src/sections/admin/admin-settings-view.tsx
git commit -m "feat(admin): тумблер autoPublishTimeline в настройках"
```

---

## Задача 8 (фронт): decision-log

**Files:**

- Create: `src/sections/llm-timeline/decision-log.md`

- [ ] **Шаг 1: записать решения с разменом**

```markdown
# LLM timeline: Decision Log

---

### 2026-09-02: Записи джобы живут в отдельной таблице, а не в колонках `model_releases`

- **Chose:** таблица `llm_timeline_models` в форме `LlmModel`; фронт приклеивает её к статическому массиву и отдаёт в `buildUnifiedLlmCatalog` как раньше.
- **Why:** в `model_releases` пишут два процесса бота (импорт каталога и RSS), оба только создают строки и защищаются от дублей ответом 409 по slug, причём slug у них формируется по-разному (каталог шлёт slug Artificial Analysis, RSS не шлёт вовсе). Дописывать колонки в их строки — значит вступить в гонку с обоими и заставить бэкенд дедупить по названию. Отдельный список фронт уже умеет сливать с фактами по вендору, имени и дате.
- **Rejected:** колонки `highlight/description/fun_fact` в `model_releases` с upsert по названию; PR из джобы с ручным мержем; коммит и пуш прямо из джобы.

### 2026-09-02: При совпадении `id` побеждает статическая запись

- **Chose:** `mergeTimelineModels` пропускает удалённую запись, если такой `id` есть в статическом файле.
- **Why:** рукописная карточка не должна затираться текстом джобы; исправление удалённой записи — `DELETE`, а не правка файла.
- **Rejected:** удалённая запись поверх статической; слияние по полям.

### 2026-09-02: Спорное джоба не публикует, а откладывает в `.md`

- **Chose:** запись уходит на сайт только если дата подтверждена вендором или двумя независимыми источниками, `sourceUrl` — страница вендора без входа, и каждое число из вендорского источника; иначе — локальный черновик, как раньше.
- **Why:** сегодняшний драфт наполовину состоит из спорных мест (какая ссылка рабочая, каким цифрам верить); при автопубликации это никто не прочитает. Та же схема, что у бота: не прошёл гейт — ушёл человеку.
- **Rejected:** статус «черновик» в базе с карточкой в Телеграм (вторая фаза), публикация всего подряд.

### 2026-09-02: Джоба ходит токеном бота

- **Chose:** `BOT_API_TOKEN` в `~/.stefania-skill-tokens.sh` на маке.
- **Why:** путь «bearer → владелец-админ» уже есть и покрыт тестами; отдельный токен — второй такой путь ради одного вызова в сутки.
- **Rejected:** отдельный `TIMELINE_API_TOKEN` с урезанными правами.
```

- [ ] **Шаг 2: коммит**

```bash
git add -f src/sections/llm-timeline/decision-log.md
git commit -m "docs(llm-timeline): decision-log по автопубликации записей"
```

---

## Задача 9 (фронт): проверка вживую и пуш

- [ ] **Шаг 1: локальный бэкенд с данными**

```bash
brew services start postgresql@18
cd /Users/talalaev-m/projects/blog-app-mui-backend && yarn dev
```

В `.env` бэкенда локально должны быть `BOT_API_TOKEN`, `OWNER_EMAIL` (админ с этим email в локальной базе) и `AUTO_PUBLISH_TIMELINE_ENABLED=true`. Проверить: `curl -s localhost:7272/api/llm-timeline/list` → `{"models":[]}`.

- [ ] **Шаг 2: положить две сегодняшние записи**

Взять записи Mercury 2.5 Preview и Claude Fable 5.1 из `~/.stefania/personal/talalaev-m/changelog-drafts/2026-09-01.md`, сохранить тела как JSON без `id` (он в адресе) в `/tmp/tl-mercury.json` и `/tmp/tl-fable.json`, затем:

```bash
curl -sS -w '\n%{http_code}\n' -X PUT localhost:7272/api/llm-timeline/inception-mercury-2-5-preview \
  -H "Authorization: Bearer $LOCAL_BOT_API_TOKEN" -H 'Content-Type: application/json' \
  --data @/tmp/tl-mercury.json
curl -sS -w '\n%{http_code}\n' -X PUT localhost:7272/api/llm-timeline/anthropic-claude-fable-5-1 \
  -H "Authorization: Bearer $LOCAL_BOT_API_TOKEN" -H 'Content-Type: application/json' \
  --data @/tmp/tl-fable.json
```

Expected: 201 на обе.

- [ ] **Шаг 3: фронт через `/run`**

`NEXT_PUBLIC_SERVER_URL=http://localhost:7272 yarn dev` (порт 3033), открыть `/ru/llm-timeline`: карточки Mercury 2.5 Preview и Claude Fable 5.1 стоят наверху 2026 года, раскрываются, у Fable есть ссылка на Википедию, у Mercury её нет; `/ru/changelog` — обе в ленте со ссылкой на страницу вендора; `/ru/llm-compare` — не упало. Скриншот карточки Fable 5.1 в раскрытом виде — в ответ Мише. Затем `DELETE` одной записи через `[id]/delete` и обновить страницу (dev-режим без ISR) — карточка исчезла.

- [ ] **Шаг 4: полный прогон и пуш (после «да» Миши)**

Run: `npx tsc --noEmit && yarn lint && npx madge --circular --extensions ts,tsx src && yarn knip && npx vitest run && yarn build`

```bash
git push origin main
```

Vercel деплоит сам; через минуту `https://aifirst.us.com/ru/llm-timeline` открывается и показывает то же, что раньше (в базе прода пока пусто).

---

## Задача 10 (Миша): токен на мак и флаг

- [ ] **Шаг 1: посмотреть токен на VDS** (значение вижу только ты, я его не читаю)

```bash
ssh blog 'grep ^BOT_API_TOKEN= /opt/blog-backend/.env.production'
```

- [ ] **Шаг 2: положить в файл токенов скиллов**

```bash
echo 'export BOT_API_TOKEN="<вставь значение>"' >> ~/.stefania-skill-tokens.sh
```

- [ ] **Шаг 3: проверить, что джоба его увидит**

```bash
source ~/.stefania-skill-tokens.sh && curl -sS -o /dev/null -w '%{http_code}\n' -H "Authorization: Bearer $BOT_API_TOKEN" https://api.aifirst.us.com:8444/api/admin/settings
```

Expected: `200`.

- [ ] **Шаг 4: включить флаг** — в админке `/dashboard/admin` тумблер «Автопубликация записей таймлайна». Пока он выключен, джоба будет получать 404 и писать черновики, как сегодня.

---

## Задача 11: джоба — новые шаги 4–6

**Files:**

- Modify: `~/.claude/scheduled-tasks/ai-changelog-watcher/SKILL.md` (строки 6-10 — правило и контекст; 57-84 — шаги 4-6)

- [ ] **Шаг 1: правило и контекст (строки 6-10)**

Заменить строку 8 на:

```
ПРАВИЛО: ничего не коммитить, не пушить, не деплоить. Публикация — только через `PUT /api/llm-timeline/<id>`; всё, что не прошло гейт из шага 5, — в локальный драфт-файл.
```

В строке 10 заменить хвост «Эта джоба драфтит РЕДАКТОРСКУЮ начинку … не конфликтует с ботом.» на:

```
Эта джоба публикует РЕДАКТОРСКУЮ начинку (`highlight`, `funFact`, живое описание) в бэкенд-таблицу `llm_timeline_models` — отдельный список в форме `LlmModel`; страницы `/llm-timeline`, `/changelog` и `/llm-compare` приклеивают его к статическому `models-2026.ts` и сливают с фактами бота (`buildUnifiedLlmCatalog`). Джоба не пишет в `model_releases` и не конфликтует с ботом.
```

- [ ] **Шаг 2: шаг 4 — дедуп по трём источникам**

Заменить раздел «## Шаг 4. Дедуп» на:

```
## Шаг 4. Дедуп

Модель не новая, если она есть хоть в одном из трёх мест:

1. статический массив `/Users/talalaev-m/projects/blog-app-mui-frontend/src/sections/llm-timeline/data/models-2026.ts`;
2. уже опубликованные записи — `curl -sS https://api.aifirst.us.com:8444/api/llm-timeline/list` (поля `id`, `vendor`, `name`, `releaseDate`);
3. файлы в `/Users/talalaev-m/.stefania/personal/talalaev-m/changelog-drafts/` — там лежат отложенные спорные записи, их надо перепроверить, а не публиковать заново.

Сравнивай по вендору и имени без учёта регистра и знаков, не по `id`: `id` строится из имени, а имя у одной модели в разных источниках пишется по-разному.
```

- [ ] **Шаг 3: шаг 5 — гейт и публикация**

Заменить раздел «## Шаг 5. Драфт» на:

````
## Шаг 5. Гейт и публикация

Для каждого нового релиза собери запись РОВНО в формате `LlmModel` из `src/sections/llm-timeline/types.ts`, описание по-русски в стиле существующих, неизвестное число — `null`. Идентификаторы: `id` = kebab-case из «вендор + имя» (`anthropic-claude-fable-5-1`), `slug` = kebab-case из имени (`claude-fable-5-1`) — как у соседних статических записей.

**Гейт: публикуй, только если верно всё четыре.**
1. Дата релиза подтверждена машиночитаемым полем на странице вендора (`datePublished`, `<time datetime>`, «Released …» в документации) или двумя независимыми источниками, сходящимися день в день.
2. `sourceUrl` — страница самого вендора, отвечает 200 без входа в аккаунт (`curl -sS -o /dev/null -w '%{http_code}'`).
3. Каждое число в тексте (параметры, контекст, бенчмарки) взято со страницы вендора; чужие замеры — только с атрибуцией, как в шаге 3.
4. Записи нет ни в одном из трёх источников шага 4.

Не прошло хоть одно — запись НЕ публикуется, а кладётся в драфт-файл с причиной (см. ниже).

**Публикация.** Тело запроса — та же запись без поля `id` (оно в адресе):

```bash
source ~/.stefania-skill-tokens.sh
curl -sS -o /tmp/tl-response.json -w '%{http_code}' -X PUT \
  "https://api.aifirst.us.com:8444/api/llm-timeline/<id>" \
  -H "Authorization: Bearer $BOT_API_TOKEN" -H 'Content-Type: application/json' \
  --data @/tmp/tl-entry.json
````

Коды: `201` — создана, `200` — обновлена (обе = успех); `404` — флаг `autoPublishTimeline` выключен или бэкенд ещё без ручки → запись в драфт-файл и одна строка об этом в финальном сообщении; `401` — нет или протух `BOT_API_TOKEN` в `~/.stefania-skill-tokens.sh` → драфт и сказать; `400` — тело не прошло проверку, текст ошибки в `/tmp/tl-response.json` → поправить и повторить один раз, иначе драфт; `409` — slug занят другой записью → в драфт с пометкой.

Ссылка на результат для проверки глазами: `https://aifirst.us.com/ru/llm-timeline` (карточка появится в течение 10 минут — столько живёт кеш страницы).

**Файл прогона** `/Users/talalaev-m/.stefania/personal/talalaev-m/changelog-drafts/<YYYY-MM-DD>.md` создаётся, если было хоть что-то опубликовано или отложено. Разделы: «Опубликовано» (id, дата, код ответа, коротко — по каким источникам прошёл гейт), «В черновик» (запись целиком в формате `LlmModel` + какой пункт гейта не прошёл и что нужно проверить руками), «Проверено и отброшено» — как раньше. Ничего не случилось — файл не создавать.

```

- [ ] **Шаг 4: шаг 6 и финальное сообщение**

В разделе «## Шаг 6. Записать снимок» первый список заменить на:
```

- после публикации или сохранения драфта;
- **и после вывода «новых релизов нет»** — эта ветка самая частая и самая пропускаемая.

```
Последний абзац файла заменить на:
```

Последнее сообщение: «changelog: новых релизов нет» либо «changelog: +N опубликовано, +M в черновик → файл» со списком моделей и кодами ответов — **и в обоих случаях дата снимка, с которым сравнивали**. Если хоть один запрос вернул 404 или 401, отдельной строкой: «публикация не работает: <причина>».

```

- [ ] **Шаг 5: перечитать файл целиком** — нигде не осталось «вставить в `models-2026.ts`», «неприменённый хвост» и порядка вставки по строкам.

---

## Задача 12: первая настоящая публикация (после «да» Миши)

- [ ] **Шаг 1: две записи из драфта 2026-09-01** — Mercury 2.5 Preview и Claude Fable 5.1 — прогнать через гейт задачи 11 вручную. Ожидание: Fable проходит (дата — из документации Anthropic, `sourceUrl` — 200, цифры — с вендорской страницы), Mercury проходит с оговоркой: дата подтверждена только со стороны OpenRouter, где вендор сам провайдер → по букве гейта это черновик. Решение по Mercury — за Мишей.

- [ ] **Шаг 2: `PUT` на прод** теми же командами, что в задаче 9 шаг 2, но на `https://api.aifirst.us.com:8444`.
Expected: `201` на каждую.

- [ ] **Шаг 3: увидеть на сайте** — через 10 минут `https://aifirst.us.com/ru/llm-timeline`: карточка Claude Fable 5.1 наверху, раскрывается, ссылки живые. Скриншот — Мише.

- [ ] **Шаг 4: хвост от 31 августа** — PhoneLLM Alpha 1 и Tencent Hy4 preview из драфта 2026-08-31 тоже можно опубликовать этим же путём вместо вставки в файл, если Миша скажет.

---

## Известные ограничения (не баги плана)

- Текст записей только по-русски, и на `/en/` тоже — как у всех статических записей сегодня.
- Одна модель может попасть на сайт дважды, если джоба и человек назовут её по-разному (`mercury-2-5` и `mercury-2-5-preview`): слияние по `id`, а не по смыслу. Страховка — шаг 4 джобы сверяет по вендору и имени, а не по `id`.
- Записи джобы не попадают в RSS `/changelog/feed.xml` — он читает только `model_releases`; статические записи туда и сегодня не попадают.
- `/changelog/[slug]` — страница деталей есть только у строк бота; записи джобы на `/changelog` ведут на страницу вендора, как и статические.

## Самопроверка плана

- Покрытие: таблица + сервис (1), ручки (2), флаг (3), деплой бэкенда (4), фетч + слияние (5), страницы (6), тумблер (7), decision-log (8), проверка вживую (9), токен и флаг (10), джоба (11), первая публикация (12). Требование «карточка на сайте без git» закрыто задачами 2, 6, 11.
- Имена сквозные: `llmTimelineModelService.{list,upsert,remove}`, `upsertLlmTimelineModelSchema`, `llmTimelineIdParamSchema`, `autoPublishTimeline` / `AUTO_PUBLISH_TIMELINE_ENABLED`, `getTimelineModels`, `mergeTimelineModels`, `endpoints.llmTimeline.list`.
- Зависимость: задача 2 шаг 3 компилируется только после задачи 3 — отмечено в задаче 2.
```
