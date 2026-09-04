import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const isStaticExport = "false";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// next-intl request config lives under src/, so point the plugin at it
// explicitly (the default lookup is ./i18n/request.ts at the project root).
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Dev-only pages use a `.dev.tsx` (etc.) extension. Register those extensions
// as routable only in development, so dev-only routes (e.g. the component
// gallery under /dev) and their imports are entirely absent from prod builds.
const basePageExtensions = ["tsx", "ts", "jsx", "js"];
const pageExtensions =
  process.env.NODE_ENV === "development"
    ? [...basePageExtensions.map((ext) => `dev.${ext}`), ...basePageExtensions]
    : basePageExtensions;

// Baseline security headers. The deployment shipped only Vercel's default HSTS,
// which left three concrete gaps: the /dashboard/admin UI could be framed by any
// site (clickjacking), token-bearing URLs (/auth/verify?token=,
// /newsletter/confirm?token=) had no explicit referrer policy, and responses
// could be MIME-sniffed. No Content-Security-Policy here on purpose — MUI/emotion
// inject inline styles and Next inlines bootstrap scripts, so a script-src policy
// needs per-request nonces; frame-ancestors is the one CSP directive that is
// safe to ship standalone and is the modern half of X-Frame-Options.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The app uses none of these APIs; deny them so injected third-party code can't either.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig = {
  pageExtensions,
  turbopack: {
    root: import.meta.dirname,
  },
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // better-sqlite3 is a native module used only by the local-only LLM-stats
  // route (/api/llm-stats). Keep it external so Next doesn't try to bundle the
  // .node binary into the serverless output (which fails the Vercel build).
  serverExternalPackages: ["better-sqlite3"],
  env: {
    BUILD_STATIC_EXPORT: isStaticExport,
  },
  typescript: {
    // The whole repo type-checks clean (npx tsc --noEmit = 0). Let the build
    // enforce types instead of ignoring them.
    ignoreBuildErrors: false,
  },
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/lab": {
      transform: "@mui/lab/{{member}}",
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  ...(isStaticExport === "true" && {
    output: "export",
  }),
  experimental: {
    // Улучшает client-side navigation
    optimizeCss: true,
    // Распределение чанков для оптимизации кэша
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "framer-motion",
      "apexcharts",
      "react-apexcharts",
    ],
  },
};

export default withNextIntl(withBundleAnalyzer(nextConfig));
