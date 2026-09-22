interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
}

/** Web: react-native-web's Alert.alert is a no-op, so fall back to the browser's confirm dialog. */
export function confirm({ title, message }: ConfirmOptions): Promise<boolean> {
  return Promise.resolve(window.confirm(`${title}\n\n${message}`));
}
