import { PUBLISH_STATUS } from "src/types/domain";

// ----------------------------------------------------------------------

// Publish-status filter tabs for the dashboard post list: the "all" pseudo-tab
// plus each real publish state, derived from PUBLISH_STATUS so there's no
// hardcoded "published"/"draft" here.
export const POST_PUBLISH_TAB = {
  all: "all",
  ...PUBLISH_STATUS,
} as const;

export const POST_PUBLISH_TABS: string[] = Object.values(POST_PUBLISH_TAB);
