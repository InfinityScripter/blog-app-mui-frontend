import { CONFIG } from "src/config-global";
import { ComponentsView } from "examples/_examples/view";

// ----------------------------------------------------------------------

/**
 * Dev-only entry to the Minimals component gallery (the "component factory").
 *
 * This file uses the `.dev.tsx` page extension, which `next.config.mjs`
 * registers as a routable page extension only in development. In a production
 * build it is not recognized as a page, so the route does not exist (real 404)
 * and none of the gallery code under `/examples` is bundled.
 *
 * The gallery sources live under `/examples` (outside `src/`) so they are also
 * excluded from lint and the main type-check.
 */
export const metadata = {
  title: `Components | ${CONFIG.site.name}`,
};

export default function Page() {
  return <ComponentsView />;
}
