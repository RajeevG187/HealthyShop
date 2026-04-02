/**
 * Rule-based scoring system as fallback when LLM fails
 */

import { AnalysisResult } from '../types';
import { findHarmfulIngredients, isHealthyIngredient, isHighlyProcessed } from './ingredientDatabase';

/**
 * Generate analysis using rule-based system (fallback)
 */
export function ruleBasedAnalysis(ingredients: string[]): AnalysisResult {
  if (!ingredients || ingredients.length === 0) {
    throw new Error('No ingredients to analyze');
  }
  
  // Find harmful ingredients
  const harmfulFound = findHarmfulIngredients(ingredients);
  
  // Count healthy vs processed ingredients
  let healthyCount = 0;
  let processedCount = 0;
  
  for (const ingredient of ingredients) {
    if (isHealthyIngredient(ingredient)) {
      healthyCount++;
    }
    if (isHighlyProcessed(ingredient)) {
      processedCount++;
    }
  }
  
  // Calculate health score (0-10)
  let score = 7; // Start with neutral
  
  // Deduct for harmful ingredients
  for (const harmful of harmfulFound) {
    if (harmful.severity === 'high') score -= 2;
    else if (harmful.severity === 'medium') score -= 1;
    else score -= 0.5;
  }
  
  // Deduct for processing
  score -= processedCount * 0.5;
  
  // Add for healthy ingredients
  score += healthyCount * 0.5;
  
  // Check ingredient position (first 3 are most important)
  const firstThree = ingredients.slice(0, 3).map(i => i.toLowerCase());
  if (firstThree.some(i => i.includes('sugar') || i.includes('syrup'))) {
    score -= 1.5;
  }
  
  // Clamp score
  score = Math.max(0, Math.min(10, score));
  
  // Determine category
  let category: 'Healthy' | 'Moderate' | 'Unhealthy';
  if (score >= 7) category = 'Healthy';
  else if (score >= 4) category = 'Moderate';
  else category = 'Unhealthy';
  
  // Estimate nutrients (very rough heuristics)
  const nutrients = estimateNutrients(ingredients);
  
  // Generate summary
  const summary = generateSummary(score, category, harmfulFound, ingredients);
  
  return {
    ingredients,
    nutrients,
    harmful_flags: harmfulFound.map(h => `${h.name}: ${h.description}`),
    health_rating: Math.round(score * 10) / 10,
    rating_category: category,
    summary,
    confidence: 0.7, // Rule-based has moderate confidence
  };
}

/**
 * Estimate nutrients based on ingredient patterns
 */
function estimateNutrients(ingredients: string[]): AnalysisResult['nutrients'] {
  const text = ingredients.join(' ').toLowerCase();
  
  // Very rough estimation based on keywords
  let protein = 'Low';
  let fats = 'Medium';
  let carbs = 'Medium';
  let sugar = 'Medium';
  let sodium = 'Medium';
  let calories = 'Medium';
  
  // Protein
  if (text.includes('protein') || text.includes('whey') || text.includes('egg')) {
    protein = 'High';
  } else if (text.includes('meat') || text.includes('fish') || text.includes('chicken')) {
    protein = 'High';
  }
  
  // Sugar
  if (text.match(/sugar|syrup|fructose|glucose|sweetener/)) {
    const sugarMatches = (text.match(/sugar|syrup|fructose/g) || []).length;
    if (sugarMatches >= 2 || ingredients[0].toLowerCase().includes('sugar')) {
      sugar = 'Very High';
    } else {
      sugar = 'High';
    }
  }
  
  // Fats
  if (text.includes('oil') || text.includes('fat') || text.includes('butter')) {
    fats = 'High';
  }
  
  // Carbs
  if (text.includes('flour') || text.includes('wheat') || text.includes('grain') || text.includes('starch')) {
    carbs = 'High';
  }
  
  // Sodium
  if (text.includes('salt') || text.includes('sodium')) {
    const sodiumPosition = ingredients.findIndex(i => 
      i.toLowerCase().includes('salt') || i.toLowerCase().includes('sodium')
    );
    if (sodiumPosition >= 0 && sodiumPosition < 5) {
      sodium = 'High';
    }
  }
  
  // Calories (derived from others)
  if (sugar === 'Very High' || sugar === 'High' || fats === 'High') {
    calories = 'High';
  }
  
  return {
    protein,
    fats,
    carbs,
    sugar,
    sodium,
    calories,
  };
}

/**
 * Generate human-readable summary
 */
function generateSummary(
  score: number,
  category: string,
  harmfulFound: any[],
  ingredients: string[]
): string {
  const parts: string[] = [];
  
  // Overall rating
  if (category === 'Healthy') {
    parts.push('This product appears to be relatively healthy.');
  } else if (category === 'Moderate') {
    parts.push('This product has some concerning ingredients but is not the worst option.');
  } else {
    parts.push('This product contains several concerning ingredients and should be consumed in moderation.');
  }
  
  // Harmful ingredients
  if (harmfulFound.length > 0) {
    const highSeverity = harmfulFound.filter(h => h.severity === 'high');
    if (highSeverity.length > 0) {
      parts.push(`Contains ${highSeverity.length} high-risk ingredient(s): ${highSeverity.map(h => h.name).join(', ')}.`);
    }
  }
  
  // Sugar position check
  const firstIngredient = ingredients[0]?.toLowerCase() || '';
  if (firstIngredient.includes('sugar') || firstIngredient.includes('syrup')) {
    parts.push('Sugar is the first ingredient, indicating high sugar content.');
  }
  
  // Processing level
  const processedCount = ingredients.filter(i => isHighlyProcessed(i)).length;
  if (processedCount > ingredients.length / 2) {
    parts.push('This is a highly processed product.');
  }
  
  return parts.join(' ');
}

/**
 * Quick scoring without full analysis (for preview)
 */
export function quickScore(ingredients: string[]): number {
  const harmfulFound = findHarmfulIngredients(ingredients);
  let score = 7;
  
  harmfulFound.forEach(h => {
    if (h.severity === 'high') score -= 2;
    else if (h.severity === 'medium') score -= 1;
    else score -= 0.5;
  });
  
  return Math.max(0, Math.min(10, score));
}
