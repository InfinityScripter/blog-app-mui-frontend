import { paths } from "src/routes/paths";

export const FRESH_POSTS_COUNT = 6;

export const HOME_TOOL_LINKS = [
  { key: "llmCompare", href: paths.llmCompare.root },
  { key: "llmTimeline", href: paths.llmTimeline.root },
  { key: "changelog", href: paths.changelog.root },
] as const;
