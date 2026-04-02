/**
 * Nutrients List Component
 * Displays nutrient information in a clean list
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { AnalysisResult } from '../types';

interface NutrientsListProps {
  nutrients: AnalysisResult['nutrients'];
}

interface NutrientItemProps {
  label: string;
  value: string;
  icon: string;
  isGoodWhenHigh?: boolean; // True for protein, false for sugar/sodium/fats
}

const NutrientItem: React.FC<NutrientItemProps> = ({
  label,
  value,
  icon,
  isGoodWhenHigh = false,
}) => {
  const getValueColor = (val: string) => {
    const normalized = val.toLowerCase();

    // For nutrients where high is good (like Protein)
    if (isGoodWhenHigh) {
      if (normalized === 'very high' || normalized === 'high') {
        return Colors.success; // Green for high protein
      }
      if (normalized === 'medium') {
        return Colors.warning; // Yellow for medium
      }
      return Colors.danger; // Red for low protein
    }

    // For nutrients where high is bad (like Sugar, Sodium, Fats)
    if (normalized === 'very high' || normalized === 'high') {
      return Colors.danger; // Red for high sugar/sodium/fats
    }
    if (normalized === 'medium') {
      return Colors.warning; // Yellow for medium
    }
    return Colors.success; // Green for low sugar/sodium/fats
  };

  return (
    <View style={styles.nutrientItem}>
      <View style={styles.nutrientLeft}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: getValueColor(value) }]}>{value}</Text>
    </View>
  );
};

export const NutrientsList: React.FC<NutrientsListProps> = ({ nutrients }) => {
  return (
    <View style={[styles.container, Shadows.md]}>
      <Text style={styles.title}>Nutrient Profile</Text>

      <NutrientItem label="Protein" value={nutrients.protein} icon="💪" isGoodWhenHigh={true} />
      <NutrientItem label="Fats" value={nutrients.fats} icon="🥑" isGoodWhenHigh={false} />
      <NutrientItem label="Carbs" value={nutrients.carbs} icon="🌾" isGoodWhenHigh={false} />
      <NutrientItem label="Sugar" value={nutrients.sugar} icon="🍬" isGoodWhenHigh={false} />
      <NutrientItem label="Sodium" value={nutrients.sodium} icon="🧂" isGoodWhenHigh={false} />
      <NutrientItem label="Calories" value={nutrients.calories} icon="🔥" isGoodWhenHigh={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  nutrientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  nutrientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  label: {
    ...Typography.body,
    color: Colors.text,
  },
  value: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
});
