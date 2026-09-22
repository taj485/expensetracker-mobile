import { type PermissionResponse, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { AppState, Linking } from 'react-native';

/**
 * - `checking`: status not known yet, or the first prompt is still on screen.
 * - `askable`: denied, but the system can show its prompt again (Android after one refusal).
 * - `blocked`: denied for good, or restricted on iOS; only Settings can turn it back on.
 */
export type CameraAccessState = 'checking' | 'granted' | 'askable' | 'blocked';

function toAccessState(permission: PermissionResponse | null, autoRequestDone: boolean): CameraAccessState {
  if (!permission) return 'checking';
  if (permission.granted) return 'granted';
  // Still undetermined after the automatic prompt means it was dismissed without an answer.
  if (permission.status === 'undetermined') return autoRequestDone ? 'askable' : 'checking';
  return permission.canAskAgain ? 'askable' : 'blocked';
}

/** Camera permission for the capture step: asks once on open and re-checks on return to the app. */
export function useCameraAccess() {
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  // A ref, so the prompt is requested once even when effects run twice in development.
  const autoRequested = useRef(false);
  const [autoRequestDone, setAutoRequestDone] = useState(false);

  // Tapping Scan is the request for the camera, so the system prompt appears straight away.
  useEffect(() => {
    if (permission?.status !== 'undetermined' || autoRequested.current) return;
    autoRequested.current = true;
    void requestPermission().finally(() => setAutoRequestDone(true));
  }, [permission?.status, requestPermission]);

  // The permission hook reads the status once; this picks up a change made in Settings.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', status => {
      if (status === 'active') void getPermission();
    });
    return () => subscription.remove();
  }, [getPermission]);

  return {
    state: toAccessState(permission, autoRequestDone),
    request: () => void requestPermission(),
    openSettings: () => void Linking.openSettings(),
  };
}
