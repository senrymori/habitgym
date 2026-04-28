import RNFS from 'react-native-fs';

const mediaFolder = `${RNFS.DocumentDirectoryPath}/exercise-media`;
const photoExtensions = new Set(['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'gif']);
const videoExtensions = new Set(['mp4', 'mov', 'm4v', 'avi', '3gp', 'mkv', 'webm']);

export function getExtensionFromUri(uri: string, fallbackByType: 'photo' | 'video'): string {
  const cleanUri = uri.split('?')[0].split('#')[0];
  const lastSegment = cleanUri.substring(cleanUri.lastIndexOf('/') + 1);
  const dotIndex = lastSegment.lastIndexOf('.');
  if (dotIndex >= 0 && dotIndex < lastSegment.length - 1) {
    const ext = lastSegment.substring(dotIndex + 1).toLowerCase();
    const allowed = fallbackByType === 'photo' ? photoExtensions : videoExtensions;
    if (allowed.has(ext)) return ext;
  }
  return fallbackByType === 'photo' ? 'jpg' : 'mp4';
}

function generateMediaId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

async function ensureMediaFolder(): Promise<void> {
  const exists = await RNFS.exists(mediaFolder);
  if (!exists) {
    await RNFS.mkdir(mediaFolder);
  }
}

function normalizeSourceUri(sourceUri: string): string {
  // iOS picker returns 'file://...' which RNFS.copyFile expects without scheme on some APIs;
  // normalize to plain path on iOS while leaving content:// URIs untouched on Android.
  if (sourceUri.startsWith('file://')) {
    return decodeURIComponent(sourceUri.substring('file://'.length));
  }
  return sourceUri;
}

export async function copyMediaToAppStorage(sourceUri: string, ext: string): Promise<string> {
  await ensureMediaFolder();
  const destPath = `${mediaFolder}/${generateMediaId()}.${ext}`;
  const normalizedSource = normalizeSourceUri(sourceUri);
  await RNFS.copyFile(normalizedSource, destPath);
  return destPath;
}

export async function unlinkMediaFile(uri: string): Promise<void> {
  try {
    const path = normalizeSourceUri(uri);
    const exists = await RNFS.exists(path);
    if (exists) {
      await RNFS.unlink(path);
    }
  } catch (e) {
    console.error('[exercise-media-utils] unlinkMediaFile failed', uri, e);
  }
}

export async function unlinkMediaFiles(uris: string[]): Promise<void> {
  if (uris.length === 0) return;
  await Promise.all(uris.map((uri) => unlinkMediaFile(uri)));
}
