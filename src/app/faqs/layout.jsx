import {MainLayout} from "../../layouts/main";
import {SimpleLayout} from "../../layouts/simple";

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}
