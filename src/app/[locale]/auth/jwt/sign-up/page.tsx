import { notFound } from "next/navigation";
import { CONFIG } from "src/config-global";
import { JwtSignUpView } from "src/sections/auth/jwt";

// ----------------------------------------------------------------------

export const metadata = { title: `Регистрация | JWT - ${CONFIG.site.name}` };

export default function Page() {
  // Registration collects personal data; when collection is disabled the route
  // does not exist (mirrors the backend sign-up gate).
  if (!CONFIG.features.pdCollection) {
    notFound();
  }

  return <JwtSignUpView />;
}
