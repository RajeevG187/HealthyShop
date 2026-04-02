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
    .replace(/[|]/g, 'I')  // Pipe to I
    .replace(/[0]/g, 'O')  // Zero to O in some contexts
    .replace(/[1]/g, 'l')  // One to l in some contexts
    .trim();
  
  return cleaned;
}

/**
 * Extract ingredient list from OCR text
 */
export function extractIngredients(text: string): string[] {
  if (!text) return [];
  
  // Look for common patterns
  const patterns = [
    /ingredients?\s*:?\s*([^.]+)/i,
    /contains?\s*:?\s*([^.]+)/i,
    /made\s+with\s*:?\s*([^.]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseIngredientList(match[1]);
    }
  }
  
  // Fallback: treat entire text as ingredient list
  return parseIngredientList(text);
}

/**
 * Parse comma-separated ingredient list
 */
function parseIngredientList(text: string): string[] {
  if (!text) return [];
  
  // Split by common delimiters
  const ingredients = text
    .split(/[,;]/)
    .map(ing => ing.trim())
    .filter(ing => ing.length > 2) // Filter out very short strings
    .map(ing => {
      // Remove parenthetical content (usually E-codes or clarifications)
      return ing.replace(/\([^)]*\)/g, '').trim();
    })
    .filter(ing => ing.length > 0);
  
  return ingredients;
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
    'ingredients', 'contains', 'made with',
    'sugar', 'flour', 'oil', 'salt', 'water',
  ];
  
  const lowerText = text.toLowerCase();
  const keywordMatches = keywords.filter(kw => lowerText.includes(kw)).length;
  
  // Has commas (typical of ingredient lists)
  const hasCommas = (text.match(/,/g) || []).length >= 2;
  
  return keywordMatches >= 2 || hasCommas;
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
  const validCount = ingredients.filter(ing => ing.length > 3).length;
  
  return validCount >= 2;
}
