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
   */
  async initialize(onProgress?: (progress: number) => void): Promise<void> {
    try {
      console.log('Initializing RunAnywhere SDK...');

      // Initialize SDK
      await RunAnywhere.initialize({
        environment: SDKEnvironment.Development,
      });

      // Register LlamaCPP backend
      LlamaCPP.register();

      this.isInitialized = true;
      console.log('SDK initialized successfully');

      // Add model
      await this.addModel(onProgress);

      // Download and load model
      await this.downloadAndLoadModel(onProgress);
    } catch (error) {
      console.error('SDK initialization error:', error);
      throw new Error('Failed to initialize AI models');
    }
  }

  /**
   * Add model to registry
   */
  private async addModel(onProgress?: (progress: number) => void): Promise<void> {
    try {
      onProgress?.(0.1);

      // Check if model is already registered
      const models = await RunAnywhere.getAvailableModels();
      const exists = models.some((m) => m.id === this.modelId);

      if (exists) {
        console.log('Model already registered');
        return;
      }

      console.log('Adding SmolLM2 360M Q8_0 model...');

      await LlamaCPP.addModel({
        id: this.modelId,
        name: 'SmolLM2 360M Q8_0',
        url: 'https://huggingface.co/prithivMLmods/SmolLM2-360M-GGUF/resolve/main/SmolLM2-360M.Q8_0.gguf',
        memoryRequirement: 500_000_000, // 500MB
      });

      console.log('Model added successfully');
      onProgress?.(0.2);
    } catch (error) {
      console.error('Add model error:', error);
      throw error;
    }
  }

  /**
   * Check if model is downloaded (per RunAnywhere docs)
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
    try {
      // Check if model is already downloaded (using proper method)
      const isDownloaded = await this.checkModelDownloaded(this.modelId);

      if (!isDownloaded) {
        console.log('Downloading model...');

        await RunAnywhere.downloadModel(this.modelId, (downloadProgress) => {
          // Progress is 0-1, scale to 20%-80% range
          const progress = 0.2 + downloadProgress.progress * 0.6;
          onProgress?.(progress);
          console.log(`Download progress: ${(downloadProgress.progress * 100).toFixed(1)}%`);
        });

        console.log('Download completed');
      } else {
        console.log('Model already downloaded');
        onProgress?.(0.8);
      }

      // Load model into memory
      console.log('Loading model into memory...');
      const modelInfo = await RunAnywhere.getModelInfo(this.modelId);

      if (!modelInfo?.localPath) {
        throw new Error('Model file not found');
      }

      await RunAnywhere.loadModel(modelInfo.localPath);

      this.isModelLoaded = true;
      onProgress?.(1.0);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Download/load model error:', error);
      throw error;
    }
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
      console.log('Model unloaded');
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
