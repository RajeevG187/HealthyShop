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
}

const NutrientItem: React.FC<NutrientItemProps> = ({ label, value, icon }) => {
  const getValueColor = (val: string) => {
    const normalized = val.toLowerCase();
    if (normalized === 'very high' || normalized === 'high') {
      return Colors.danger;
    }
    if (normalized === 'medium') {
      return Colors.warning;
    }
    return Colors.success;
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
      
      <NutrientItem label="Protein" value={nutrients.protein} icon="💪" />
      <NutrientItem label="Fats" value={nutrients.fats} icon="🥑" />
      <NutrientItem label="Carbs" value={nutrients.carbs} icon="🌾" />
      <NutrientItem label="Sugar" value={nutrients.sugar} icon="🍬" />
      <NutrientItem label="Sodium" value={nutrients.sodium} icon="🧂" />
      <NutrientItem label="Calories" value={nutrients.calories} icon="🔥" />
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
