import type { DownloadedFile } from './apiClient';

/** Reads `filename="receipt-12.jpg"` (or the RFC 5987 `filename*=` form) from Content-Disposition. */
function fileNameFrom(disposition: string | null): string | null {
  if (!disposition) return null;
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (encoded) return decodeURIComponent(encoded[1]);
  return /filename="?([^";]+)"?/i.exec(disposition)?.[1] ?? null;
}

/** Fetches into a blob; the uri is an object URL the caller should revoke once it has used it. */
export async function downloadFile(url: string, headers: Record<string, string>): Promise<DownloadedFile> {
  const response = await fetch(url, { headers });
  // Same shape as expo-file-system's native error, so apiClient maps both the same way.
  if (!response.ok) throw new Error(`Unable to download: status ${response.status}`);
  const blob = await response.blob();
  return {
    uri: URL.createObjectURL(blob),
    fileName: fileNameFrom(response.headers.get('content-disposition')) ?? 'download',
    mimeType: blob.type,
  };
}
