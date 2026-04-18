import type { MediaAsset } from '../types/network';
import { networkApi } from './network';

export async function uploadMediaFile(
  file: File,
  ownerType: 'profile' | 'vehicle' | 'profile_post' | 'community' | 'community_post' | 'event',
  ownerId: string,
  onProgress?: (value: number) => void,
): Promise<Pick<MediaAsset, 'id' | 'url' | 'kind' | 'fileName' | 'mimeType' | 'size' | 'status'>> {
  const init = await networkApi.initUpload({
    ownerType,
    ownerId,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
  });

  const result = await new Promise<{ url: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', init.uploadUrl, true);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error('Upload failed'));
        }
      } else reject(new Error('Upload failed'));
    };
    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(file);
  });

  return {
    id: init.assetId,
    url: result.url,
    kind: file.type.startsWith('video/') ? 'video' : 'image',
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    status: 'uploaded',
  };
}
