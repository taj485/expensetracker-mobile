import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useCreateSpace } from '@/core/queries/spaceQueries';
import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { Button } from '@/shared/components/Button';
import { TextField } from '@/shared/components/TextField';
import { spacing } from '@/theme';

// Same limit the web client and API enforce.
const MAX_NAME_LENGTH = 200;

interface CreateSpaceFormProps {
  /** Called once the space exists and is selected. */
  onCreated?: () => void;
}

export function CreateSpaceForm({ onCreated }: CreateSpaceFormProps) {
  const { selectSpace } = useSelectedSpace();
  const createSpace = useCreateSpace();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required.');
      return;
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      setError('Name is too long.');
      return;
    }

    setError(null);
    try {
      // mutateAsync rather than mutate's callbacks: creating the first space swaps this screen
      // for the tabs, and per-call callbacks are skipped once the component unmounts.
      const { id } = await createSpace.mutateAsync({ name: trimmed });
      // Make the new space the one Home and Expenses show.
      selectSpace(id);
      onCreated?.();
    } catch {
      setError('Failed to create the space. Please try again.');
    }
  }

  return (
    <View style={styles.form}>
      <TextField
        label="Space name"
        placeholder="e.g. Household expenses"
        value={name}
        onChangeText={text => {
          setName(text);
          if (error) setError(null);
        }}
        error={error}
        autoFocus
        autoCapitalize="sentences"
        autoCorrect={false}
        maxLength={MAX_NAME_LENGTH}
        returnKeyType="done"
        onSubmitEditing={submit}
        editable={!createSpace.isPending}
      />
      <Button title="Create space" onPress={submit} loading={createSpace.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
});
