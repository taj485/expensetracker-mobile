import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { SelectSpacesStep } from '@/features/spaces/components/SelectSpacesStep';
import { EmptyState } from '@/shared/components/QueryState';
import { SheetHandle } from '@/shared/components/SheetHandle';
import { spacing, type Theme, useThemedStyles } from '@/theme';

import { ExpenseFormStep } from './components/ExpenseFormStep';
import { useAddExpense } from './hooks/useAddExpense';

/** Add expense sheet: form → choose spaces → save. */
export function AddExpenseSheet() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { spaces, selectedSpace } = useSelectedSpace();
  const flow = useAddExpense();

  return (
    <ScrollView
      style={styles.sheet}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      // Keeps the focused field above the keyboard inside the sheet.
      automaticallyAdjustKeyboardInsets>
      <SheetHandle />
      {!selectedSpace ? (
        <EmptyState title="No space selected" message="Create a space before adding expenses." />
      ) : flow.step === 'form' ? (
        <ExpenseFormStep
          draft={flow.draft}
          errors={flow.errors}
          onChange={flow.update}
          onCancel={() => router.back()}
          onContinue={flow.continueToSpaces}
        />
      ) : (
        <SelectSpacesStep
          spaces={spaces}
          initialSpaceId={selectedSpace.id}
          itemCount={1}
          saving={flow.saving}
          error={flow.saveError}
          onBack={() => flow.setStep('form')}
          onSave={async spaceIds => {
            if (await flow.save(spaceIds)) router.back();
          }}
        />
      )}
    </ScrollView>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    sheet: { flex: 1, backgroundColor: colors.bgElevated },
    content: { padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing['3xl'], gap: spacing.base },
  });
