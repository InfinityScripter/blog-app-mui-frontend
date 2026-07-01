import { CONFIG } from "src/config-global";
import { OverviewView } from "src/sections/overview/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <OverviewView />;
}
