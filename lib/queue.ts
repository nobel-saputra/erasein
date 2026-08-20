// lib/queue.ts
import PQueue from 'p-queue';
import { db } from './db';
import { useQueueStore } from './store';

export const imageQueue = new PQueue({ concurrency: 1 });

let bgWorker: Worker | null = null;

const initWorker = () => {
  if (typeof window !== 'undefined') {
    if (bgWorker) bgWorker.terminate(); 
    bgWorker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

    // GLOBAL LISTENER FOR MODEL DOWNLOAD PROGRESS
    bgWorker.addEventListener('message', (e) => {
      if (e.data.type === 'download_progress') {
        useQueueStore.getState().setModelProgress(true, Math.round(e.data.progress));
      } else if (e.data.type === 'download_done') {
        useQueueStore.getState().setModelProgress(false, 100);
      }
    });
  }
};

initWorker();

export const processImageTask = async (id: string, file: Blob, retries = 1) => {
  return new Promise<void>((resolve, reject) => {
    if (!bgWorker) return reject(new Error("Worker not ready"));

    const timeoutTimer = setTimeout(() => {
      bgWorker?.removeEventListener('message', handleMessage);
      handleFailure("Processing timeout (more than 2 minutes)");
    }, 120000); 

    const handleFailure = async (errorMsg: string) => {
      if (retries > 0) {
        console.warn(`[Retry] Retrying ${id}... Attempts left: ${retries}`);
        initWorker(); 
        try {
          await processImageTask(id, file, retries - 1);
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        await db.images.update(id, { status: 'error', errorMessage: errorMsg });
        reject(new Error(errorMsg));
      }
    };

    const handleMessage = async (e: MessageEvent) => {
      // Ignore system progress messages here
      if (e.data.id === 'system') return;

      if (e.data.id === id) {
        clearTimeout(timeoutTimer);
        bgWorker?.removeEventListener('message', handleMessage);
        
        if (e.data.success) {
          await db.images.update(id, { status: 'done', processedBlob: e.data.blob });
          useQueueStore.getState().incrementProcessed();
          useQueueStore.getState().setIsModelReady(true);
          resolve();
        } else {
          handleFailure(e.data.error);
        }
      }
    };

    bgWorker.addEventListener('message', handleMessage);
    db.images.update(id, { status: 'processing' });
    bgWorker.postMessage({ id, file });
  });
};