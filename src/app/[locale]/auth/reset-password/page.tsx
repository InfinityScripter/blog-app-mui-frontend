import { CONFIG } from "src/config-global";
import { ResetPasswordView } from "src/sections/auth/reset-password";

// ----------------------------------------------------------------------

export const metadata = {
  title: `Сброс пароля - ${CONFIG.site.name}`,
};

export default function Page() {
  return <ResetPasswordView />;
}
