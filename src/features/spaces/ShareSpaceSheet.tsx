import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { apiErrorMessage } from '@/core/api/apiErrors';
import { useInviteMember } from '@/core/queries/spaceQueries';
import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { SheetHandle } from '@/shared/components/SheetHandle';
import { TextField } from '@/shared/components/TextField';
import { spacing, type Theme, useTheme, useThemedStyles } from '@/theme';

import { MembersList } from './components/MembersList';

/** Invite an existing Recave user onto a space — the web app's "Share this space" dialog. */
export function ShareSpaceSheet() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { spaceId } = useLocalSearchParams<{ spaceId: string }>();
  const { spaces } = useSelectedSpace();
  const space = spaces.find(s => s.id === Number(spaceId));
  const invite = useInviteMember();

  const [email, setEmail] = useState('');
  const [makeAdmin, setMakeAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);

  async function submit() {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Email is required.');
      return;
    }
    if (!space) return;

    setError(null);
    try {
      await invite.mutateAsync({ expenseTableId: space.id, inviteeEmail: trimmed, isAdmin: makeAdmin });
      setInvitedEmail(trimmed);
      setEmail('');
      setMakeAdmin(false);
    } catch (e) {
      setError(apiErrorMessage(e, 'Failed to invite user. Please try again.'));
    }
  }

  return (
    <ScrollView
      style={styles.sheet}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <SheetHandle />
      <View style={styles.header}>
        <AppText variant="title3" weight="700" accessibilityRole="header">
          Share this space
        </AppText>
        <AppText variant="subhead" tone="secondary">
          {space ? `Invite an existing Recave user to "${space.name}" by email.` : 'Invite an existing Recave user by email.'}
        </AppText>
      </View>

      {invitedEmail && (
        <View style={styles.success} accessibilityRole="alert">
          <AppText variant="footnote" weight="600" style={{ color: colors.textPositive }}>
            {`Invited ${invitedEmail}. They'll see this space next time they open Recave.`}
          </AppText>
        </View>
      )}

      <TextField
        label="Email"
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (error) setError(null);
          if (invitedEmail) setInvitedEmail(null);
        }}
        placeholder="person@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={submit}
        error={error}
        autoFocus
      />

      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <AppText variant="body">Make this person an admin</AppText>
          <AppText variant="footnote" tone="secondary">
            Admins can invite others and delete the space.
          </AppText>
        </View>
        <Switch
          accessibilityLabel="Make this person an admin"
          value={makeAdmin}
          onValueChange={setMakeAdmin}
          trackColor={{ true: colors.bgBrand, false: colors.borderStrong }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.actions}>
        <Button title={invitedEmail ? 'Done' : 'Cancel'} variant="secondary" onPress={() => router.back()} style={styles.action} />
        <Button title="Invite" onPress={submit} loading={invite.isPending} style={styles.action} />
      </View>

      {space && (
        <View style={styles.members}>
          <AppText variant="footnote" weight="600" tone="secondary" style={styles.membersLabel}>
            Already in this space
          </AppText>
          {/* Refreshes after each invite, so the new person appears here straight away. */}
          <MembersList spaceId={space.id} />
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    sheet: { flex: 1, backgroundColor: colors.bgElevated },
    content: { padding: spacing.lg, paddingTop: spacing.xl, gap: spacing.lg },
    header: { gap: spacing.xs },
    success: { padding: spacing.md, borderRadius: 12, backgroundColor: colors.bgSurfaceAlt },
    switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    switchText: { flex: 1, gap: spacing['2xs'] },
    actions: { flexDirection: 'row', gap: spacing.md },
    action: { flex: 1 },
    members: { gap: spacing.sm, marginTop: spacing.sm },
    membersLabel: { textTransform: 'uppercase', letterSpacing: 0.5 },
  });
