import { CameraView } from 'expo-camera';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/AppText';
import { FlashIcon } from '@/shared/icons/AppIcons';
import { neutral, radius, spacing } from '@/theme';

import type { CapturedPicture } from '../utils/receiptPhoto';
import { CaptureGuide } from './CaptureGuide';

export const CAPTURE_HINT = 'Lay the receipt flat in good light, with every line in shot';

interface CameraPreviewProps {
  torchOn: boolean;
  onToggleTorch: () => void;
  /** Resolves once the picture has been handed on, so the shutter stays disabled until then. */
  onCapture: (picture: CapturedPicture) => Promise<void>;
  onCaptureError: () => void;
  onMountError: () => void;
}

/** Live rear-camera preview filling `ReceiptFrame`, with a shutter and a flash (torch) toggle. */
export function CameraPreview({ torchOn, onToggleTorch, onCapture, onCaptureError, onMountError }: CameraPreviewProps) {
  const camera = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  // State updates land after a render, so a quick second tap is stopped by this ref instead.
  const captureInFlight = useRef(false);

  const shutterDisabled = !ready || capturing;
  const flashColor = torchOn ? neutral[900] : neutral[0];

  async function capture() {
    if (!camera.current || captureInFlight.current) return;
    captureInFlight.current = true;
    setCapturing(true);
    try {
      // Defaults on purpose: full quality (it's re-encoded anyway), shutter sound, orientation applied.
      const picture = await camera.current.takePictureAsync();
      await onCapture(picture);
    } catch {
      onCaptureError();
    } finally {
      captureInFlight.current = false;
      setCapturing(false);
    }
  }

  return (
    <>
      <CameraView
        ref={camera}
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torchOn}
        onCameraReady={() => setReady(true)}
        onMountError={onMountError}
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <CaptureGuide message={CAPTURE_HINT} style={styles.guide} />

        <Pressable
          onPress={capture}
          disabled={shutterDisabled}
          accessibilityRole="button"
          accessibilityLabel="Take photo"
          accessibilityState={{ disabled: shutterDisabled }}
          style={({ pressed }) => [styles.shutter, shutterDisabled && styles.disabled, pressed && styles.pressed]}>
          <View style={styles.shutterCore} />
        </Pressable>
      </View>

      <Pressable
        onPress={onToggleTorch}
        accessibilityRole="switch"
        accessibilityLabel="Flash"
        accessibilityState={{ checked: torchOn }}
        hitSlop={spacing.sm}
        style={[styles.flash, torchOn && styles.flashOn]}>
        <FlashIcon color={flashColor} />
        <AppText variant="footnote" weight="600" style={{ color: flashColor }}>
          {torchOn ? 'On' : 'Off'}
        </AppText>
      </Pressable>
    </>
  );
}

const SHUTTER_SIZE = 64;

// Drawn over the camera image, so these are light-on-dark overlays in both appearances.
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.base,
    paddingBottom: spacing.md,
  },
  // Narrower than the default and shortened by the shutter, so the flash toggle clears it.
  guide: { flex: 1, height: undefined, width: '55%', pointerEvents: 'none' },
  shutter: {
    width: SHUTTER_SIZE,
    height: SHUTTER_SIZE,
    borderRadius: radius.full,
    borderWidth: 4,
    borderColor: neutral[0],
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCore: {
    width: SHUTTER_SIZE - 16,
    height: SHUTTER_SIZE - 16,
    borderRadius: radius.full,
    backgroundColor: neutral[0],
  },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.4 },
  flash: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(23, 21, 38, 0.55)',
  },
  // Filled and high-contrast, so "on" reads at a glance (AC-2.2).
  flashOn: { backgroundColor: neutral[0], borderColor: neutral[0] },
});
