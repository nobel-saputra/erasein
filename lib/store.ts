// Global state for the processing queue and export settings.
import { create } from 'zustand';

interface QueueState {
  totalImages: number;
  processedCount: number;
  isProcessing: boolean;
  isModelReady: boolean;
  
  // Tracks the model download state and progress percentage.
  isModelDownloading: boolean;
  modelProgress: number;
  
  // Export options for output format, background color, and resolution.
  exportBgColor: string;
  exportFormat: 'png' | 'jpeg' | 'webp';
  exportResolution: 'low' | 'standard' | 'hd';
  setExportBgColor: (color: string) => void;
  setExportFormat: (format: 'png' | 'jpeg' | 'webp') => void;
  setExportResolution: (res: 'low' | 'standard' | 'hd') => void;
  
  setTotalImages: (total: number) => void;
  incrementProcessed: () => void;
  setIsProcessing: (status: boolean) => void;
  setIsModelReady: (status: boolean) => void;
  setModelProgress: (isDownloading: boolean, progress: number) => void;
  resetQueue: () => void;
  clearProcessing: () => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  totalImages: 0,
  processedCount: 0,
  isProcessing: false,
  isModelReady: false,
  
  isModelDownloading: false,
  modelProgress: 0,
  
  exportBgColor: 'transparent',
  exportFormat: 'png',
  exportResolution: 'standard',
  
  setExportBgColor: (color) => set({ exportBgColor: color }),
  setExportFormat: (format) => set({ exportFormat: format }),
  setExportResolution: (res) => set({ exportResolution: res }),
  setTotalImages: (total) => set({ totalImages: total }),
  incrementProcessed: () => set((state) => {
    const processedCount = state.processedCount + 1;
    // When all queued images are done, stop the "processing" state so the
    // banner and the dropzone disable condition no longer stay stuck on.
    const isProcessing = processedCount < state.totalImages;
    return { processedCount, isProcessing };
  }),
  setIsProcessing: (status) => set({ isProcessing: status }),
  setIsModelReady: (status) => set({ isModelReady: status }),
  setModelProgress: (isDownloading, progress) => set({ isModelDownloading: isDownloading, modelProgress: progress }),
  resetQueue: () => set({ 
    totalImages: 0, 
    processedCount: 0, 
    isProcessing: false, 
    isModelReady: false,
    isModelDownloading: false,
    modelProgress: 0
  }),
  clearProcessing: () => set({ isProcessing: false, totalImages: 0, processedCount: 0 }),
}));