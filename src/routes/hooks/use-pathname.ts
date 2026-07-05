// Locale-aware pathname: returns the path WITHOUT the language prefix, so
// active-link checks compare cleanly against the locale-less constants in
// src/routes/paths.ts.
export { usePathname } from "src/i18n/navigation";
