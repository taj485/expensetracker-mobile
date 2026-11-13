import { StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { spacing } from '@/theme';

interface ConsentStepProps {
  allowing: boolean;
  saveFailed: boolean;
  onAllow: () => void;
  onDecline: () => void;
}

/** Names the third-party AI and asks before any receipt photo is sent to it (App Store 5.1.2(i)). */
export function ConsentStep({ allowing, saveFailed, onAllow, onDecline }: ConsentStepProps) {
  return (
    <>
      <View style={styles.text}>
        <AppText variant="title3" weight="700" accessibilityRole="header">
          Scan receipts with Google Gemini
        </AppText>
        <AppText variant="body">
          Recave reads your receipts with Gemini, an AI service from Google. When you scan or choose a photo, the whole
          receipt photo is sent to Google so it can pick out the items and prices.
        </AppText>
        <AppText variant="body">
          {"Receipts can show your name, the last digits of your card and the shop's address. Google receives everything in the photo."}
        </AppText>
        <AppText variant="subhead" tone="secondary">
          You can turn this off at any time in Profile.
        </AppText>
      </View>

      <View style={styles.actions}>
        <Button title="Allow and scan" onPress={onAllow} loading={allowing} />
        <Button title="Add by hand instead" variant="secondary" onPress={onDecline} disabled={allowing} />
        {saveFailed && (
          <AppText variant="footnote" tone="negative" accessibilityRole="alert">
            {"Couldn't save your choice. Check your connection and try again."}
          </AppText>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  text: { gap: spacing.md },
  actions: { gap: spacing.md, marginTop: spacing.base },
});
