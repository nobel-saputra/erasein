// Web Worker that runs the background removal model off the main thread.
import { removeBackground, Config } from '@imgly/background-removal';

self.addEventListener('message', async (event) => {
  const { id, file } = event.data;

  try {
    // Configure the high detail model used for processing.
    const config: Config = {
      model: 'isnet_fp16', 
      progress: (key, current, total) => {
        // Report model download progress back to the UI.
        if (total > 0 && key.includes('fetch')) {
          const percent = Math.round((current / total) * 100);
          self.postMessage({ id: 'system', type: 'download_progress', progress: percent });
        }
      }
    };

    // Remove the background from the provided image.
    const processedBlob = await removeBackground(file, config);
    
    // Notify the UI that the model download has finished.
    self.postMessage({ id: 'system', type: 'download_done' });
    
    // Send the processed image result back to the main thread.
    self.postMessage({ id, success: true, blob: processedBlob });
  } catch (error: unknown) {
    console.error("Worker Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    self.postMessage({ id, success: false, error: message });
  }
});