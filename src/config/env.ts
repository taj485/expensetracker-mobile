import { Platform } from 'react-native';

// Expo inlines EXPO_PUBLIC_* at build time, so each variable must be read by its full
// literal name — `process.env[name]` would not be replaced.
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env.local and fill it in.`);
  }
  return value;
}

const apiUrl = required('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL);

export const env = {
  // The web dev preview calls the API through the dev server's /api proxy (metro.config.js)
  // to avoid CORS; native apps aren't subject to CORS and call the API directly.
  apiUrl: Platform.OS === 'web' && __DEV__ ? new URL(apiUrl).pathname.replace(/\/$/, '') : apiUrl,
  auth0: {
    domain: required('EXPO_PUBLIC_AUTH0_DOMAIN', process.env.EXPO_PUBLIC_AUTH0_DOMAIN),
    clientId: required('EXPO_PUBLIC_AUTH0_CLIENT_ID', process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID),
    audience: required('EXPO_PUBLIC_AUTH0_AUDIENCE', process.env.EXPO_PUBLIC_AUTH0_AUDIENCE),
  },
  // Optional: without it merchant logos fall back to initials.
  logoDevToken: process.env.EXPO_PUBLIC_LOGO_DEV_TOKEN ?? null,
  // SAMPLE-DATA — dev-only: skip Auth0 and serve built-in fake spaces/expenses (src/core/sample).
  // `__DEV__` is false in release builds, so this can never switch on in a shipped app.
  useSampleData: __DEV__ && process.env.EXPO_PUBLIC_USE_SAMPLE_DATA === 'true',
};
