import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { Auth0Provider } from 'react-native-auth0';

import { env } from '@/config/env';
import { queryClient, useAppFocusRefetch } from '@/core/api/queryClient';
import { useSession } from '@/core/auth/useSession';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useAppFocusRefetch();

  return (
    <Auth0Provider domain={env.auth0.domain} clientId={env.auth0.clientId}>
      <QueryClientProvider client={queryClient}>
        <NavigationTheme>
          <StatusBar style="auto" />
          <RootNavigator />
        </NavigationTheme>
      </QueryClientProvider>
    </Auth0Provider>
  );
}

/**
 * Gives native headers, sheets and screen backgrounds the Recave colours in both appearances.
 * Also required to stop Liquid Glass toolbar buttons flickering in dark mode on iOS 26.
 */
function NavigationTheme({ children }: { children: React.ReactNode }) {
  const { isDark, colors } = useTheme();

  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.textBrand,
        background: colors.bgPage,
        card: colors.bgSurface,
        text: colors.textPrimary,
        border: colors.borderDefault,
      },
    };
  }, [isDark, colors]);

  return <ThemeProvider value={navigationTheme}>{children}</ThemeProvider>;
}

// Mobile equivalent of the web client's auth.guard.ts: signed-out users can only reach
// /login, signed-in users only the app.
function RootNavigator() {
  const { user, isLoading } = useSession();

  // Keep the splash screen up while stored credentials are restored, so a signed-in
  // user never sees the welcome screen flash.
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
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
