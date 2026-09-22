import type { DownloadedFile } from '@/core/api/apiClient';

/** Browser download of a file fetched by downloadFile.web.ts, then frees its object URL. */
export async function saveFile(file: DownloadedFile, _dialogTitle: string): Promise<void> {
  const link = document.createElement('a');
  link.href = file.uri;
  link.download = file.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a moment to start the download before the URL goes away.
  setTimeout(() => URL.revokeObjectURL(file.uri), 1000);
}
