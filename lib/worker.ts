// lib/worker.ts
import { removeBackground, Config } from '@imgly/background-removal';

self.addEventListener('message', async (event) => {
  const { id, file } = event.data;

  try {
    // PRO config: Use high-resolution model (isnet_fp16)
    const config: Config = {
      model: 'isnet_fp16', 
      progress: (key, current, total) => {
        // Capture model download events and send to UI
        if (total > 0 && key.includes('fetch')) {
          const percent = Math.round((current / total) * 100);
          self.postMessage({ id: 'system', type: 'download_progress', progress: percent });
        }
      }
    };

    // Process the background removal
    const processedBlob = await removeBackground(file, config);
    
    // Signal that the model has finished downloading and is cached
    self.postMessage({ id: 'system', type: 'download_done' });
    
    // Send the final result to the Main Thread
    self.postMessage({ id, success: true, blob: processedBlob });
  } catch (error: unknown) {
    console.error("Worker Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    self.postMessage({ id, success: false, error: message });
  }
});