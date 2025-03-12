import { CONFIG } from "src/config-global";

import { OverviewAppView } from "../../../sections/overview/app/view";
import { OverviewAnalyticsView } from "../../../sections/overview/analytics/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Page two | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <OverviewAppView />;
      <OverviewAnalyticsView />
    </>
  );
}
