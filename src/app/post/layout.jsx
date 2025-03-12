import { MainLayout } from "src/layouts/main";

import { AuthProvider } from "../../auth/context/jwt";

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <MainLayout>{children}</MainLayout>
    </AuthProvider>
  );
}
