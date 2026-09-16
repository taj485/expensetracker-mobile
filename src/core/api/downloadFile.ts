import { Directory, File, Paths } from 'expo-file-system';

import type { DownloadedFile } from './apiClient';

/** Downloads straight to the cache directory; the file name comes from the response headers. (Web: downloadFile.web.ts.) */
export async function downloadFile(url: string, headers: Record<string, string>): Promise<DownloadedFile> {
  const file = await File.downloadFileAsync(url, new Directory(Paths.cache), { headers, idempotent: true });
  return { uri: file.uri, fileName: file.name, mimeType: file.type };
}
