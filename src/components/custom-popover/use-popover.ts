import type { MouseEvent } from "react";

import { useState, useCallback } from "react";

// ----------------------------------------------------------------------

export function usePopover() {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const onOpen = useCallback((event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    open: !!anchorEl,
    anchorEl,
    onOpen,
    onClose,
    setAnchorEl,
  };
}
