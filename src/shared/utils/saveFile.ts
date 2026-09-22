import * as Sharing from 'expo-sharing';

import type { DownloadedFile } from '@/core/api/apiClient';

/**
 * Opens the share sheet for a downloaded file, where iOS offers Save Image and Save to Files.
 * Resolves once the sheet closes. (Web: saveFile.web.ts.)
 */
export async function saveFile(file: DownloadedFile, dialogTitle: string): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing is not available on this device');
  await Sharing.shareAsync(file.uri, {
    mimeType: file.mimeType,
    UTI: file.mimeType.startsWith('image/') ? 'public.image' : undefined,
    dialogTitle,
  });
}
