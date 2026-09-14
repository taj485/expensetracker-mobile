import { Stack } from 'expo-router';

import type { ExpenseTable } from '@/core/models/expense-table.model';
import type { ExpenseCategory } from '@/core/models/expense.model';
import { ALL_CATEGORIES } from '@/core/utils/categoryUtils';

interface ExpensesToolbarProps {
  spaces: ExpenseTable[];
  selectedSpace: ExpenseTable;
  onSelectSpace: (spaceId: number) => void;
  onToggleStar: () => void;
  category: ExpenseCategory | null;
  onSelectCategory: (category: ExpenseCategory | null) => void;
}

/**
 * Native header menus: switch space (starred first) and filter by category.
 * Stack.Toolbar is alpha in SDK 57; SF Symbol icons render on iOS only.
 */
export function ExpensesToolbar({
  spaces,
  selectedSpace,
  onSelectSpace,
  onToggleStar,
  category,
  onSelectCategory,
}: ExpensesToolbarProps) {
  const orderedSpaces = [...spaces].sort((a, b) => Number(b.isStarred) - Number(a.isStarred));

  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu
        icon={category ? 'line.3.horizontal.decrease.circle.fill' : 'line.3.horizontal.decrease.circle'}
        accessibilityLabel="Filter by category">
        <Stack.Toolbar.MenuAction isOn={category === null} onPress={() => onSelectCategory(null)}>
          All categories
        </Stack.Toolbar.MenuAction>
        <Stack.Toolbar.Menu inline title="Category">
          {ALL_CATEGORIES.map(option => (
            <Stack.Toolbar.MenuAction key={option} isOn={category === option} onPress={() => onSelectCategory(option)}>
              {option}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
      </Stack.Toolbar.Menu>

      <Stack.Toolbar.Menu icon="square.stack.3d.up" accessibilityLabel="Switch space" title="Spaces">
        <Stack.Toolbar.Menu inline title="Switch space">
          {orderedSpaces.map(space => (
            <Stack.Toolbar.MenuAction
              key={space.id}
              icon={space.isStarred ? 'star.fill' : undefined}
              isOn={space.id === selectedSpace.id}
              onPress={() => onSelectSpace(space.id)}>
              {space.name}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
        {/* The web app won't unstar the only space, so neither do we. */}
        {spaces.length > 1 && (
          <Stack.Toolbar.MenuAction icon={selectedSpace.isStarred ? 'star.slash' : 'star'} onPress={onToggleStar}>
            {selectedSpace.isStarred ? 'Unstar this space' : 'Star this space'}
          </Stack.Toolbar.MenuAction>
        )}
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
