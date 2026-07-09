// Locale-aware link: preserves the active language prefix on client-side
// navigation, matching the useRouter/usePathname wrappers in src/routes/hooks.
// A plain next/link here would drop the /en prefix on every internal click and
// lean on a middleware redirect to restore it (extra hop, lost locale on
// cookie-less clients).
import { Link as RouterLink } from "src/i18n/navigation";

export { RouterLink };
