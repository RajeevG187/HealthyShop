// Harmful ingredient database for offline detection
import { HarmfulIngredient } from '../types';

/**
 * Comprehensive Ingredient Database
 *
 * This database contains information about common food additives and ingredients.
 *
 * Categories:
 * - HIGH SEVERITY: Ingredients with potential serious health risks
 * - MEDIUM SEVERITY: Ingredients that may cause reactions in some people
 * - LOW SEVERITY: Generally safe but should be consumed in moderation
 *
 * Examples from the database:
 *
 * MSG (Monosodium Glutamate) - Medium Severity
 * - A flavor enhancer that delivers umami and boosts savory notes
 * - Found in: instant noodles, snacks, seasoning blends
 *
 * Vitamin A Palmitate - Beneficial
 * - Added to improve nutritional value for vision and immune health
 * - Found in: fortified milk, margarine, breakfast cereals
 *
 * Ethyl Maltol - Medium Severity
 * - A flavor enhancer with warm, caramel-like aroma
 * - Found in: baked goods, candies, flavored drinks
 *
 * Glycine - Low Severity
 * - An amino acid that balances flavor and provides mild sweetness
 * - Found in: ready-to-drink beverages, sauces, processed foods
 *
 * Citric Acid - Low Severity
 * - Naturally found in citrus; used as acid regulator and flavor brightener
 * - Found in: packaged drinks, candies, jellies
 *
 * Sodium Benzoate - Medium Severity
 * - A preservative that prevents microbial growth
 * - Found in: soft drinks, sauces, dressings
 *
 * Ascorbic Acid (Vitamin C) - Low Severity/Beneficial
 * - An antioxidant that prevents oxidation and maintains freshness
 * - Found in: fruit juices, cut fruit, baked goods
 *
 * Aspartame - High Severity
 * - A low-calorie artificial sweetener used in diet products
 * - Found in: diet beverages, sugar-free candies, health products
 *
 * Sodium Nitrite - High Severity
 * - A preservative that keeps cured meats pink and safe
 * - Found in: sausages, corned beef, ham
 *
 * Natural & Synthetic Colorants - Medium Severity
 * - Curcumin: natural yellow pigment from turmeric (beneficial)
 * - Caramel: natural brown color (generally safe)
 * - Tartrazine: bright yellow synthetic color (may cause reactions)
 */

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
    aliases: ['sucralose', 'saccharin', 'acesulfame potassium', 'E950'],
    severity: 'high',
    description: 'May affect gut health and metabolism',
  },
  {
    name: 'Aspartame',
    aliases: ['E951', 'equal', 'nutrasweet'],
    severity: 'high',
    description:
      'Low-calorie artificial sweetener used in diet products; may cause sensitivity reactions',
  },
  {
    name: 'Sodium Nitrite',
    aliases: ['E250', 'sodium nitrate', 'E251'],
    severity: 'high',
    description: 'Preservative in cured meats; may form carcinogenic compounds',
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
    aliases: [
      'monosodium glutamate',
      'E621',
      'hydrolyzed protein',
      'yeast extract',
      'glutamic acid',
    ],
    severity: 'medium',
    description:
      'Flavor enhancer that delivers umami; may cause headaches and sensitivity reactions in some people',
  },
  {
    name: 'Artificial Colors',
    aliases: [
      'tartrazine',
      'E102',
      'sunset yellow',
      'E110',
      'red 40',
      'yellow 5',
      'blue 1',
      'curcumin synthetic',
      'caramel color synthetic',
    ],
    severity: 'medium',
    description: 'Synthetic colorants used for visual appeal; linked to hyperactivity in children',
  },
  {
    name: 'Sodium Benzoate',
    aliases: ['E211', 'benzoic acid', 'E210'],
    severity: 'medium',
    description:
      'Preservative that prevents microbial growth; may damage DNA when combined with vitamin C',
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
  {
    name: 'Ethyl Maltol',
    aliases: ['E637'],
    severity: 'medium',
    description:
      'Flavor enhancer with caramel-like aroma; generally safe but adds no nutritional value',
  },

  // Low severity (watch out for quantity)
  {
    name: 'Citric Acid',
    aliases: ['E330'],
    severity: 'low',
    description:
      'Naturally found in citrus; used as acid regulator and flavor brightener; generally safe in moderation',
  },
  {
    name: 'Ascorbic Acid',
    aliases: ['vitamin c', 'E300'],
    severity: 'low',
    description: 'Antioxidant that prevents oxidation; beneficial in appropriate amounts',
  },
  {
    name: 'Glycine',
    aliases: ['aminoacetic acid'],
    severity: 'low',
    description: 'Amino acid that balances flavor and provides mild sweetness; generally safe',
  },
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
  'whole wheat',
  'whole grain',
  'oats',
  'quinoa',
  'brown rice',
  'protein',
  'whey',
  'casein',
  'egg white',
  'olive oil',
  'coconut oil',
  'avocado oil',
  'fiber',
  'vitamin',
  'mineral',
  'probiotic',
  'natural flavor',
  'sea salt',
  'spices',
  'almonds',
  'nuts',
  'seeds',
  'flaxseed',
  'chia',
  'vitamin a palmitate',
  'ascorbic acid',
  'vitamin c',
  'vitamin e',
  'vitamin d',
  'calcium',
  'iron',
  'turmeric',
  'curcumin',
  'ginger',
  'garlic',
];

// Ingredient patterns that indicate processing
export const PROCESSING_INDICATORS = [
  'modified',
  'enriched',
  'fortified',
  'hydrogenated',
  'artificial',
  'synthetic',
  'emulsifier',
  'stabilizer',
  'preservative',
  'flavor enhancer',
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
  return HEALTHY_INGREDIENTS.some((healthy) => normalized.includes(healthy));
}

/**
 * Check if an ingredient indicates high processing
 */
export function isHighlyProcessed(ingredient: string): boolean {
  const normalized = ingredient.toLowerCase();
  return PROCESSING_INDICATORS.some((indicator) => normalized.includes(indicator));
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
