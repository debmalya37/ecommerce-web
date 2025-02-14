// next.config.js
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
          },
        },
      },
    ],
  });
  
  module.exports = withPWA({
    reactStrictMode: true,
    webpack(config, { isServer }) {
      if (!isServer) {
        config.resolve.fallback.fs = false;
      }
      return config;
    },
  });