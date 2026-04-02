/**
 * Text cleaning and normalization utilities for OCR output
 */

/**
 * Clean and normalize OCR text
 */
export function cleanOCRText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Fix common OCR errors
  cleaned = cleaned
    .replace(/[|]/g, 'I') // Pipe to I
    .replace(/[0]/g, 'O') // Zero to O in some contexts
    .replace(/[1]/g, 'l') // One to l in some contexts
    .trim();

  return cleaned;
}

/**
 * Extract ingredient list from OCR text
 * More lenient and handles various formats
 */
export function extractIngredients(text: string): string[] {
  if (!text) return [];

  console.log('Extracting ingredients from text:', text);

  // Try to find ingredient section first
  let ingredientText = text;

  // Look for common patterns
  const patterns = [
    /ingredients?\s*:?\s*([^.]+)/i,
    /contains?\s*:?\s*([^.]+)/i,
    /made\s+with\s*:?\s*([^.]+)/i,
    /composition\s*:?\s*([^.]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      ingredientText = match[1];
      console.log('Found ingredient section using pattern');
      break;
    }
  }

  // Parse the ingredient list
  let ingredients = parseIngredientList(ingredientText);

  // If we got very few ingredients, try parsing the entire text
  if (ingredients.length < 2) {
    console.log('Too few ingredients found, trying full text');
    ingredients = parseIngredientList(text);
  }

  // If still no ingredients, split by any delimiter
  if (ingredients.length === 0) {
    console.log('Still no ingredients, using aggressive parsing');
    ingredients = text
      .split(/[,;.\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2 && s.length < 50)
      .filter((s) => !/^\d+$/.test(s)) // Remove pure numbers
      .slice(0, 20); // Limit to 20 ingredients
  }

  console.log('Extracted ingredients:', ingredients);
  return ingredients;
}

/**
 * Parse comma-separated ingredient list
 * More lenient parsing
 */
function parseIngredientList(text: string): string[] {
  if (!text) return [];

  // Split by common delimiters
  const ingredients = text
    .split(/[,;]/)
    .map((ing) => ing.trim())
    .filter((ing) => ing.length > 1) // Accept shorter strings
    .map((ing) => {
      // Remove parenthetical content (usually E-codes or clarifications)
      const cleaned = ing.replace(/\([^)]*\)/g, '').trim();
      // If removing parentheses made it too short, keep original
      return cleaned.length > 1 ? cleaned : ing;
    })
    .filter((ing) => ing.length > 0)
    .filter((ing) => {
      // Remove obvious non-ingredients
      const lower = ing.toLowerCase();
      return (
        !lower.includes('nutrition') &&
        !lower.includes('allergen') &&
        !lower.includes('serving') &&
        !lower.match(/^\d+\s*(g|mg|ml|oz|%)/)
      ); // Remove measurements
    });

  return ingredients.slice(0, 30); // Limit to 30 ingredients max
}

/**
 * Normalize ingredient name for comparison
 */
export function normalizeIngredient(ingredient: string): string {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ');
}

/**
 * Check if text looks like an ingredient label
 */
export function looksLikeIngredients(text: string): boolean {
  if (!text || text.length < 10) return false;

  const keywords = [
    'ingredients',
    'contains',
    'made with',
    'sugar',
    'flour',
    'oil',
    'salt',
    'water',
    'wheat',
    'milk',
    'egg',
    'soy',
    'corn',
    'starch',
    'protein',
    'acid',
    'vitamin',
    'preservative',
    'flavor',
    'color',
  ];

  const lowerText = text.toLowerCase();
  const keywordMatches = keywords.filter((kw) => lowerText.includes(kw)).length;

  // Has commas (typical of ingredient lists)
  const hasCommas = (text.match(/,/g) || []).length >= 2;

  // Has parentheses (common in ingredient lists for E-codes, etc.)
  const hasParentheses = text.includes('(') && text.includes(')');

  // Contains numbers (E-codes, percentages)
  const hasNumbers = /\d/.test(text);

  // More lenient validation
  return keywordMatches >= 1 || hasCommas || (hasParentheses && hasNumbers);
}

/**
 * Remove common non-ingredient text
 */
export function removeNonIngredientText(text: string): string {
  // Remove nutrition facts, allergen warnings, etc.
  const patterns = [
    /nutrition\s+facts?.*$/i,
    /allergen\s+warning.*$/i,
    /may\s+contain.*$/i,
    /manufactured\s+in.*$/i,
    /best\s+before.*$/i,
    /serving\s+size.*$/i,
  ];

  let cleaned = text;
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  return cleaned.trim();
}

/**
 * Validate that we have valid ingredients
 */
export function validateIngredients(ingredients: string[]): boolean {
  if (!ingredients || ingredients.length === 0) return false;

  // At least 2 ingredients
  if (ingredients.length < 2) return false;

  // At least some ingredients should be > 3 characters
  const validCount = ingredients.filter((ing) => ing.length > 3).length;

  return validCount >= 2;
}
