/** Web: picker/manipulator URIs are blob: or data: URLs, so read them back into a Blob. */
export async function appendImageFile(form: FormData, field: string, uri: string, fileName: string): Promise<void> {
  const blob = await (await fetch(uri)).blob();
  form.append(field, blob, fileName);
}
