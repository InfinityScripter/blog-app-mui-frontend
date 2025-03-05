import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';
import {OverviewAppView} from "../../sections/overview/app/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <OverviewAppView />;
}
