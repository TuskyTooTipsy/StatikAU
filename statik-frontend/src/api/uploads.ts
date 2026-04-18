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

  const result = await new Promise<{ url: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', init.uploadUrl, true);
    xhr.setRequestHeader('Content-Type', mimeType);
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
        try {
          const json = JSON.parse(xhr.responseText);
          reject(new Error(json.error || 'Upload failed'));
        } catch {
          reject(new Error('Upload failed'));
        }
      }
    };
    xhr.onerror = () => reject(new Error('Upload failed. Check your network and storage configuration.'));
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
