// Type definitions for the Smart Shopping Assistant

export interface AnalysisResult {
  ingredients: string[];
  nutrients: {
    protein: string;
    fats: string;
    carbs: string;
    sugar: string;
    sodium: string;
    calories: string;
  };
  harmful_flags: string[];
  health_rating: number; // 0-10
  rating_category: 'Healthy' | 'Moderate' | 'Unhealthy';
  summary: string;
  confidence: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  error?: string;
}

export interface AppState {
  // Image capture state
  capturedImage: string | null;
  
  // OCR state
  ocrResult: OCRResult | null;
  isProcessingOCR: boolean;
  
  // Analysis state
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  
  // Model state
  isModelLoaded: boolean;
  modelLoadingProgress: number;
  
  // Error state
  error: string | null;
  
  // Actions
  setCapturedImage: (image: string | null) => void;
  setOCRResult: (result: OCRResult | null) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsProcessingOCR: (isProcessing: boolean) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setIsModelLoaded: (isLoaded: boolean) => void;
  setModelLoadingProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export interface HarmfulIngredient {
  name: string;
  aliases: string[];
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface NutrientInfo {
  name: string;
  value: string;
  unit: string;
  dailyValue?: number;
  isGood?: boolean;
}
