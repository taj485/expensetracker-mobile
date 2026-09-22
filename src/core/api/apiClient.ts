import { env } from '@/config/env';

import { downloadFile } from './downloadFile';

export type GetAccessToken = () => Promise<string>;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  put<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
  /** Multipart upload (e.g. a receipt photo). */
  postForm<T>(path: string, form: FormData): Promise<T>;
  /** Downloads a file response (e.g. a receipt photo) to somewhere the app can save or share it from. */
  download(path: string): Promise<DownloadedFile>;
}

export interface DownloadedFile {
  /** A local file:// uri on iOS/Android; an object URL on web. */
  uri: string;
  fileName: string;
  mimeType: string;
}

// Mobile equivalent of the web client's auth.interceptor.ts: every request carries
// the Auth0 access token as a Bearer header.
export function createApiClient(getAccessToken: GetAccessToken): ApiClient {
  async function send<T>(method: string, path: string, body: BodyInit | undefined, contentType?: string): Promise<T> {
    const token = await getAccessToken();
    const response = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        // Multipart bodies omit this so fetch can add the boundary itself.
        ...(contentType && { 'Content-Type': contentType }),
      },
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new ApiError(response.status, text || `${method} ${path} failed with ${response.status}`);
    }

    // 204s (and some 200s, e.g. star/unstar) have no body to parse.
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  const json = <T>(method: string, path: string, body?: unknown) =>
    send<T>(method, path, body !== undefined ? JSON.stringify(body) : undefined, body !== undefined ? 'application/json' : undefined);

  return {
    get: path => json('GET', path),
    post: (path, body) => json('POST', path, body),
    put: (path, body) => json('PUT', path, body),
    delete: path => json('DELETE', path),
    postForm: (path, form) => send('POST', path, form),
    download: async path => {
      const token = await getAccessToken();
      try {
        return await downloadFile(`${env.apiUrl}${path}`, { Authorization: `Bearer ${token}` });
      } catch (error) {
        // Non-2xx responses reject with the status code in the message (see downloadFile).
        const status = Number(/\b([45]\d\d)\b/.exec(String(error))?.[1] ?? 0);
        throw new ApiError(status, `GET ${path} download failed`);
      }
    },
  };
}
