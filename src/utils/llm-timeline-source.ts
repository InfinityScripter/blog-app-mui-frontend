import type { LlmModel } from "src/sections/llm-timeline/types";

import { isSafeHttpUrl } from "./llm-catalog";

// Remote entries come from the backend (published by the changelog job). A
// hand-written static entry always wins over a remote one with the same id;
// a wrong remote entry is fixed by deleting it on the backend, not by editing
// the static file. URLs are external input, like the release feed.
export function mergeTimelineModels(
  curated: LlmModel[],
  remote: LlmModel[],
): LlmModel[] {
  const curatedIds = new Set(curated.map((model) => model.id));
  const additions = remote
    .filter(
      (model) => !curatedIds.has(model.id) && isSafeHttpUrl(model.sourceUrl),
    )
    .map((model) => ({
      ...model,
      wikiUrl:
        model.wikiUrl && isSafeHttpUrl(model.wikiUrl) ? model.wikiUrl : null,
    }));
  return [...curated, ...additions];
}
