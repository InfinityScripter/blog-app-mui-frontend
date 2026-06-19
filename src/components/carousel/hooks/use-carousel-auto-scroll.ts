import type { EmblaCarouselType } from "embla-carousel";
// Importing the plugin type pulls in its `declare module 'embla-carousel'`
// augmentation, which registers `autoScroll` on EmblaPluginsType and the
// `autoScroll:play` / `autoScroll:stop` events on EmblaEventListType.
import type { AutoScrollType } from "embla-carousel-auto-scroll";

import { useState, useEffect, useCallback } from "react";

// ----------------------------------------------------------------------

type UseCarouselAutoScrollReturn = {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClickAutoplay: (callback: () => void) => void;
};

// ----------------------------------------------------------------------

export function useCarouselAutoScroll(
  mainApi?: EmblaCarouselType,
): UseCarouselAutoScrollReturn {
  const [isPlaying, setIsPlaying] = useState(false);

  const onClickAutoplay = useCallback(
    (callback: () => void) => {
      const autoScroll: AutoScrollType | undefined =
        mainApi?.plugins()?.autoScroll;
      if (!autoScroll) return;

      const resetOrStop =
        autoScroll.options.stopOnInteraction === false
          ? autoScroll.reset
          : autoScroll.stop;

      resetOrStop();
      callback();
    },
    [mainApi],
  );

  const onTogglePlay = useCallback(() => {
    const autoScroll = mainApi?.plugins()?.autoScroll;
    if (!autoScroll) return;

    const playOrStop = autoScroll.isPlaying()
      ? autoScroll.stop
      : autoScroll.play;
    playOrStop();
  }, [mainApi]);

  useEffect(() => {
    const autoScroll = mainApi?.plugins()?.autoScroll;
    if (!autoScroll) return;

    setIsPlaying(autoScroll.isPlaying());
    mainApi
      .on("autoScroll:play", () => setIsPlaying(true))
      .on("autoScroll:stop", () => setIsPlaying(false))
      .on("reInit", () => setIsPlaying(false));
  }, [mainApi]);

  return { isPlaying, onTogglePlay, onClickAutoplay };
}
