import { CONFIG } from 'src/config-global';

import {CenteredUpdatePasswordView} from "../../../sections/auth-demo/centered";

// ----------------------------------------------------------------------

export const metadata = { title: `Update password | Layout split - ${CONFIG.site.name}` };

export default function Page() {
  return <CenteredUpdatePasswordView />;
}
