import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

// Same limits as the web client's upload: big enough for the model to read small print,
// small enough to upload quickly on mobile data.
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.8;

export type PhotoSource = 'camera' | 'library';

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

export type PickResult = { status: 'picked'; photo: ReceiptPhoto } | { status: 'cancelled' } | { status: 'denied' };

/** Opens the system camera or photo library, then shrinks the photo to an upload-ready JPEG. */
export async function pickReceiptPhoto(source: PhotoSource): Promise<PickResult> {
  const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 1 };

  let result: ImagePicker.ImagePickerResult;
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return { status: 'denied' };
    result = await ImagePicker.launchCameraAsync(options);
  } else {
    // The iOS photo picker runs out of process and needs no library permission.
    result = await ImagePicker.launchImageLibraryAsync(options);
  }

  const asset = result.canceled ? undefined : result.assets[0];
  if (!asset) return { status: 'cancelled' };

  return { status: 'picked', photo: await toUploadJpeg(asset) };
}

/** Resizes to fit 1600×1600 and re-encodes as JPEG — which also converts iPhone HEIC photos. */
async function toUploadJpeg(asset: ImagePicker.ImagePickerAsset): Promise<ReceiptPhoto> {
  const context = ImageManipulator.manipulate(asset.uri);
  if (Math.max(asset.width, asset.height) > MAX_DIMENSION) {
    // Constrain only the longer side; the other scales with the aspect ratio.
    context.resize(asset.width >= asset.height ? { width: MAX_DIMENSION } : { height: MAX_DIMENSION });
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
