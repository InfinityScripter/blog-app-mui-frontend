import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import { useMemo, useCallback } from "react";

import { TOOL_ITEMS } from "./data";
import { ToolCard } from "./tool-card";
import { FilterChips } from "./filter-chips";
import { useKindFilter } from "./hooks/use-kind-filter";
import {
  toolCategoryLabelKey,
  presentToolCategories,
  filterToolsByCategory,
} from "./utils";

import type { ToolCategory } from "./types";

// ----------------------------------------------------------------------

/** «Инструменты» tab: a category-filter chip row above a responsive card grid. */
export function ToolsDirectorySection() {
  const t = useTranslations("library");
  const filter = useKindFilter<ToolCategory>();

  const categoryLabel = useCallback(
    (category: ToolCategory) => t(toolCategoryLabelKey(category)),
    [t],
  );

  const options = useMemo(
    () =>
      presentToolCategories(TOOL_ITEMS, categoryLabel).map((category) => ({
        value: category,
        label: categoryLabel(category),
      })),
    [categoryLabel],
  );

  const tools = useMemo(
    () => filterToolsByCategory(TOOL_ITEMS, filter.selected),
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
