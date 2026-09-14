import { Tabs } from 'expo-router';

import { AppTabBar } from '@/shared/components/tab-bar/AppTabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={props => <AppTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="expenses" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
