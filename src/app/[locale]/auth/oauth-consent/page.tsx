import { CONFIG } from "src/config-global";
import { OAuthConsentView } from "src/sections/auth/jwt";

export const metadata = {
  title: `Согласие на обработку данных - ${CONFIG.site.name}`,
};

export default function Page() {
  return <OAuthConsentView />;
}
