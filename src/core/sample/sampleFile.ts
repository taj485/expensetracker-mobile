import { File, Paths } from 'expo-file-system';

import type { DownloadedFile } from '@/core/api/apiClient';

// SAMPLE-DATA — writes generated content to the cache so it can be shared like a real download. (Web: sampleFile.web.ts.)
export function sampleFile(content: string, fileName: string, mimeType: string): DownloadedFile {
  const file = new File(Paths.cache, fileName);
  file.write(content);
  return { uri: file.uri, fileName, mimeType };
}
