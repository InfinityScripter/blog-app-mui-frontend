// Locale-aware router: preserves the active language prefix on push/replace.
// Everything imports useRouter from src/routes/hooks, so pointing it at the
// next-intl wrapper makes all programmatic navigation locale-aware at once.
// The signature is a superset of next/navigation's (push/replace accept an
// optional { locale } second arg), so existing single-arg calls are unchanged.
export { useRouter } from "src/i18n/navigation";
