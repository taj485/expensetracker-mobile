import { Stack } from 'expo-router';

interface ExpenseActionsMenuProps {
  onDelete: () => void;
}

/** Native "⋯" header menu on the expense detail screen. */
export function ExpenseActionsMenu({ onDelete }: ExpenseActionsMenuProps) {
  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu icon="ellipsis" accessibilityLabel="Expense actions" tintColor="#FFFFFF">
        <Stack.Toolbar.MenuAction icon="trash" destructive onPress={onDelete}>
          Delete Expense
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
