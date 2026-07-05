import { CONFIG } from "src/config-global";
import { VerifyView } from "src/sections/auth/verify";

// ----------------------------------------------------------------------

export const metadata = {
  title: `Подтверждение email - ${CONFIG.site.name}`,
};

export default function Page() {
  return <VerifyView />;
}
