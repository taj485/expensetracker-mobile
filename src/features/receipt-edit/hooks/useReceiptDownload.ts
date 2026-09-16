import { useState } from 'react';

import { ApiError } from '@/core/api/apiClient';
import { useApiClient } from '@/core/api/useApiClient';
import { downloadReceiptImage } from '@/core/services/expenseService';
import { saveFile } from '@/shared/utils/saveFile';

/** Downloads a receipt's photo and hands it to the share sheet (native) or the browser (web). */
export function useReceiptDownload(spaceId: number, receiptId: number | null) {
  const api = useApiClient();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    if (receiptId == null) return;
    setDownloading(true);
    setError(null);
    try {
      const file = await downloadReceiptImage(api, spaceId, receiptId);
      await saveFile(file, 'Save receipt');
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 404
          ? 'No image is available for this receipt.'
          : "Couldn't download the receipt. Please try again.",
      );
    } finally {
      setDownloading(false);
    }
  }

  return { download, downloading, error };
}
