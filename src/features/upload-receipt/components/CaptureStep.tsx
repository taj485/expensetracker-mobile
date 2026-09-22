import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { radius, spacing, type Theme, useThemedStyles } from '@/theme';

import { type CameraAccessState, useCameraAccess } from '../hooks/useCameraAccess';
import type { CapturedPicture } from '../utils/receiptPhoto';
import { CAPTURE_HINT, CameraPreview } from './CameraPreview';
import { CaptureGuide } from './CaptureGuide';
import { ReceiptFrame } from './ReceiptFrame';

interface CaptureStepProps {
  error: string | null;
  torchOn: boolean;
  onToggleTorch: () => void;
  onCapture: (picture: CapturedPicture) => Promise<void>;
  onCaptureError: () => void;
  onChoosePhoto: () => void;
}

export function CaptureStep({ error, torchOn, onToggleTorch, onCapture, onCaptureError, onChoosePhoto }: CaptureStepProps) {
  const styles = useThemedStyles(createStyles);
  const camera = useCameraAccess();
  const [mountFailed, setMountFailed] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <AppText variant="title3" weight="700" accessibilityRole="header">
          Scan receipt
        </AppText>
        <AppText variant="subhead" tone="secondary">
          {"Snap a photo or choose one — we'll find the expenses for you."}
        </AppText>
      </View>

      <ReceiptFrame>
        {camera.state === 'granted' && !mountFailed ? (
          <CameraPreview
            torchOn={torchOn}
            onToggleTorch={onToggleTorch}
            onCapture={onCapture}
            onCaptureError={onCaptureError}
            onMountError={() => setMountFailed(true)}
          />
        ) : (
          <NoPreviewGuide
            state={camera.state}
            mountFailed={mountFailed}
            onAllow={camera.request}
            onOpenSettings={camera.openSettings}
          />
        )}
      </ReceiptFrame>

      <View style={styles.note}>
        <AppText variant="footnote" importantForAccessibility="no">
          ✨
        </AppText>
        <AppText variant="footnote" tone="brand" style={styles.noteText}>
          {"Items, merchant and totals are pulled out automatically. You can check everything before it's saved."}
        </AppText>
      </View>

      {error && (
        <AppText variant="footnote" tone="negative" accessibilityRole="alert">
          {error}
        </AppText>
      )}

      <Button title="Choose photo" variant="secondary" onPress={onChoosePhoto} />
    </>
  );
}

interface NoPreviewGuideProps {
  state: CameraAccessState;
  mountFailed: boolean;
  onAllow: () => void;
  onOpenSettings: () => void;
}

/** What the frame shows instead of the preview: why there's no camera, and the way forward. */
function NoPreviewGuide({ state, mountFailed, onAllow, onOpenSettings }: NoPreviewGuideProps) {
  if (mountFailed) {
    return (
      <CaptureGuide
        title="Camera unavailable"
        message="Couldn't start the camera. You can still choose a photo instead."
      />
    );
  }

  switch (state) {
    case 'askable':
      return (
        <CaptureGuide message="Camera access is off. Allow it to scan receipts here, or choose a photo instead.">
          <Button title="Allow camera" variant="ghostOnBrand" onPress={onAllow} />
        </CaptureGuide>
      );
    case 'blocked':
      return (
        <CaptureGuide message="Camera access is off. Allow it in Settings, or choose a photo instead.">
          <Button title="Open Settings" variant="ghostOnBrand" onPress={onOpenSettings} />
        </CaptureGuide>
      );
    default:
      // Still checking: the plain guide with no buttons, behind the system prompt if one is up.
      return <CaptureGuide message={CAPTURE_HINT} />;
  }
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    header: { gap: spacing.xs },
    note: {
      flexDirection: 'row',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.borderFocus,
      backgroundColor: colors.bgBrandSoft,
    },
    noteText: { flex: 1 },
  });
