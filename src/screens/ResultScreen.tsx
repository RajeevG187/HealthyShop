/**
 * Result Screen
 * Displays the health analysis results
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useAppStore } from '../store/appStore';
import { HealthScoreCard } from '../components/HealthScoreCard';
import { NutrientsList } from '../components/NutrientsList';

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const { analysisResult, reset } = useAppStore();

  if (!analysisResult) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No analysis results available</Text>
      </SafeAreaView>
    );
  }

  const handleScanAnother = () => {
    reset();
    (navigation as any).navigate('Camera');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (navigation as any).goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Analysis Results</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Health Score Card */}
        <HealthScoreCard
          rating={analysisResult.health_rating}
          category={analysisResult.rating_category}
        />

        {/* Summary */}
        <View style={[styles.card, Shadows.md]}>
          <Text style={styles.cardTitle}>Summary</Text>
          <Text style={styles.summaryText}>{analysisResult.summary}</Text>
          
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceLabel}>
              AI Confidence: {(analysisResult.confidence * 100).toFixed(0)}%
            </Text>
          </View>
        </View>

        {/* Nutrients */}
        <NutrientsList nutrients={analysisResult.nutrients} />

        {/* Harmful Flags */}
        {analysisResult.harmful_flags.length > 0 && (
          <View style={[styles.card, styles.warningCard, Shadows.md]}>
            <Text style={styles.cardTitle}>⚠️ Concerns Found</Text>
            {analysisResult.harmful_flags.map((flag, index) => (
              <View key={index} style={styles.flagItem}>
                <Text style={styles.flagBullet}>•</Text>
                <Text style={styles.flagText}>{flag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Ingredients List */}
        <View style={[styles.card, Shadows.md]}>
          <Text style={styles.cardTitle}>
            Ingredients ({analysisResult.ingredients.length})
          </Text>
          <View style={styles.ingredientsGrid}>
            {analysisResult.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientChip}>
                <Text style={styles.ingredientChipText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View style={[styles.card, styles.infoCard, Shadows.md]}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoTitle}>Tip</Text>
          <Text style={styles.infoText}>
            {analysisResult.rating_category === 'Healthy'
              ? 'This product appears to be a good choice! Remember to consume as part of a balanced diet.'
              : analysisResult.rating_category === 'Moderate'
              ? 'This product is okay in moderation. Look for healthier alternatives when possible.'
              : 'Consider limiting consumption of this product. Look for options with fewer processed ingredients and additives.'}
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleScanAnother}
        >
          <Text style={styles.actionButtonText}>Scan Another Product</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
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
  errorText: {
    ...Typography.body,
    color: Colors.danger,
    textAlign: 'center',
    marginTop: Spacing.xl,
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
  summaryText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  confidenceLabel: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  warningCard: {
    backgroundColor: Colors.warning + '10',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  flagItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  flagBullet: {
    ...Typography.body,
    color: Colors.warning,
    marginRight: Spacing.sm,
    fontWeight: '700',
  },
  flagText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  ingredientChip: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  ingredientChipText: {
    ...Typography.caption,
    color: Colors.text,
  },
  infoCard: {
    backgroundColor: Colors.info + '10',
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  infoTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Shadows.lg,
  },
  actionButtonText: {
    ...Typography.bodyMedium,
    color: Colors.background,
    fontWeight: '600',
  },
});
