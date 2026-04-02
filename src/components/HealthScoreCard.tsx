/**
 * Health Score Card Component
 * Displays health rating with visual indicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface HealthScoreCardProps {
  rating: number; // 0-10
  category: 'Healthy' | 'Moderate' | 'Unhealthy';
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ rating, category }) => {
  const getColor = () => {
    if (category === 'Healthy') return Colors.healthy;
    if (category === 'Moderate') return Colors.moderate;
    return Colors.unhealthy;
  };

  const getEmoji = () => {
    if (category === 'Healthy') return '✅';
    if (category === 'Moderate') return '⚠️';
    return '❌';
  };

  const color = getColor();
  const emoji = getEmoji();

  return (
    <View style={[styles.container, Shadows.lg]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.categoryText}>{category}</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color }]}>{rating.toFixed(1)}</Text>
        <Text style={styles.maxScore}>/10</Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${(rating / 10) * 100}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      <Text style={styles.subtitle}>Health Score</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emoji: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  categoryText: {
    ...Typography.h3,
    color: Colors.text,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  score: {
    fontSize: 48,
    fontWeight: '700',
  },
  maxScore: {
    fontSize: 24,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  progressBar: {
    height: 8,
    width: '100%',
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
