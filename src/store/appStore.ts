/**
 * Global state management using Zustand
 */

import { create } from 'zustand';
import { AppState } from '../types';

export const useAppStore = create<AppState>((set) => ({
  // Image state
  capturedImage: null,
  
  // OCR state
  ocrResult: null,
  isProcessingOCR: false,
  
  // Analysis state
  analysisResult: null,
  isAnalyzing: false,
  
  // Model state
  isModelLoaded: false,
  modelLoadingProgress: 0,
  
  // Error state
  error: null,
  
  // Actions
  setCapturedImage: (image) => set({ capturedImage: image }),
  
  setOCRResult: (result) => set({ ocrResult: result }),
  
  setAnalysisResult: (result) => set({ analysisResult: result }),
  
  setIsProcessingOCR: (isProcessing) => set({ isProcessingOCR: isProcessing }),
  
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing: isAnalyzing }),
  
  setIsModelLoaded: (isLoaded) => set({ isModelLoaded: isLoaded }),
  
  setModelLoadingProgress: (progress) => set({ modelLoadingProgress: progress }),
  
  setError: (error) => set({ error }),
  
  reset: () => set({
    capturedImage: null,
    ocrResult: null,
    analysisResult: null,
    isProcessingOCR: false,
    isAnalyzing: false,
    error: null,
  }),
}));
