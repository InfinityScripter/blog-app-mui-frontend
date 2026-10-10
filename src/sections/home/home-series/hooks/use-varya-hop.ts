import { useState, useCallback } from "react";

// ----------------------------------------------------------------------

export function useVaryaHop() {
  const [hops, setHops] = useState(0);
  const [hopping, setHopping] = useState(false);

  const hop = useCallback(() => {
    setHops((count) => count + 1);
    setHopping(true);
  }, []);

  const land = useCallback(() => setHopping(false), []);

  return { hops, hopping, hop, land };
}
