import type { ModelRelease } from "src/types/api";

// ----------------------------------------------------------------------

export interface ChangelogListViewProps {
  releases: ModelRelease[];
}

export interface ChangelogDetailViewProps {
  release: ModelRelease;
}
