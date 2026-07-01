import { useCallback } from "react";
import { toast } from "src/components/snackbar";

// ----------------------------------------------------------------------

/**
 * Returns a handler that copies the given post URL to the clipboard and shows
 * a success toast. Used by the post hero share SpeedDial "copy link" action.
 */
export function useCopyShareLink(url: string) {
  return useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована");
    } catch (error) {
      console.error("Не удалось скопировать ссылку:", error);
    }
  }, [url]);
}
