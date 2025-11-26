import { CONFIG } from "src/config-global";

import { CenteredResetPasswordView } from "../../../sections/auth-demo/centered";

// ----------------------------------------------------------------------

export const metadata = {
  title: `Сброс пароля | Разделенный макет - ${CONFIG.site.name}`,
};

export default function Page() {
  return <CenteredResetPasswordView />;
}
