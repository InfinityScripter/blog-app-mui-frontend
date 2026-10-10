import { OAuthConsentView } from "src/sections/auth/jwt";

export const metadata = {
  title: "Согласие на обработку данных",
};

export default function Page() {
  return <OAuthConsentView />;
}
