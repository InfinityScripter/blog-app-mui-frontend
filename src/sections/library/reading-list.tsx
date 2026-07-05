import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";

import { READING_ITEMS } from "./data";
import { FilterChips } from "./filter-chips";
import { ReadingItem } from "./reading-item";
import { useKindFilter } from "./hooks/use-kind-filter";
import {
  groupByKind,
  readingKindLabelKey,
  presentReadingKinds,
  filterReadingByKind,
} from "./utils";

import type { ReadingKind } from "./types";

// ----------------------------------------------------------------------

/** «Читать» tab: a kind-filter chip row above a list grouped by source kind. */
export function ReadingListSection() {
  const t = useTranslations("library");
  const filter = useKindFilter<ReadingKind>();

  const options = useMemo(
    () =>
      presentReadingKinds(READING_ITEMS).map((kind) => ({
        value: kind,
        label: t(readingKindLabelKey(kind)),
      })),
    [t],
  );

  const groups = useMemo(
    () => groupByKind(filterReadingByKind(READING_ITEMS, filter.selected)),
    [filter.selected],
  );

  return (
    <>
      <FilterChips
        allLabel={t("filter.all")}
        options={options}
        isActive={filter.isActive}
        hasFilter={filter.hasFilter}
        onToggle={filter.toggle}
        onClear={filter.clear}
      />

      {groups.map((group) => (
        <Stack key={group.kind} sx={{ mb: 4 }}>
          <Typography
            variant="overline"
            sx={{ color: "text.disabled", mb: 0.5 }}
          >
            {t(group.labelKey)}
          </Typography>
          {group.items.map((item) => (
            <ReadingItem key={item.id} item={item} />
          ))}
        </Stack>
      ))}
    </>
  );
}
