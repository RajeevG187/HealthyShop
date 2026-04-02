/**
 * Model Service - Manages AI model loading and initialization
 * Uses RunAnywhere SDK for on-device LLM inference
 */

import { RunAnywhere, SDKEnvironment } from '@runanywhere/core';
import { LlamaCPP } from '@runanywhere/llamacpp';

// Model ID for ingredient analysis
const MODEL_ID = 'smollm2-360m-q8_0';

class ModelService {
  private isInitialized = false;
  private isModelLoaded = false;
  private modelId = MODEL_ID;

  /**
   * Initialize RunAnywhere SDK
   * Silently fails and allows app to continue with rule-based analysis
   */
  async initialize(onProgress?: (progress: number) => void): Promise<void> {
    onProgress?.(0.05);

    try {
      await RunAnywhere.initialize({
        environment: SDKEnvironment.Development,
      });

      LlamaCPP.register();
      this.isInitialized = true;
      onProgress?.(0.1);
    } catch {
      // Silent fail - app will use rule-based analysis
      onProgress?.(1.0);
      return;
    }

    try {
      await this.addModel(onProgress);
      await this.downloadAndLoadModel(onProgress);
    } catch {
      // Silent fail - app will use rule-based analysis
      onProgress?.(1.0);
    }
  }

  /**
   * Add model to registry
   */
  private async addModel(onProgress?: (progress: number) => void): Promise<void> {
    onProgress?.(0.1);

    const models = await RunAnywhere.getAvailableModels();
    const exists = models.some((m) => m.id === this.modelId);

    if (exists) {
      return;
    }

    await LlamaCPP.addModel({
      id: this.modelId,
      name: 'SmolLM2 360M Q8_0',
      url: 'https://huggingface.co/prithivMLmods/SmolLM2-360M-GGUF/resolve/main/SmolLM2-360M.Q8_0.gguf',
      memoryRequirement: 500_000_000, // 500MB
    });

    onProgress?.(0.2);
  }

  /**
   * Check if model is downloaded
   */
  private async checkModelDownloaded(modelId: string): Promise<boolean> {
    try {
      const modelInfo = await RunAnywhere.getModelInfo(modelId);
      return !!modelInfo?.localPath;
    } catch {
      return false;
    }
  }

  /**
   * Download and load model
   */
  private async downloadAndLoadModel(onProgress?: (progress: number) => void): Promise<void> {
    const isDownloaded = await this.checkModelDownloaded(this.modelId);

    if (!isDownloaded) {
      await RunAnywhere.downloadModel(this.modelId, (downloadProgress) => {
        const progress = 0.2 + downloadProgress.progress * 0.6;
        onProgress?.(progress);
      });
    } else {
      onProgress?.(0.8);
    }

    const modelInfo = await RunAnywhere.getModelInfo(this.modelId);

    if (!modelInfo?.localPath) {
      throw new Error('Model file not found');
    }

    await RunAnywhere.loadModel(modelInfo.localPath);

    this.isModelLoaded = true;
    onProgress?.(1.0);
  }

  /**
   * Check if model is ready
   */
  async isModelReady(): Promise<boolean> {
    return this.isInitialized && this.isModelLoaded;
  }

  /**
   * Get model loading status
   */
  getStatus(): { initialized: boolean; loaded: boolean } {
    return {
      initialized: this.isInitialized,
      loaded: this.isModelLoaded,
    };
  }

  /**
   * Unload model from memory
   */
  async unloadModel(): Promise<void> {
    if (this.isModelLoaded) {
      await RunAnywhere.unloadModel();
      this.isModelLoaded = false;
    }
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    await this.unloadModel();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const modelService = new ModelService();
