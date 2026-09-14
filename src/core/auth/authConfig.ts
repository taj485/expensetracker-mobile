import { env } from '@/config/env';

// offline_access issues a refresh token, so users stay signed in between app launches.
export const AUTH_SCOPE = 'openid profile email offline_access';

// The API validates the token's audience, so it must be requested on login and when
// fetching credentials — without it Auth0 returns an opaque token the API rejects.
export const AUTH_AUDIENCE = env.auth0.audience;
