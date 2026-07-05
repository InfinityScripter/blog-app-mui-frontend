"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

import { POST_PUBLISH_TAB } from "../const";

// ----------------------------------------------------------------------

// Dashboard publish-filter tab value → its `blog.publishTabs.<key>` message.
// Maps the raw tab value ("all"/"published"/"draft") to a localized label
// without a dynamic `t()` key or a type assertion. Unknown values fall back to
// the raw string.
const TAB_LABEL_KEYS = {
  [POST_PUBLISH_TAB.all]: "publishTabs.all",
  [POST_PUBLISH_TAB.published]: "publishTabs.published",
  [POST_PUBLISH_TAB.draft]: "publishTabs.draft",
} as const;

function isTabKey(value: string): value is keyof typeof TAB_LABEL_KEYS {
  return value in TAB_LABEL_KEYS;
}

export function usePublishTabLabel(): (value: string) => string {
  const t = useTranslations("blog");

  return useCallback(
    (value: string) => (isTabKey(value) ? t(TAB_LABEL_KEYS[value]) : value),
    [t],
  );
}
