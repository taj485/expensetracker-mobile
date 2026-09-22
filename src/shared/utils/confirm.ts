import { Alert } from 'react-native';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
}

/** Native confirmation alert. Resolves true when the user confirms. (Web: confirm.web.ts.) */
export function confirm({ title, message, confirmLabel, destructive = false }: ConfirmOptions): Promise<boolean> {
  return new Promise(resolve => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
