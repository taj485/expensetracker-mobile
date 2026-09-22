import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

// Same limits as the web client's upload: big enough for the model to read small print,
// small enough to upload quickly on mobile data.
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.8;

/** The parts of a camera picture or library asset needed to prepare it for upload. */
export interface CapturedPicture {
  uri: string;
  width: number;
  height: number;
}

export interface ReceiptPhoto {
  uri: string;
  fileName: string;
}

export type PickResult = { status: 'picked'; photo: ReceiptPhoto } | { status: 'cancelled' };

/** Opens the photo library, then shrinks the chosen photo to an upload-ready JPEG. */
export async function pickLibraryPhoto(): Promise<PickResult> {
  // The iOS photo picker runs out of process and needs no library permission.
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });

  const asset = result.canceled ? undefined : result.assets[0];
  if (!asset) return { status: 'cancelled' };

  return { status: 'picked', photo: await toUploadJpeg(asset) };
}

/** Shrinks a picture from the in-app camera to an upload-ready JPEG, exactly as a library photo. */
export function prepareCapturedPhoto(picture: CapturedPicture): Promise<ReceiptPhoto> {
  return toUploadJpeg(picture);
}

/** Resizes to fit 1600×1600 and re-encodes as JPEG — which also converts iPhone HEIC photos. */
async function toUploadJpeg(picture: CapturedPicture): Promise<ReceiptPhoto> {
  const context = ImageManipulator.manipulate(picture.uri);
  if (Math.max(picture.width, picture.height) > MAX_DIMENSION) {
    // Constrain only the longer side; the other scales with the aspect ratio.
    context.resize(picture.width >= picture.height ? { width: MAX_DIMENSION } : { height: MAX_DIMENSION });
  }

  const image = await context.renderAsync();
  try {
    const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: JPEG_QUALITY });
    return { uri: saved.uri, fileName: `receipt-${Date.now()}.jpg` };
  } finally {
    image.release();
    context.release();
  }
}
