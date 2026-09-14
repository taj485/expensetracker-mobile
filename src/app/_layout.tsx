import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';

import { env } from '@/config/env';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Auth0Provider domain={env.auth0.domain} clientId={env.auth0.clientId}>
      <StatusBar style="dark" />
      <RootNavigator />
    </Auth0Provider>
  );
}

// Mobile equivalent of the web client's auth.guard.ts: signed-out users can only
// reach /login, signed-in users can only reach the tabs.
function RootNavigator() {
  const { user, isLoading } = useAuth0();

  // Keep the splash screen up while stored credentials are restored, so a signed-in
  // user never sees the login screen flash.
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  const isSignedIn = user != null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
