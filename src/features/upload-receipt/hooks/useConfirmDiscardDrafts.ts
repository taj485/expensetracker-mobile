import { useNavigation } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { useRef } from 'react';

import { confirm } from '@/shared/utils/confirm';

/**
 * While there are unsaved drafts, asks before the scan sheet is closed (swipe down, back
 * button). The native stack blocks the dismissal and routes it here instead.
 *
 * Returns `close`, which closes the sheet without asking — for when the drafts were saved.
 */
export function useConfirmDiscardDrafts(hasDrafts: boolean) {
  const navigation = useNavigation();
  const skipConfirm = useRef(false);

  usePreventRemove(hasDrafts, ({ data }) => {
    if (skipConfirm.current) {
      navigation.dispatch(data.action);
      return;
    }
    void confirm({
      title: 'Discard these expenses?',
      message: "The items you've reviewed haven't been saved yet.",
      confirmLabel: 'Discard',
      destructive: true,
    }).then(discard => {
      if (discard) navigation.dispatch(data.action);
    });
  });

  return {
    close: () => {
      skipConfirm.current = true;
      navigation.goBack();
    },
  };
}
