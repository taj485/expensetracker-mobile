import { Stack } from 'expo-router';

import { SelectedSpaceProvider } from '@/core/spaces/SelectedSpaceProvider';
import { radius } from '@/theme';

const sheetOptions = {
  presentation: 'formSheet',
  headerShown: false,
  sheetGrabberVisible: true,
  sheetCornerRadius: radius['2xl'],
} as const;

/** Signed-in area: the tabs, plus the Scan and Add sheets the tab bar opens over them. */
export default function AppLayout() {
  return (
    <SelectedSpaceProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scan" options={{ ...sheetOptions, sheetAllowedDetents: [0.85] }} />
        <Stack.Screen name="add-expense" options={{ ...sheetOptions, sheetAllowedDetents: [0.6, 1] }} />
      </Stack>
    </SelectedSpaceProvider>
  );
}
