import { focusManager, QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Expenses change rarely between screens; avoid refetching on every tab switch.
      staleTime: 30_000,
      retry: 1,
    },
  },
});

/**
 * React Native has no window focus event, so tell React Query when the app returns to the
 * foreground — stale queries then refetch, like a browser tab regaining focus.
 */
export function useAppFocusRefetch() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    });
    return () => subscription.remove();
  }, []);
}
