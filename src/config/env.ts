// Expo inlines EXPO_PUBLIC_* at build time, so each variable must be read by its full
// literal name — `process.env[name]` would not be replaced.
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env.local and fill it in.`);
  }
  return value;
}

export const env = {
  apiUrl: required('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL),
  auth0: {
    domain: required('EXPO_PUBLIC_AUTH0_DOMAIN', process.env.EXPO_PUBLIC_AUTH0_DOMAIN),
    clientId: required('EXPO_PUBLIC_AUTH0_CLIENT_ID', process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID),
    audience: required('EXPO_PUBLIC_AUTH0_AUDIENCE', process.env.EXPO_PUBLIC_AUTH0_AUDIENCE),
  },
};
