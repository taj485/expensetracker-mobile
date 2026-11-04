import * as Haptics from 'expo-haptics';

/**
 * The light tick iOS plays when a picker moves to a new value. Does nothing where haptics aren't
 * available: web, Android devices without a vibrator, or a development build made before
 * expo-haptics was added.
 */
export function selectionTick(): void {
  Haptics.selectionAsync().catch(() => {});
}
