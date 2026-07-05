import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "src/components/snackbar";

// ----------------------------------------------------------------------

/**
 * Returns a handler that copies the given post URL to the clipboard and shows
 * a success toast. Used by the post hero share SpeedDial "copy link" action.
 */
export function useCopyShareLink(url: string) {
  const t = useTranslations("blog");

  return useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("share.linkCopied"));
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }, [t, url]);
}
