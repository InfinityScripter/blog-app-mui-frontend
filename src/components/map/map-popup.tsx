import Box from "@mui/material/Box";
import { Popup } from "react-map-gl";

// ----------------------------------------------------------------------

export function MapPopup({ sx, children, ...other }) {
  return (
    <Box component={Popup} anchor="bottom" sx={sx} {...other}>
      {children}
    </Box>
  );
}
