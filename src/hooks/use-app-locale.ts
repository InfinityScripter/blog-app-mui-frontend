"use client";

import { useLocale } from "next-intl";
import { toAppLocale, type AppLocale } from "src/i18n/locales";

// ----------------------------------------------------------------------
// Локаль активной страницы, суженная до поддерживаемой AppLocale. next-intl
// отдаёт голую строку; роутинг гарантирует, что это одна из LOCALES, но тип
// сужаем через toAppLocale — без ассерта. Один хук вместо повторения
// toAppLocale(useLocale()) в каждом клиентском компоненте: смена источника
// локали или фолбэка правится в одном месте.

export function useAppLocale(): AppLocale {
  return toAppLocale(useLocale());
}
