// Pull in the autoplay plugin's type augmentation so `plugins().autoplay` and
// the `autoplay:*` events are typed even when no component imports the plugin
// directly (the demo overview sections that used to provide it were removed).
import type {} from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";

import { useState, useEffect, useCallback } from "react";

// ----------------------------------------------------------------------

export function useCarouselAutoPlay(mainApi?: EmblaCarouselType) {
  const [isPlaying, setIsPlaying] = useState(false);

  const onClickAutoplay = useCallback(
    (callback: () => void) => {
      const autoplay = mainApi?.plugins()?.autoplay;
      if (!autoplay) return;

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop;

      resetOrStop();
      callback();
    },
    [mainApi],
  );

  const onTogglePlay = useCallback(() => {
    const autoplay = mainApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;
    playOrStop();
  }, [mainApi]);

  useEffect(() => {
    const autoplay = mainApi?.plugins()?.autoplay;
    if (!autoplay) return;

    setIsPlaying(autoplay.isPlaying());
    mainApi
      .on("autoplay:play", () => setIsPlaying(true))
      .on("autoplay:stop", () => setIsPlaying(false))
      .on("reInit", () => setIsPlaying(false));
  }, [mainApi]);

  return { isPlaying, onTogglePlay, onClickAutoplay };
}
