import { Stack } from 'expo-router';

import { SelectedSpaceProvider, useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { SpacesSidebarProvider } from '@/features/spaces/SpacesSidebarProvider';
import { LoadingState } from '@/shared/components/QueryState';
import { radius } from '@/theme';

const sheetOptions = {
  presentation: 'formSheet',
  headerShown: false,
  sheetGrabberVisible: true,
  sheetCornerRadius: radius['2xl'],
} as const;

/** Signed-in area: the tabs, the sheets the tab bar opens over them, and the spaces sidebar. */
export default function AppLayout() {
  return (
    <SelectedSpaceProvider>
      <SpacesSidebarProvider>
        <AppNavigator />
      </SpacesSidebarProvider>
    </SelectedSpaceProvider>
  );
}

function AppNavigator() {
  const { spaces, isLoading, error } = useSelectedSpace();

  // Wait for the spaces list so a new user doesn't see the tabs flash before being redirected.
  if (isLoading) return <LoadingState />;

  // Mirrors the web shell: with no spaces nothing else works, so the user must create one first.
  // On a load error keep the tabs — their screens show the error with a retry.
  const needsFirstSpace = !error && spaces.length === 0;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!needsFirstSpace}>
        <Stack.Screen name="(tabs)" />
        {/* Tall detent: the review step lists every extracted item. */}
        <Stack.Screen name="scan" options={{ ...sheetOptions, sheetAllowedDetents: [0.92] }} />
        <Stack.Screen name="add-expense" options={{ ...sheetOptions, sheetAllowedDetents: [0.92] }} />
        <Stack.Screen name="new-space" options={{ ...sheetOptions, sheetAllowedDetents: [0.5, 0.92] }} />
        <Stack.Screen name="share-space" options={{ ...sheetOptions, sheetAllowedDetents: [0.6, 0.92] }} />
        <Stack.Screen name="space-settings" options={{ ...sheetOptions, sheetAllowedDetents: [0.6, 0.92] }} />
        <Stack.Screen name="space-members" options={{ ...sheetOptions, sheetAllowedDetents: [0.6, 0.92] }} />
      </Stack.Protected>
      <Stack.Protected guard={needsFirstSpace}>
        <Stack.Screen name="create-first-space" />
      </Stack.Protected>
    </Stack>
  );
}
