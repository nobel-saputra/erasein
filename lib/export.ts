// Shared helper that re-encodes a processed (transparent) blob according to the
// user's chosen export settings: background color, format, and resolution scale.
import type { ImageRecord } from './db';

export interface ExportSettings {
  exportBgColor: string;
  exportFormat: 'png' | 'jpeg' | 'webp';
  exportResolution: 'low' | 'standard' | 'hd';
}

export const SCALE_MAP: Record<ExportSettings['exportResolution'], number> = {
  low: 0.5,
  standard: 1.0,
  hd: 2.0,
};

export const EXT_MAP: Record<ExportSettings['exportFormat'], string> = {
  png: 'png',
  jpeg: 'jpg',
  webp: 'webp',
};

// Returns true when the blob can be used as-is (no re-encode needed).
export function isPassthrough(s: ExportSettings): boolean {
  return s.exportBgColor === 'transparent' && s.exportFormat === 'png' && SCALE_MAP[s.exportResolution] === 1.0;
}

// Re-encode a transparent PNG blob into the desired output format/background/size.
export async function applyExportSettings(blob: Blob, s: ExportSettings): Promise<Blob> {
  const scale = SCALE_MAP[s.exportResolution];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new window.Image();
  const url = URL.createObjectURL(blob);
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.src = url;
    });
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    if (ctx) {
      if (s.exportBgColor !== 'transparent') {
        ctx.fillStyle = s.exportBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (s.exportFormat === 'jpeg') {
        // JPEG has no transparency; fall back to white.
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    const mimeType =
      s.exportFormat === 'jpeg' ? 'image/jpeg' : s.exportFormat === 'webp' ? 'image/webp' : 'image/png';
    return await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), mimeType, 0.9);
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Build a safe output filename from the original name.
export function buildFileName(originalName: string, s: ExportSettings): string {
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  const ext = EXT_MAP[s.exportFormat];
  return `${nameWithoutExt}-edited.${ext}`;
}

// Trigger a browser download for a blob.
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so the download has time to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Resolve the final blob + filename for a single image record given settings.
export async function resolveExport(img: ImageRecord, s: ExportSettings): Promise<{ blob: Blob; fileName: string } | null> {
  if (!img.processedBlob) return null;
  const blob = isPassthrough(s) ? img.processedBlob : await applyExportSettings(img.processedBlob, s);
  return { blob, fileName: buildFileName(img.originalName, s) };
}
