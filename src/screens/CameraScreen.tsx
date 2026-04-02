/**
 * Camera Screen
 * Allows users to capture or upload product label images
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useAppStore } from '../store/appStore';
import { ocrService } from '../services/ocrService';
import { modelService } from '../services/modelService';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const CameraScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    capturedImage,
    setCapturedImage,
    setOCRResult,
    setIsProcessingOCR,
    isProcessingOCR,
    modelLoadingProgress,
    isModelLoaded,
    setIsModelLoaded,
    setModelLoadingProgress,
    setError,
  } = useAppStore();

  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    if (isModelLoaded) return;

    setIsInitializing(true);
    try {
      await modelService.initialize((progress) => {
        setModelLoadingProgress(progress);
      });
      setIsModelLoaded(true);
    } catch (error) {
      console.error('Initialization error:', error);
      setError('Failed to initialize AI models. Some features may not work.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const uri = await ocrService.takePhoto();
      if (uri) {
        setCapturedImage(uri);
      }
    } catch (error) {
      console.error('Take photo error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    try {
      const uri = await ocrService.pickImage();
      if (uri) {
        setCapturedImage(uri);
      }
    } catch (error) {
      console.error('Pick image error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setIsProcessingOCR(true);
    try {
      // Process OCR
      const ocrResult = await ocrService.processImage(capturedImage);
      setOCRResult(ocrResult);

      if (ocrResult.error) {
        Alert.alert('OCR Error', ocrResult.error);
        return;
      }

      // Navigate to analysis
      (navigation as any).navigate('Analysis');
    } catch (error) {
      console.error('Analyze error:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛒 Smart Shopping Assistant</Text>
        <Text style={styles.subtitle}>
          Scan product labels to analyze ingredients
        </Text>
      </View>

      <View style={styles.content}>
        {capturedImage ? (
          <>
            <Image source={{ uri: capturedImage }} style={styles.preview} />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleRetake}
              >
                <Text style={styles.secondaryButtonText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleAnalyze}
                disabled={isProcessingOCR}
              >
                <Text style={styles.primaryButtonText}>
                  {isProcessingOCR ? 'Processing...' : 'Analyze'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderIcon}>📸</Text>
              <Text style={styles.placeholderText}>
                Take a photo of the ingredient label
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.iconButton]}
                onPress={handleTakePhoto}
              >
                <Text style={styles.iconButtonEmoji}>📷</Text>
                <Text style={styles.iconButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.iconButton]}
                onPress={handlePickImage}
              >
                <Text style={styles.iconButtonEmoji}>🖼️</Text>
                <Text style={styles.iconButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <LoadingOverlay
        visible={isInitializing}
        message="Loading AI models..."
        progress={modelLoadingProgress}
      />

      <LoadingOverlay
        visible={isProcessingOCR}
        message="Processing image..."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  title: {
    ...Typography.h1,
    color: Colors.background,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.background,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  placeholder: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  placeholderIcon: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  placeholderText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  preview: {
    width: '100%',
    height: 400,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surfaceVariant,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryButtonText: {
    ...Typography.bodyMedium,
    color: Colors.background,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: Colors.surfaceVariant,
  },
  secondaryButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
  },
  iconButton: {
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonEmoji: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  iconButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
});
