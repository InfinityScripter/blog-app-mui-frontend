import { CONFIG } from 'src/config-global';

import {CenteredResetPasswordView} from "../../../sections/auth-demo/centered";

// ----------------------------------------------------------------------

export const metadata = { title: `Reset password | Layout split - ${CONFIG.site.name}` };

export default function Page() {
  return <CenteredResetPasswordView />;
}
