import type { Slide, LightboxExternalProps } from "yet-another-react-lightbox";

// ----------------------------------------------------------------------

export type { Slide };

export type LightboxPluginOptions = {
  disableZoom?: boolean;
  disableVideo?: boolean;
  disableCaptions?: boolean;
  disableSlideshow?: boolean;
  disableThumbnails?: boolean;
  disableFullscreen?: boolean;
};

export interface LightboxProps
  extends LightboxPluginOptions,
    Omit<LightboxExternalProps, "slides"> {
  slides?: Slide[];
  disableTotal?: boolean;
  onGetCurrentIndex?: (index: number) => void;
}

export interface DisplayTotalProps {
  totalItems: number;
  disableTotal?: boolean;
}
