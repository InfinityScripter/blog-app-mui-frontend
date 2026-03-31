# Dynamic Font Loading Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Загружать шрифты динамически — Public Sans по умолчанию через `next/font`, остальные через Google Fonts `<link>` только когда пользователь их выбирает.

**Architecture:** Public Sans (дефолтный) грузится через `next/font/google` в `layout.tsx` и применяется через CSS-переменную. Остальные шрифты (Inter, DM Sans, Nunito Sans) загружаются лениво: хук `useFontLoader` в `ThemeProvider` следит за `settings.fontFamily` и при изменении инжектирует `<link>` в `<head>` (идемпотентно). `setFont()` не меняется — он уже правильно формирует font-family stack.

**Tech Stack:** Next.js 15, `next/font/google`, React `useEffect`, MUI v7, TypeScript

---

## Текущее состояние

- `src/theme/core/typography.ts` — `defaultFont = "Public Sans"`, `primaryFont = setFont(defaultFont)`
- `src/theme/create-theme.ts` — `fontFamily: setFont(settings.fontFamily)` (тема уже корректно берёт шрифт из настроек)
- `src/theme/theme-provider.tsx` — клиентский провайдер, получает `settings` из контекста
- `src/app/layout.tsx` — SSR layout, место для подключения `next/font`
- Шрифты нигде не загружаются — поэтому браузер fallback на системные

---

### Task 1: Подключить Public Sans через `next/font/google`

**Files:**
- Modify: `src/app/layout.tsx`

**Что нужно знать:** `next/font/google` оптимизирует шрифт — self-hosted на Vercel, нет внешних запросов, нет FOIT. Возвращает объект с `.variable` (CSS-переменная) и `.className`. Нам нужно `.variable` чтобы CSS-переменная была доступна глобально.

**Step 1: Добавить импорт Public Sans**

В `src/app/layout.tsx` добавить импорт после существующих импортов:

```typescript
import { Public_Sans } from "next/font/google";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});
```

**Step 2: Применить переменную к `<html>`**

Изменить тег `<html>` — добавить `className`:

```tsx
// Было:
<html lang="ru" suppressHydrationWarning>

// Стало:
<html lang="ru" suppressHydrationWarning className={publicSans.variable}>
```

**Step 3: Обновить `setFont()` в utils.ts чтобы использовать CSS-переменную для Public Sans**

Файл: `src/theme/styles/utils.ts`

Текущий код:
```typescript
export function setFont(fontName: string): string {
  return `"${fontName}",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`;
}
```

Заменить на:
```typescript
const FONT_VARIABLES: Record<string, string> = {
  "Public Sans": "var(--font-public-sans)",
};

export function setFont(fontName: string): string {
  const cssVar = FONT_VARIABLES[fontName];
  const primary = cssVar ?? `"${fontName}"`;
  return `${primary},-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`;
}
```

**Step 4: Проверить в браузере**

Запустить `npm run dev` из `blog-app-mui-frontend/`.
Открыть DevTools → Elements → `<html>` должен иметь класс типа `__variable_XXXXX`.
В Computed Styles на `body` должен быть `font-family: "Public Sans", ...`.
Визуально: текст должен быть Public Sans (геометрический гротеск).

**Step 5: Commit**

```bash
git add src/app/layout.tsx src/theme/styles/utils.ts
git commit -m "feat(theme): load Public Sans via next/font with CSS variable"
```

---

### Task 2: Создать хук `useFontLoader` для ленивой загрузки шрифтов

**Files:**
- Create: `src/theme/use-font-loader.ts`

**Что нужно знать:** Google Fonts URL для шрифта выглядит так:
`https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap`

Нужно инжектировать `<link>` в `<head>` один раз (идемпотентно — проверяем наличие по `id`). Хук не трогает Public Sans — он уже загружен через `next/font`.

**Step 1: Создать файл `src/theme/use-font-loader.ts`**

```typescript
import { useEffect } from "react";

// ----------------------------------------------------------------------

const FONT_URLS: Record<string, string> = {
  Inter:
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
  "DM Sans":
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap",
  "Nunito Sans":
    "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700&display=swap",
};

export function useFontLoader(fontFamily: string): void {
  useEffect(() => {
    const url = FONT_URLS[fontFamily];

    if (!url) return; // Public Sans и неизвестные шрифты — пропускаем

    const id = `font-link-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;

    if (document.getElementById(id)) return; // уже загружен

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }, [fontFamily]);
}
```

**Step 2: Commit**

```bash
git add src/theme/use-font-loader.ts
git commit -m "feat(theme): add useFontLoader hook for lazy Google Fonts loading"
```

---

### Task 3: Подключить `useFontLoader` в `ThemeProvider`

**Files:**
- Modify: `src/theme/theme-provider.tsx`

**Что нужно знать:** `ThemeProvider` — клиентский компонент (`"use client"`), уже имеет доступ к `settings` из контекста. Это лучшее место для хука, потому что он уже реагирует на изменения настроек.

**Step 1: Добавить импорт и вызов хука**

Текущий код `theme-provider.tsx`:
```typescript
import { createTheme } from "./create-theme";
import { RTL } from "./with-settings/right-to-left";
import { schemeConfig } from "./color-scheme-script";

