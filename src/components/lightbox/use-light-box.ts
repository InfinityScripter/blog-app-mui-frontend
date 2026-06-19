import { useState, useCallback } from "react";

import type { Slide } from "./types";

// ----------------------------------------------------------------------

export function useLightBox(slides: Slide[]) {
  const [selected, setSelected] = useState(-1);

  const handleOpen = useCallback(
    (slideUrl: string) => {
      const slideIndex = slides.findIndex((slide) =>
        slide.type === "video"
          ? slide.poster === slideUrl
          : slide.src === slideUrl,
      );

      setSelected(slideIndex);
    },
    [slides],
  );

  const handleClose = useCallback(() => {
    setSelected(-1);
  }, []);

  return {
    selected,
    open: selected >= 0,
    onOpen: handleOpen,
    onClose: handleClose,
    setSelected,
  };
}
