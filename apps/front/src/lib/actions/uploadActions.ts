import { BACKEND_URL } from '../constants';
import { getSession } from '../session';

export async function uploadThumbnailViaAPI(file: File): Promise<string> {
  try {
    const session = await getSession();
    const formData = new FormData();
    // Ensure MIME type is preserved when running in server environment
    let uploadBlob: Blob = file as unknown as Blob;
    try {
      const type = (file as any).type || 'image/png';
      const name = (file as any).name || 'upload.png';
      const buffer = await (file as any).arrayBuffer?.();
      if (buffer) {
        uploadBlob = new Blob([buffer], { type });
        formData.append('file', uploadBlob, name);
      } else {
        formData.append('file', file as any, name);
      }
    } catch {
      // Fallback if arrayBuffer is not available
      formData.append('file', file as any, (file as any).name || 'upload.png');
    }

    const res = await fetch(`${BACKEND_URL}/upload/thumbnail`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.accessToken ?? ''}`,
      },
      body: formData,
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      const message = data?.message || `Upload failed: ${res.status}`;
      throw new Error(message);
    }
    if (!data?.success || !data?.url) {
      throw new Error(data?.message || 'Upload failed');
    }
    return data.url as string;
  } catch (error) {
    console.error('Upload via REST API error:', error);
    throw error;
  }
}