export function ThemeProvider({ children }: ThemeProviderProps) {
  const settings = useSettingsContext();
  const theme = createTheme(settings);
  // ...
}
```

Добавить импорт:
```typescript
import { useFontLoader } from "./use-font-loader";
```

Добавить вызов хука сразу после `createTheme`:
```typescript
export function ThemeProvider({ children }: ThemeProviderProps) {
  const settings = useSettingsContext();
  const theme = createTheme(settings);

  useFontLoader(settings.fontFamily); // <- добавить эту строку

  return (
    // ...без изменений
  );
}
```

**Step 2: Проверить в браузере**

1. Открыть DevTools → Network → фильтр "Font" или "googleapis"
2. Открыть Settings Drawer (шестерёнка), выбрать "Inter"
3. Должен появиться запрос к `fonts.googleapis.com` 
4. Текст на странице должен измениться — Inter заметно отличается от Public Sans (более нейтральный, без засечек)
5. Переключить обратно на "Public Sans" — текст должен вернуться к Public Sans
6. Снова выбрать "Inter" — нового запроса к googleapis не должно быть (шрифт уже в кэше `<head>`)

**Step 3: Commit**

```bash
git add src/theme/theme-provider.tsx
git commit -m "feat(theme): connect useFontLoader to ThemeProvider for dynamic font switching"
```

---

### Task 4: Проверить заголовки (h1–h3) — они используют `secondaryFont` (Barlow)

**Files:**
- Modify: `src/theme/core/typography.ts` (если нужно)
- Modify: `src/theme/use-font-loader.ts` (если нужно)

**Что нужно знать:** В `typography.ts` заголовки h1, h2, h3 используют `secondaryFont = setFont("Barlow")`. Barlow тоже нигде не загружается. Но заголовки — это вторичный шрифт, он не переключается пользователем. Нужно решить: загружать Barlow всегда (он используется для заголовков по умолчанию) или убрать его.

**Step 1: Добавить Barlow в `layout.tsx` через `next/font`**

В `src/app/layout.tsx` добавить:
```typescript
import { Public_Sans, Barlow } from "next/font/google";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});
```

Применить оба на `<html>`:
```tsx
<html lang="ru" suppressHydrationWarning className={`${publicSans.variable} ${barlow.variable}`}>
```

**Step 2: Добавить Barlow в `FONT_VARIABLES` в `utils.ts`**

```typescript
const FONT_VARIABLES: Record<string, string> = {
  "Public Sans": "var(--font-public-sans)",
  "Barlow": "var(--font-barlow)",
};
```

**Step 3: Проверить заголовки в браузере**

Заголовки (h1, h2, h3) должны отображаться шрифтом Barlow — более сжатый, выраженный. Проверить на странице блога где есть заголовки постов.

**Step 4: Commit**

```bash
git add src/app/layout.tsx src/theme/styles/utils.ts
git commit -m "feat(theme): load Barlow via next/font for headings (secondary font)"
```

---

### Task 5: Финальная проверка всех шрифтов

**Что проверить:**

1. **Public Sans (default):** Открыть сайт в инкогнито → текст отображается Public Sans → нет запросов к googleapis для основного шрифта
2. **Inter:** Settings → Font → Inter → текст меняется → один запрос googleapis
3. **DM Sans:** Settings → Font → DM Sans → текст меняется → один запрос googleapis  
4. **Nunito Sans:** Settings → Font → Nunito Sans → текст меняется (более округлый) → один запрос googleapis
5. **Повторный выбор:** Выбрать Inter снова после переключения → нового запроса НЕТ
6. **Reload:** Выбрать Inter, перезагрузить страницу → Inter применяется немедленно (localStorage), шрифт загружается снова (это нормально, браузер кэширует)
7. **Заголовки:** h1/h2/h3 всегда Barlow, независимо от выбранного шрифта

**Step 1: Запустить линтер**

```bash
cd blog-app-mui-frontend && npm run lint
```

Должен пройти без ошибок.

**Step 2: Commit финальный (если есть незакоммиченные изменения)**

```bash
git add -p
git commit -m "feat(theme): dynamic font loading complete"
```
