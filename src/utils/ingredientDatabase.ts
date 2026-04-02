// Harmful ingredient database for offline detection
import { HarmfulIngredient } from '../types';

export const HARMFUL_INGREDIENTS: HarmfulIngredient[] = [
  // High severity
  {
    name: 'Trans Fats',
    aliases: ['partially hydrogenated oil', 'hydrogenated vegetable oil', 'shortening'],
    severity: 'high',
    description: 'Increases bad cholesterol and heart disease risk',
  },
  {
    name: 'High Fructose Corn Syrup',
    aliases: ['HFCS', 'corn syrup', 'glucose-fructose'],
    severity: 'high',
    description: 'Linked to obesity and metabolic syndrome',
  },
  {
    name: 'Artificial Sweeteners',
    aliases: ['aspartame', 'sucralose', 'saccharin', 'acesulfame potassium', 'E951', 'E950'],
    severity: 'high',
    description: 'May affect gut health and metabolism',
  },
  {
    name: 'Sodium Nitrite',
    aliases: ['E250', 'sodium nitrate', 'E251'],
    severity: 'high',
    description: 'May form carcinogenic compounds',
  },
  {
    name: 'BHA/BHT',
    aliases: ['butylated hydroxyanisole', 'butylated hydroxytoluene', 'E320', 'E321'],
    severity: 'high',
    description: 'Possible carcinogen and hormone disruptor',
  },
  
  // Medium severity
  {
    name: 'MSG',
    aliases: ['monosodium glutamate', 'E621', 'hydrolyzed protein', 'yeast extract'],
    severity: 'medium',
    description: 'May cause headaches and sensitivity reactions',
  },
  {
    name: 'Artificial Colors',
    aliases: ['tartrazine', 'E102', 'sunset yellow', 'E110', 'red 40', 'yellow 5', 'blue 1'],
    severity: 'medium',
    description: 'Linked to hyperactivity in children',
  },
  {
    name: 'Sodium Benzoate',
    aliases: ['E211', 'benzoic acid', 'E210'],
    severity: 'medium',
    description: 'May damage DNA when combined with vitamin C',
  },
  {
    name: 'Potassium Sorbate',
    aliases: ['E202', 'sorbic acid', 'E200'],
    severity: 'medium',
    description: 'May cause allergic reactions',
  },
  {
    name: 'Carrageenan',
    aliases: ['E407', 'irish moss extract'],
    severity: 'medium',
    description: 'May cause digestive inflammation',
  },
  
  // Low severity (watch out for quantity)
  {
    name: 'Palm Oil',
    aliases: ['palmitate', 'palm kernel oil', 'vegetable oil'],
    severity: 'low',
    description: 'High in saturated fats, environmental concerns',
  },
  {
    name: 'Excess Sugar',
    aliases: ['sucrose', 'dextrose', 'maltose', 'cane sugar', 'brown sugar'],
    severity: 'low',
    description: 'Contributes to obesity and diabetes when excessive',
  },
  {
    name: 'Sodium',
    aliases: ['salt', 'sodium chloride', 'sea salt'],
    severity: 'low',
    description: 'High intake linked to hypertension',
  },
];

// Common healthy ingredients to recognize
export const HEALTHY_INGREDIENTS = [
  'whole wheat', 'whole grain', 'oats', 'quinoa', 'brown rice',
  'protein', 'whey', 'casein', 'egg white',
  'olive oil', 'coconut oil', 'avocado oil',
  'fiber', 'vitamin', 'mineral', 'probiotic',
  'natural flavor', 'sea salt', 'spices',
  'almonds', 'nuts', 'seeds', 'flaxseed', 'chia',
];

// Ingredient patterns that indicate processing
export const PROCESSING_INDICATORS = [
  'modified', 'enriched', 'fortified', 'hydrogenated',
  'artificial', 'synthetic', 'emulsifier', 'stabilizer',
  'preservative', 'flavor enhancer',
];

/**
 * Check if an ingredient is harmful
 */
export function checkIngredient(ingredient: string): HarmfulIngredient | null {
  const normalizedIngredient = ingredient.toLowerCase().trim();
  
  for (const harmful of HARMFUL_INGREDIENTS) {
    // Check main name
    if (normalizedIngredient.includes(harmful.name.toLowerCase())) {
      return harmful;
    }
    
    // Check aliases
    for (const alias of harmful.aliases) {
      if (normalizedIngredient.includes(alias.toLowerCase())) {
        return harmful;
      }
    }
  }
  
  return null;
}

/**
 * Check if an ingredient is healthy
 */
export function isHealthyIngredient(ingredient: string): boolean {
  const normalized = ingredient.toLowerCase();
  return HEALTHY_INGREDIENTS.some(healthy => normalized.includes(healthy));
}

/**
 * Check if an ingredient indicates high processing
 */
export function isHighlyProcessed(ingredient: string): boolean {
  const normalized = ingredient.toLowerCase();
  return PROCESSING_INDICATORS.some(indicator => normalized.includes(indicator));
}

/**
 * Get all harmful ingredients from a list
 */
export function findHarmfulIngredients(ingredients: string[]): HarmfulIngredient[] {
  const found: HarmfulIngredient[] = [];
  const seenNames = new Set<string>();
  
  for (const ingredient of ingredients) {
    const harmful = checkIngredient(ingredient);
    if (harmful && !seenNames.has(harmful.name)) {
      found.push(harmful);
      seenNames.add(harmful.name);
    }
  }
  
  return found;
}
