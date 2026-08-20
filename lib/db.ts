// src/lib/db.ts
import Dexie, { type Table } from 'dexie';

export interface ImageRecord {
  id: string; // Unique ID per image
  originalFile: Blob; // Original file
  originalName: string; // File name (e.g. product-photo.jpg)
  processedBlob?: Blob; // Transparent processed result
  status: 'waiting' | 'processing' | 'done' | 'error';
  errorMessage?: string;
  createdAt: number; // For sorting the queue
}

export class BackgroundRemoverDB extends Dexie {
  images!: Table<ImageRecord, string>;

  constructor() {
    super('BackgroundRemoverDB');
    // Create search index by id, status, and creation time
    this.version(1).stores({
      images: 'id, status, createdAt'
    });
  }
}

export const db = new BackgroundRemoverDB();

// How long images are kept in History: 1 day
export const HISTORY_RETENTION_MS = 24 * 60 * 60 * 1000;

// Delete all 'done' images older than 1 day
export const deleteExpiredHistory = async (): Promise<number> => {
  const cutoff = Date.now() - HISTORY_RETENTION_MS;
  const expired = await db.images
    .where('status')
    .equals('done')
    .and((img) => img.createdAt < cutoff)
    .toArray();
  if (expired.length > 0) {
    await db.images.bulkDelete(expired.map((img) => img.id));
  }
  return expired.length;
};