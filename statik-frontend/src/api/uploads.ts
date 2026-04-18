import type { MediaAsset } from '../types/network';
import { networkApi } from './network';

const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  m4v: 'video/mp4',
};

function resolveMime(file: File) {
  if (file.type && file.type !== 'application/octet-stream') return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  return MIME_BY_EXT[ext] || 'application/octet-stream';
}

function uploadError(xhr: XMLHttpRequest) {
  try {
    const json = JSON.parse(xhr.responseText);
    return json.error || `Upload failed with HTTP ${xhr.status}`;
  } catch {
    return xhr.status ? `Upload failed with HTTP ${xhr.status}. Check VITE_API_BASE_URL, PUBLIC_SERVER_URL, CORS, and storage volume configuration.` : 'Upload failed before the server responded.';
  }
}

export async function uploadMediaFile(
  file: File,
  ownerType: 'profile' | 'vehicle' | 'profile_post' | 'community' | 'community_post' | 'event',
  ownerId: string,
  onProgress?: (value: number) => void,
): Promise<Pick<MediaAsset, 'id' | 'url' | 'kind' | 'fileName' | 'mimeType' | 'size' | 'status'>> {
  const mimeType = resolveMime(file);
  const init = await networkApi.initUpload({
    ownerType,
    ownerId,
    fileName: file.name,
    mimeType,
    size: file.size,
  });

  if (file.size > init.maxBytes) {
    throw new Error(`File is too large. Max upload size is ${Math.round(init.maxBytes / 1024 / 1024)}MB.`);
  }
  if (init.acceptedMimeTypes?.length && !init.acceptedMimeTypes.includes(mimeType)) {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  const result = await new Promise<{ url: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', init.uploadUrl, true);
    xhr.setRequestHeader('Content-Type', mimeType);
    xhr.timeout = 120000;
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error('Upload finished but returned an invalid response.'));
        }
      } else {
        reject(new Error(uploadError(xhr)));
      }
    };
    xhr.ontimeout = () => reject(new Error('Upload timed out. Retry or check Railway storage/network limits.'));
    xhr.onerror = () => reject(new Error('Upload failed. Check network, CORS, PUBLIC_SERVER_URL, VITE_API_BASE_URL, and storage configuration.'));
    xhr.send(file);
  });

  return {
    id: init.assetId,
    url: result.url,
    kind: mimeType.startsWith('video/') ? 'video' : 'image',
    fileName: file.name,
    mimeType,
    size: file.size,
    status: 'uploaded',
  };
}
