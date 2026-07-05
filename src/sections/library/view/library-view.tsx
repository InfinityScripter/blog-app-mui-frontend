"use client";

import Container from "@mui/material/Container";

import { TilFeedSection } from "../til-feed";
import { LibraryHero } from "../library-hero";
import { ReadingListSection } from "../reading-list";
import { useLibraryTab } from "../hooks/use-library-tab";
import { ToolsDirectorySection } from "../tools-directory";

// ----------------------------------------------------------------------

/**
 * The /library hub view: one page, three curated sections (reading-list, tools,
 * TIL) behind a tab switcher. The active tab is URL-synced (shareable) by
 * {@link useLibraryTab}; each section reads its own static dataset.
 */
export function LibraryView() {
  const { tab, setTab } = useLibraryTab();

  return (
    <Container sx={{ py: { xs: 4, md: 7 } }}>
      <LibraryHero tab={tab} onTabChange={setTab} />

      {tab === "read" && <ReadingListSection />}
      {tab === "tools" && <ToolsDirectorySection />}
      {tab === "til" && <TilFeedSection />}
    </Container>
  );
}
