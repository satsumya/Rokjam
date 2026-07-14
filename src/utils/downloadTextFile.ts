import { Platform, Share } from 'react-native';

/** Trigger a text-file download on web; fall back to the system share sheet on native. */
export async function downloadTextFile(contents: string, filename: string, mimeType = 'application/json') {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const blob = new Blob([contents], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    try {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
    return;
  }

  await Share.share({
    title: filename,
    message: contents,
  });
}
