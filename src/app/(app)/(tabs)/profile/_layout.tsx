import { Stack } from 'expo-router';

import { useLargeTitleScreenOptions } from '@/shared/navigation/useStackScreenOptions';

export default function ProfileLayout() {
  const largeTitle = useLargeTitleScreenOptions();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ ...largeTitle, title: 'Profile' }} />
    </Stack>
  );
}
