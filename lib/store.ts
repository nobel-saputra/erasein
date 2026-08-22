// Global state for the processing queue and export settings.
import { create } from 'zustand';

interface QueueState {
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
  
  setIsProcessing: (status: boolean) => void;
  setIsModelReady: (status: boolean) => void;
  setModelProgress: (isDownloading: boolean, progress: number) => void;
  resetQueue: () => void;
}

export const useQueueStore = create<QueueState>((set) => ({
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
  setIsProcessing: (status) => set({ isProcessing: status }),
  setIsModelReady: (status) => set({ isModelReady: status }),
  setModelProgress: (isDownloading, progress) => set({ isModelDownloading: isDownloading, modelProgress: progress }),
  resetQueue: () => set({ 
    isProcessing: false, 
    isModelReady: false,
    isModelDownloading: false,
    modelProgress: 0
  }),
}));