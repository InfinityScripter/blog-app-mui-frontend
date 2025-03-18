const isStaticExport = "false";

const nextConfig = {
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  env: {
    BUILD_STATIC_EXPORT: isStaticExport,
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

export default nextConfig;
