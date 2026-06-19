import type { PopupProps } from "react-map-gl/mapbox";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import { Popup } from "react-map-gl/mapbox";

// ----------------------------------------------------------------------

type MapPopupProps = PopupProps & {
  sx?: SxProps<Theme>;
};

export function MapPopup({ sx, children, ...other }: MapPopupProps) {
  return (
    <Box component={Popup} anchor="bottom" sx={sx} {...other}>
      {children}
    </Box>
  );
}
