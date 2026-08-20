// lib/store.ts
import { create } from 'zustand';

interface QueueState {
  totalImages: number;
  processedCount: number;
  isProcessing: boolean;
  isModelReady: boolean;
  
  // State khusus Transformers.js
  isModelDownloading: boolean;
  modelProgress: number;
  
  // State for export background color & format
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
  incrementProcessed: () => set((state) => ({ processedCount: state.processedCount + 1 })),
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
}));