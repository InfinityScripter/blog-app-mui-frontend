"use client";

import { PostSearchDialog } from "./post-search-dialog";

// ----------------------------------------------------------------------

// Public post-search entry hoisted into the shared header. Cmd+K-triggered
// dialog matching the dashboard's cmd+k UX, wired to blog posts.
export function PostSearchbar() {
  return <PostSearchDialog />;
}
