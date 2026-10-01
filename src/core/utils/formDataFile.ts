import { File } from 'expo-file-system';

/**
 * Appends a local image file to a multipart form.
 *
 * Native: Expo's fetch does not accept React Native's `{ uri, name, type }` form parts, but it
 * does accept expo-file-system's `File`, which implements Blob. The file name must be passed as
 * `append`'s third argument; otherwise Expo's FormData names the part `blob`. Web has its own
 * version in formDataFile.web.ts.
 */
export async function appendImageFile(form: FormData, field: string, uri: string, fileName: string): Promise<void> {
  form.append(field, new File(uri), fileName);
}
