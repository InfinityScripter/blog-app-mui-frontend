import type { MapRef, MapProps } from "react-map-gl/mapbox";

import { forwardRef } from "react";
import MapGL from "react-map-gl/mapbox";
import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

export const Map = forwardRef<MapRef, MapProps>(({ ...other }, ref) => (
  <MapGL
    ref={ref}
    mapLib={import("mapbox-gl")}
    mapboxAccessToken={CONFIG.mapbox.apiKey}
    {...other}
  />
));
