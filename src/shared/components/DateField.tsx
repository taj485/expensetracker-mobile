import { StyleSheet, View } from 'react-native';

import { todayLocalISODate } from '@/core/utils/dateUtils';
import { spacing } from '@/theme';

import { Chip } from './Chip';
import { TextField } from './TextField';

interface DateFieldProps {
  label?: string;
  /** YYYY-MM-DD */
  value: string;
  onChange: (date: string) => void;
  error?: string | null;
}

function yesterdayLocalISODate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Date entry as YYYY-MM-DD with one-tap Today / Yesterday — most expenses are one or the other.
 * A native date picker can replace the text input later without changing callers.
 */
export function DateField({ label = 'Date', value, onChange, error }: DateFieldProps) {
  const today = todayLocalISODate();
  const yesterday = yesterdayLocalISODate();

  return (
    <View style={styles.field}>
      <TextField
        label={label}
        value={value}
        onChangeText={onChange}
        placeholder="YYYY-MM-DD"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        error={error}
      />
      <View style={styles.quick}>
        <Chip label="Today" selected={value === today} onPress={() => onChange(today)} />
        <Chip label="Yesterday" selected={value === yesterday} onPress={() => onChange(yesterday)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  quick: { flexDirection: 'row', gap: spacing.sm },
});
