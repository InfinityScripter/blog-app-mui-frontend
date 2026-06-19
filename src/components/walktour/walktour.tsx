import type { Props as JoyrideProps } from "react-joyride";

import dynamic from "next/dynamic";
import { varAlpha } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";

import { WalktourTooltip } from "./walktour-tooltip";

import type { WalktourProps } from "./types";

// `react-joyride` requires `steps`, while `WalktourProps` (Partial<Props>) makes
// every prop optional — restore `steps` as required for the rendered component.
type WalktourComponentProps = WalktourProps & Pick<JoyrideProps, "steps">;

// ----------------------------------------------------------------------

const Joyride = dynamic(
  () => import("react-joyride").then((mod) => mod.default),
  {
    ssr: false,
  },
);

// ----------------------------------------------------------------------

export function Walktour({
  locale,
  continuous = true,
  showProgress = true,
  scrollDuration = 500,
  showSkipButton = true,
  disableOverlayClose = true,
  ...other
}: WalktourComponentProps) {
  const theme = useTheme();

  const arrowStyles = {
    width: 20,
    height: 10,
    color: theme.vars.palette.background.paper,
  };

  return (
    <Joyride
      scrollOffset={100}
      locale={{ last: "Done", ...locale }}
      continuous={continuous}
      showProgress={showProgress}
      showSkipButton={showSkipButton}
      scrollDuration={scrollDuration}
      tooltipComponent={WalktourTooltip}
      disableOverlayClose={disableOverlayClose}
      floaterProps={{
        styles: {
          floater: { filter: "none" },
          arrow: { spread: arrowStyles.width, length: arrowStyles.height },
        },
      }}
      styles={{
        options: {
          zIndex: 9999,
          arrowColor: arrowStyles.color,
        },
        overlay: {
          backgroundColor: varAlpha(theme.vars.palette.grey["900Channel"], 0.8),
        },
        spotlight: {
          borderRadius: Number(theme.shape.borderRadius) * 2,
        },
        beacon: {
          outline: 0,
        },
        beaconInner: {
          backgroundColor: theme.vars.palette.error.main,
        },
        beaconOuter: {
          borderColor: theme.vars.palette.error.main,
          backgroundColor: varAlpha(theme.vars.palette.error.mainChannel, 0.24),
        },
      }}
      {...other}
    />
  );
}
