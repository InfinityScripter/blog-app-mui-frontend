import { CONFIG } from "src/config-global";

import { JwtSignUpView } from "src/sections/auth/jwt";

// ----------------------------------------------------------------------

export const metadata = { title: `Регистрация | JWT - ${CONFIG.site.name}` };

export default function Page() {
  return <JwtSignUpView />;
}
