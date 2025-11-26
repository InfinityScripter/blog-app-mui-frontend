import { useMemo, useState, useCallback } from "react";

// ----------------------------------------------------------------------

interface UseCopyToClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  copiedText: string | null;
}

export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        console.warn("Clipboard not supported");
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        return true;
      } catch (error) {
        console.warn("Copy failed", error);
        setCopiedText(null);
        return false;
      }
    },
    [],
  );

  const memoizedValue = useMemo(
    () => ({ copy, copiedText }),
    [copy, copiedText],
  );

  return memoizedValue;
}
