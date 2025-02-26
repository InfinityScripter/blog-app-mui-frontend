/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  env: {
    BUILD_STATIC_EXPORT: process.env.BUILD_STATIC_EXPORT || 'false',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_SERVER_URL 
          ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/:path*` 
          : 'https://blog-app-mui-backend.vercel.app/api/:path*',
      },
    ];
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // Output static export if specified in environment
  ...(process.env.BUILD_STATIC_EXPORT === 'true' && {
    output: 'export',
  }),
};

module.exports = nextConfig;
