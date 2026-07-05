import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { READING_ITEMS } from "./data";
import { FilterChips } from "./filter-chips";
import { ReadingItem } from "./reading-item";
import { READING_KIND_LABEL } from "./const";
import { useKindFilter } from "./hooks/use-kind-filter";
import {
  groupByKind,
  readingKindLabel,
  presentReadingKinds,
  filterReadingByKind,
} from "./utils";

import type { ReadingKind } from "./types";

// ----------------------------------------------------------------------

/** «Читать» tab: a kind-filter chip row above a list grouped by source kind. */
export function ReadingListSection() {
  const filter = useKindFilter<ReadingKind>();

  const options = useMemo(
    () =>
      presentReadingKinds(READING_ITEMS).map((kind) => ({
        value: kind,
        label: READING_KIND_LABEL[kind],
      })),
    [],
  );

  const groups = useMemo(
    () => groupByKind(filterReadingByKind(READING_ITEMS, filter.selected)),
    [filter.selected],
  );

  return (
    <>
      <FilterChips
        allLabel="Все"
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
            {readingKindLabel(group.kind)}
          </Typography>
          {group.items.map((item) => (
            <ReadingItem key={item.id} item={item} />
          ))}
        </Stack>
      ))}
    </>
  );
}
