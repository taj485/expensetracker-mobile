// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { createProxyMiddleware } = require('http-proxy-middleware');

const config = getDefaultConfig(__dirname);

// Web preview only: the browser enforces CORS and the API only allows the deployed web app's
// origin, so `expo start --web` forwards /api/* to EXPO_PUBLIC_API_URL from this same origin —
// the same trick as the Angular client's /api proxy. Native apps don't enforce CORS and call
// the API directly (see src/config/env.ts), so this never runs on iOS/Android builds.
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (apiUrl) {
  const { origin, pathname } = new URL(apiUrl);

  const apiProxy = createProxyMiddleware({
    target: origin,
    pathFilter: pathname,
    changeOrigin: true,
    on: {
      // Server-to-server, so drop the browser Origin rather than have the API judge it.
      proxyReq: proxyReq => proxyReq.removeHeader('origin'),
    },
  });

  config.server.enhanceMiddleware = metroMiddleware => (req, res, next) =>
    apiProxy(req, res, () => metroMiddleware(req, res, next));
}

module.exports = config;
