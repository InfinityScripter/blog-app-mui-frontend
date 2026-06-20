import { useRef, useEffect } from "react";
import axios, { endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------

// Increments a post's view counter once per browser. Dedup is keyed in
// localStorage so a revalidation/remount or a return visit doesn't re-count.
// Fire-and-forget: a failed POST never surfaces to the reader.
export function usePostView(postId?: string) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!postId || sentRef.current) return;

    const storageKey = `viewed:${postId}`;

    let alreadyViewed = false;
    try {
      alreadyViewed = localStorage.getItem(storageKey) === "1";
    } catch {
      // localStorage unavailable (private mode / SSR) — skip dedup gracefully.
    }

    if (alreadyViewed) return;

    sentRef.current = true;

    axios
      .post(endpoints.post.view(postId))
      .then(() => {
        try {
          localStorage.setItem(storageKey, "1");
        } catch {
          // Ignore write failures; worst case the view counts again next time.
        }
      })
      .catch(() => {
        // Counting a view is best-effort; reset so a later mount can retry.
        sentRef.current = false;
      });
  }, [postId]);
}
