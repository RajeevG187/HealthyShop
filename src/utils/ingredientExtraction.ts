/**
 * Ingredient Extraction Service
 * Uses LLM to refine OCR text and extract clean ingredient lists
 */

import { RunAnywhere } from '@runanywhere/core';
import { extractIngredients as fallbackExtract } from './textCleaner';

/**
 * Extract ingredients using LLM (if available) or fallback to rule-based
 */
export async function extractIngredientsWithLLM(ocrText: string): Promise<string[]> {
  console.log('====================================');
  console.log('Starting ingredient extraction...');
  console.log('OCR Text length:', ocrText.length);

  // Try LLM-based extraction first
  try {
    const isModelLoaded = await RunAnywhere.isModelLoaded();

    if (isModelLoaded) {
      console.log('Using LLM for ingredient extraction');
      const llmIngredients = await extractWithLLM(ocrText);

      if (llmIngredients.length > 0) {
        console.log('LLM extracted', llmIngredients.length, 'ingredients');
        console.log('====================================');
        return llmIngredients;
      }
    }
  } catch (error) {
    console.log('LLM extraction failed, using fallback');
  }

  // Fallback to rule-based extraction
  console.log('Using rule-based ingredient extraction');
  const ingredients = fallbackExtract(ocrText);
  console.log('Extracted', ingredients.length, 'ingredients');
  console.log('====================================');

  return ingredients;
}

/**
 * Use LLM to extract and clean ingredient list from OCR text
 */
async function extractWithLLM(ocrText: string): Promise<string[]> {
  const prompt = `Extract ONLY the ingredient list from this product label text. Return a JSON array of ingredient names.

Text: "${ocrText}"

Requirements:
- Extract only food ingredients
- Ignore nutrition facts, allergen warnings, brand names
- Clean up OCR errors
- Return as JSON array: ["ingredient1", "ingredient2", ...]
- If no ingredients found, return empty array: []

Response (JSON array only):`;

  try {
    const result = await RunAnywhere.generate(prompt, {
      maxTokens: 300,
      temperature: 0.2,
      systemPrompt:
        'You are a helpful assistant that extracts ingredient lists from food labels. Always respond with valid JSON arrays only.',
    });

    console.log('LLM response:', result.text);

    // Extract JSON array from response
    const jsonMatch = result.text.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      console.log('No JSON array found in LLM response');
      return [];
    }

    const ingredients = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(ingredients)) {
      console.log('LLM response is not an array');
      return [];
    }

    // Clean and validate ingredients
    const cleaned = ingredients
      .filter((ing): ing is string => typeof ing === 'string')
      .map((ing) => ing.trim())
      .filter((ing) => ing.length > 0 && ing.length < 100)
      .slice(0, 30); // Limit to 30 ingredients

    return cleaned;
  } catch (error) {
    console.error('LLM extraction error:', error);
    return [];
  }
}

/**
 * Validate and clean ingredient list
 */
export function cleanIngredientList(ingredients: string[]): string[] {
  if (!ingredients || ingredients.length === 0) {
    return [];
  }

  return ingredients
    .map((ing) => ing.trim())
    .filter((ing) => ing.length > 0)
    .filter((ing) => {
      const lower = ing.toLowerCase();
      // Remove common non-ingredient phrases
      return (
        !lower.includes('nutrition facts') &&
        !lower.includes('allergen') &&
        !lower.includes('contains:') &&
        !lower.includes('ingredients:') &&
        !lower.match(/^\d+\s*(calories|g|mg|ml)/)
      );
    })
    .map((ing) => {
      // Remove leading symbols or numbers
      return ing.replace(/^[\d\s\-•*]+/, '').trim();
    })
    .filter((ing) => ing.length > 0)
    .slice(0, 30);
}
