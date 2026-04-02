/**
 * Analysis Screen
 * Shows OCR results and performs ingredient analysis
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useAppStore } from '../store/appStore';
import { llmService } from '../services/llmService';
import { extractIngredientsWithLLM } from '../utils/ingredientExtraction';
import { LoadingOverlay } from '../components/LoadingOverlay';

export const AnalysisScreen: React.FC = () => {
  const navigation = useNavigation();
  const { ocrResult, setAnalysisResult, setIsAnalyzing, isAnalyzing, setError } = useAppStore();
  const [extractedIngredients, setExtractedIngredients] = useState<string[]>([]);

  useEffect(() => {
    if (ocrResult && ocrResult.text) {
      analyzeIngredients();
    }
  }, []);

  const analyzeIngredients = async () => {
    if (!ocrResult || !ocrResult.text) {
      Alert.alert('Error', 'No ingredient text found');
      return;
    }

    console.log('====================================');
    console.log('Starting ingredient extraction and analysis...');
    console.log('OCR text:', ocrResult.text);
    console.log('====================================');

    setIsAnalyzing(true);
    try {
      // Extract ingredients using LLM or fallback
      const ingredients = await extractIngredientsWithLLM(ocrResult.text);
      setExtractedIngredients(ingredients);

      console.log('Extracted ingredients:', ingredients);
      console.log('Number of ingredients:', ingredients.length);

      if (ingredients.length === 0) {
        console.error('No ingredients extracted from text');
        throw new Error(
          'Could not extract ingredients. Please try with a clearer image of the ingredient list.'
        );
      }

      console.log('Starting health analysis...');
      // Analyze with LLM or rule-based
      const analysis = await llmService.analyzeIngredients(ingredients);

      console.log('Analysis complete');
      setAnalysisResult(analysis);

      console.log('Navigating to Result screen...');
      // Navigate to results
      setTimeout(() => {
        (navigation as any).navigate('Result');
      }, 500);
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setError(errorMessage);
      Alert.alert('Analysis Error', errorMessage);
      (navigation as any).goBack();
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => (navigation as any).goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Extracted Text</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, Shadows.md]}>
          <Text style={styles.cardTitle}>OCR Confidence</Text>
          <View style={styles.confidenceContainer}>
            <View style={styles.confidenceBar}>
              <View
                style={[styles.confidenceFill, { width: `${(ocrResult?.confidence || 0) * 100}%` }]}
              />
            </View>
            <Text style={styles.confidenceText}>
              {((ocrResult?.confidence || 0) * 100).toFixed(0)}%
            </Text>
          </View>
        </View>

        <View style={[styles.card, Shadows.md]}>
          <Text style={styles.cardTitle}>Raw Text</Text>
          <Text style={styles.rawText}>{ocrResult?.text || 'No text'}</Text>
        </View>

        <View style={[styles.card, Shadows.md]}>
          <Text style={styles.cardTitle}>
            Ingredients ({extractedIngredients.length || 'Extracting...'})
          </Text>
          {extractedIngredients.length > 0 ? (
            extractedIngredients.map((ingredient: string, index: number) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientNumber}>{index + 1}.</Text>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.rawText}>Extracting ingredients...</Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Analyzing ingredients using on-device AI. This may take a few moments...
          </Text>
        </View>
      </ScrollView>

      <LoadingOverlay visible={isAnalyzing} message="Analyzing ingredients..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.md,
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.primary,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  confidenceText: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
  },
  rawText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  ingredientItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ingredientNumber: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    marginRight: Spacing.sm,
    minWidth: 24,
  },
  ingredientText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '20',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.text,
    flex: 1,
  },
});
