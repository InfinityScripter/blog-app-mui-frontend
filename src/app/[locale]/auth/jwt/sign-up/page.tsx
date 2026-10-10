import { notFound } from "next/navigation";
import { JwtSignUpView } from "src/sections/auth/jwt";
import { fetchPdCollectionEnabled } from "src/actions/settings-ssr";

// ----------------------------------------------------------------------

export const metadata = { title: "Регистрация | JWT" };

// Read the runtime flag per request (no ISR) so an admin toggle takes effect
// immediately: registration collects personal data, so when collection is
// disabled the route does not exist (mirrors the backend sign-up gate).
export const dynamic = "force-dynamic";

export default async function Page() {
  const pdCollectionEnabled = await fetchPdCollectionEnabled();
  if (!pdCollectionEnabled) {
    notFound();
  }

  return <JwtSignUpView />;
}
