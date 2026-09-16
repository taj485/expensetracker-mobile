import { Stack } from 'expo-router';

import { useLargeTitleScreenOptions } from '@/shared/navigation/useStackScreenOptions';

export default function ExpensesLayout() {
  const largeTitle = useLargeTitleScreenOptions();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ ...largeTitle, title: 'Expenses' }} />
      <Stack.Screen name="receipt-edit" options={{ title: 'Edit receipt', headerBackButtonDisplayMode: 'minimal' }} />
      <Stack.Screen
        name="[expenseId]"
        options={{
          // The purple hero runs under a clear bar with a white back button.
          title: '',
          headerTransparent: true,
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </Stack>
  );
}
