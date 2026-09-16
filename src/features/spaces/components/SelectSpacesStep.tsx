import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { ExpenseTable } from '@/core/models/expense-table.model';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { radius, spacing, type Theme, useTheme, useThemedStyles } from '@/theme';

interface SelectSpacesStepProps {
  spaces: ExpenseTable[];
  initialSpaceId: number;
  itemCount: number;
  saving: boolean;
  error: string | null;
  onBack: () => void;
  onSave: (spaceIds: number[]) => void;
}

/** Choose which spaces get the receipt — like the web app's "select tables" step. */
export function SelectSpacesStep({ spaces, initialSpaceId, itemCount, saving, error, onBack, onSave }: SelectSpacesStepProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [selected, setSelected] = useState<number[]>([initialSpaceId]);

  const toggle = (id: number) =>
    setSelected(current => (current.includes(id) ? current.filter(s => s !== id) : [...current, id]));

  const spaceLabel = selected.length === 1 ? 'space' : `${selected.length} spaces`;

  return (
    <>
      <View style={styles.header}>
        <AppText variant="title3" weight="700" accessibilityRole="header">
          Add to which spaces?
        </AppText>
        <AppText variant="subhead" tone="secondary">
          {`The ${itemCount === 1 ? 'expense' : `${itemCount} expenses`} will be added to every space you pick.`}
        </AppText>
      </View>

      <Card>
        {spaces.map((space, index) => {
          const checked = selected.includes(space.id);
          return (
            <Pressable
              key={space.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              accessibilityLabel={space.name}
              onPress={() => toggle(space.id)}
              style={({ pressed }) => [styles.row, index < spaces.length - 1 && styles.divider, pressed && styles.pressed]}>
              <View style={[styles.box, checked && { backgroundColor: colors.bgBrand, borderColor: colors.bgBrand }]}>
                {checked && (
                  <AppText variant="footnote" weight="700" tone="onBrand" maxFontSizeMultiplier={1}>
                    ✓
                  </AppText>
                )}
              </View>
              <AppText variant="body" style={styles.name}>
                {space.name}
              </AppText>
              {space.isStarred && (
                <AppText variant="subhead" style={{ color: colors.statusWarning }} accessibilityLabel="Starred">
                  ★
                </AppText>
              )}
            </Pressable>
          );
        })}
      </Card>

      {error && (
        <AppText variant="footnote" tone="negative" accessibilityRole="alert">
          {error}
        </AppText>
      )}

      <View style={styles.actions}>
        <Button title="Back" variant="secondary" onPress={onBack} disabled={saving} style={styles.secondary} />
        <Button
          title={selected.length === 0 ? 'Pick a space' : `Add to ${spaceLabel}`}
          onPress={() => onSave(selected)}
          disabled={selected.length === 0}
          loading={saving}
          style={styles.primary}
        />
      </View>
    </>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    header: { gap: spacing.xs },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.base,
      minHeight: 50,
    },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderDefault },
    pressed: { backgroundColor: colors.bgSurfaceAlt },
    box: {
      width: 24,
      height: 24,
      borderRadius: radius.sm - 2,
      borderWidth: 1.5,
      borderColor: colors.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: { flex: 1 },
    actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
    secondary: { flex: 1 },
    primary: { flex: 2 },
  });
