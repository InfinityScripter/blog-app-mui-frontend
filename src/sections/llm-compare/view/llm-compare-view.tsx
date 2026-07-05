"use client";

import Container from "@mui/material/Container";
import { useMemo, useState, useCallback } from "react";
import { useResponsive } from "src/hooks/use-responsive";

import { CompareHero } from "../compare-hero";
import { CompareCard } from "../compare-card";
import { CompareTable } from "../compare-table";
import { CompareEmpty } from "../compare-empty";
import { ComparePinBar } from "../compare-pin-bar";
import { CompareToolbar } from "../compare-toolbar";
import { useCompareSort } from "../hooks/use-compare-sort";
import { useComparePins } from "../hooks/use-compare-pins";
import { PRICING_AS_OF, COMPARABLE_MODELS } from "../data";
import { useCompareFilters } from "../hooks/use-compare-filters";
import {
  sortModels,
  distinctVendors,
  filterByVendors,
  filterOpenWeights,
  filterByModalities,
} from "../utils";

// ----------------------------------------------------------------------

/**
 * The /llm-compare view: a sortable, filterable matrix of curated LLMs with a
 * pin-to-compare head-to-head. Filter → sort is a pure pipeline over the static
 * dataset; sort and pins are URL-synced (shareable), filters are local. Table
 * on ≥ md, stacked cards below.
 */
export function LlmCompareView() {
  const isDesktop = useResponsive("up", "md");
  const filters = useCompareFilters();
  const { sortKey, sortDir, toggleSort } = useCompareSort();
  const pins = useComparePins(COMPARABLE_MODELS);

  const vendors = useMemo(() => distinctVendors(COMPARABLE_MODELS), []);

  const shown = useMemo(() => {
    const byVendor = filterByVendors(COMPARABLE_MODELS, filters.vendors);
    const byModality = filterByModalities(byVendor, filters.modalities);
    const byOpen = filterOpenWeights(byModality, filters.openOnly);
    return sortModels(byOpen, sortKey, sortDir);
  }, [filters.vendors, filters.modalities, filters.openOnly, sortKey, sortDir]);

  const pinnedModels = useMemo(
    () =>
      pins.pinned
        .map((id) => COMPARABLE_MODELS.find((model) => model.id === id))
        .filter((model): model is (typeof COMPARABLE_MODELS)[number] =>
          Boolean(model),
        ),
    [pins.pinned],
  );

  const [shared, setShared] = useState(false);
  const handleShare = useCallback(() => {
    if (typeof window === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
      })
      .catch(() => setShared(false));
  }, []);

  return (
    <Container sx={{ py: { xs: 4, md: 7 } }}>
      <CompareHero
        shown={shown.length}
        total={COMPARABLE_MODELS.length}
        pricingAsOf={PRICING_AS_OF}
      />

      <CompareToolbar
        vendors={vendors}
        selectedVendors={filters.vendors}
        selectedModalities={filters.modalities}
        openOnly={filters.openOnly}
        hasFilter={filters.hasFilter}
        onToggleVendor={filters.toggleVendor}
        onToggleModality={filters.toggleModality}
        onToggleOpenOnly={filters.toggleOpenOnly}
        onReset={filters.reset}
      />

      {shown.length === 0 ? (
        <CompareEmpty onReset={filters.reset} />
      ) : isDesktop ? (
        <CompareTable
          models={shown}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={toggleSort}
          isPinned={pins.isPinned}
          isPinFull={pins.isFull}
          onTogglePin={pins.togglePin}
        />
      ) : (
        shown.map((model) => (
          <CompareCard
            key={model.id}
            model={model}
            pinned={pins.isPinned(model.id)}
            pinDisabled={pins.isFull && !pins.isPinned(model.id)}
            onTogglePin={pins.togglePin}
          />
        ))
      )}

      <ComparePinBar
        models={pinnedModels}
        onRemove={pins.togglePin}
        onClear={pins.clear}
        onShare={handleShare}
        shared={shared}
      />
    </Container>
  );
}
