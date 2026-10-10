// Filter chips for the blog list view are NOT hardcoded — they are derived from
// the tags that actually exist on published posts (see `useFeedTags`).

// Max filter chips shown in the row. Tags are frequency-ranked, so the most
// common topics win the slots; rarer tags are dropped to keep the row short
// (the full tag set lives on each post, not in the filter bar). A currently
// selected tag is always kept even if it ranks below this cap.
export const FEED_TAGS_LIMIT = 12;
