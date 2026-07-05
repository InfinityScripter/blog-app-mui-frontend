"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { PUBLISH_STATUS } from "src/types/domain";

// ----------------------------------------------------------------------

// Publish status value → its `blog.status.<key>` message. Maps a raw publish
// value (from post data / props) to a localized label without a dynamic `t()`
// key or a type assertion. Unknown/empty values fall back to the raw string.
const STATUS_LABEL_KEYS = {
  [PUBLISH_STATUS.published]: "status.published",
  [PUBLISH_STATUS.draft]: "status.draft",
} as const;

function isStatusKey(value: string): value is keyof typeof STATUS_LABEL_KEYS {
  return value in STATUS_LABEL_KEYS;
}

export function usePublishStatusLabel(): (value: string) => string {
  const t = useTranslations("blog");

  return useCallback(
    (value: string) =>
      isStatusKey(value) ? t(STATUS_LABEL_KEYS[value]) : value,
    [t],
  );
}
