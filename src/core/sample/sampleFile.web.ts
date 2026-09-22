import type { DownloadedFile } from '@/core/api/apiClient';

// SAMPLE-DATA — an object URL, like downloadFile.web.ts returns for a real download.
export function sampleFile(content: string, fileName: string, mimeType: string): DownloadedFile {
  return { uri: URL.createObjectURL(new Blob([content], { type: mimeType })), fileName, mimeType };
}
