import { CONFIG } from "src/config-global";
import { UpdatePasswordView } from "src/sections/auth/update-password";

// ----------------------------------------------------------------------

export const metadata = {
  title: `Обновление пароля - ${CONFIG.site.name}`,
};

export default function Page() {
  return <UpdatePasswordView />;
}
