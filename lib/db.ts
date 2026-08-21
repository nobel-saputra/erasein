// Local database layer for storing images and their processing state.
import Dexie, { type Table } from 'dexie';

export interface ImageRecord {
  id: string; // Unique identifier for each image.
  originalFile: Blob; // The original uploaded file.
  originalName: string; // Original file name for downloads.
  processedBlob?: Blob; // Resulting image with the background removed.
  status: 'waiting' | 'processing' | 'done' | 'error';
  errorMessage?: string;
  createdAt: number; // Timestamp used to order the queue.
}

export class BackgroundRemoverDB extends Dexie {
  images!: Table<ImageRecord, string>;

  constructor() {
    super('BackgroundRemoverDB');
    // Define indexes for fast lookups by id, status, and creation time.
    this.version(1).stores({
      images: 'id, status, createdAt'
    });
  }
}

export const db = new BackgroundRemoverDB();

// History retention window of one day in milliseconds.
export const HISTORY_RETENTION_MS = 24 * 60 * 60 * 1000;

// Remove images (of any status) that are older than the retention window.
// This keeps the local DB from growing unbounded with stale waiting/error rows.
export const deleteExpiredHistory = async (): Promise<number> => {
  const cutoff = Date.now() - HISTORY_RETENTION_MS;
  const expired = await db.images
    .where('createdAt')
    .below(cutoff)
    .toArray();
  if (expired.length > 0) {
    await db.images.bulkDelete(expired.map((img) => img.id));
  }
  return expired.length;
};