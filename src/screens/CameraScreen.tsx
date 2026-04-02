/**
 * Camera Screen
 * Allows users to capture or upload product label images
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useAppStore } from '../store/appStore';
import { ocrService } from '../services/ocrService';
import { modelService } from '../services/modelService';
import { LoadingOverlay } from '../components/LoadingOverlay';

const logo = require('../assets/logo1.jpeg');

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
  const [imageRotation, setImageRotation] = useState(0);

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
    } catch {
      // Silent fail - mark as loaded to prevent retry
      setIsModelLoaded(true);
      setModelLoadingProgress(1.0);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      console.log('====================================');
      console.log('User clicked "Take Photo"');
      const uri = await ocrService.takePhoto();
      console.log('Photo captured, URI:', uri);
      console.log('====================================');
      if (uri) {
        setCapturedImage(uri);
      }
    } catch (error) {
      console.error('====================================');
      console.error('Take photo error occurred:');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
      console.error('====================================');
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    try {
      console.log('====================================');
      console.log('User clicked "Choose from Gallery"');
      const uri = await ocrService.pickImage();
      console.log('Image picked, URI:', uri);
      console.log('====================================');
      if (uri) {
        setCapturedImage(uri);
      }
    } catch (error) {
      console.error('====================================');
      console.error('Pick image error occurred:');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
      console.error('====================================');
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    console.log('====================================');
    console.log('Starting analysis...');
    console.log('Image URI:', capturedImage);
    console.log('Image rotation:', imageRotation);
    console.log('====================================');

    setIsProcessingOCR(true);
    try {
      // Process OCR
      const ocrResult = await ocrService.processImage(capturedImage);
      console.log('OCR result received:', {
        hasText: !!ocrResult.text,
        textLength: ocrResult.text?.length,
        confidence: ocrResult.confidence,
        hasError: !!ocrResult.error,
      });

      setOCRResult(ocrResult);

      if (ocrResult.error) {
        console.error('OCR returned error:', ocrResult.error);
        Alert.alert('OCR Error', ocrResult.error);
        return;
      }

      if (!ocrResult.text || ocrResult.text.trim().length === 0) {
        console.error('OCR returned empty text');
        Alert.alert(
          'No Text Found',
          'Could not extract text from the image. Please try to click again'
        );
        return;
      }

      console.log('Navigating to Analysis screen...');
      // Navigate to analysis
      (navigation as any).navigate('Analysis');
    } catch (error) {
      console.error('====================================');
      console.error('Analyze error occurred:');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
      console.error('====================================');
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessingOCR(false);
      console.log('====================================');
      console.log('Analysis processing completed');
      console.log('====================================');
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setImageRotation(0);
  };

  const handleRotateImage = () => {
    setImageRotation((prev) => (prev + 90) % 360);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}> </Text>
        <Text style={styles.title}>Smart Shopping Assistant</Text>
        <Text style={styles.subtitle}>Scan product labels to analyze ingredients</Text>
      </View>

      <View style={styles.content}>
        {capturedImage ? (
          <>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: capturedImage }}
                style={[styles.preview, { transform: [{ rotate: `${imageRotation}deg` }] }]}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleRetake}
              >
                <Text style={styles.secondaryButtonText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleRotateImage}
              >
                <Text style={styles.secondaryButtonText}> Rotate</Text>
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
              <Image source={logo} style={styles.placeholderLogo} resizeMode="contain" />
              <Text style={styles.placeholderText}>We help you make healthy decisions!</Text>
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

      <LoadingOverlay visible={isProcessingOCR} message="Processing image..." />
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
    ...Typography.h2,
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
  placeholderLogo: {
    width: 120,
    height: 120,
    marginBottom: Spacing.md,
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
  imageContainer: {
    width: '100%',
    height: 400,
    marginBottom: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceVariant,
  },
  preview: {
    width: '100%',
    height: 400,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceVariant,
  },
  buttonContainer: {
    gap: Spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
    flex: 1,
    minWidth: 100,
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
