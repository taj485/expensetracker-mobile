/**
 * Web preview only: Stack.Toolbar crashes under Expo Router's experimental web modal stack
 * (EXPO_UNSTABLE_WEB_MODAL) and never renders on web anyway. Delete is available on iOS/Android.
 */
export function ExpenseActionsMenu(_props: { onDelete: () => void }) {
  return null;
}
