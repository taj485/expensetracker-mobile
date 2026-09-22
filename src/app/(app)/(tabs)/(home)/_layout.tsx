import { Stack } from 'expo-router';

export default function HomeLayout() {
  // Home draws its own greeting header, as in the mockup.
  return <Stack screenOptions={{ headerShown: false }} />;
}
