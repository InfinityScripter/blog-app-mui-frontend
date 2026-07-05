import { useMemo } from "react";
import Grid from "@mui/material/Grid";

import { TOOL_ITEMS } from "./data";
import { ToolCard } from "./tool-card";
import { FilterChips } from "./filter-chips";
import { TOOL_CATEGORY_LABEL } from "./const";
import { useKindFilter } from "./hooks/use-kind-filter";
import {
  toolCategoryLabel,
  presentToolCategories,
  filterToolsByCategory,
} from "./utils";

import type { ToolCategory } from "./types";

// ----------------------------------------------------------------------

/** «Инструменты» tab: a category-filter chip row above a responsive card grid. */
export function ToolsDirectorySection() {
  const filter = useKindFilter<ToolCategory>();

  const options = useMemo(
    () =>
      presentToolCategories(TOOL_ITEMS).map((category) => ({
        value: category,
        label: TOOL_CATEGORY_LABEL[category] ?? toolCategoryLabel(category),
      })),
    [],
  );

  const tools = useMemo(
    () => filterToolsByCategory(TOOL_ITEMS, filter.selected),
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

      <Grid container spacing={2}>
        {tools.map((tool) => (
          <Grid key={tool.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ToolCard tool={tool} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
