/**
 * LLM Service - Handles ingredient analysis using on-device LLM
 * Uses RunAnywhere SDK with SmolLM2 360M model
 */

import { RunAnywhere } from '@runanywhere/core';
import { AnalysisResult } from '../types';
import { ruleBasedAnalysis } from '../utils/ruleBasedScoring';

/**
 * System prompt for the LLM nutritionist
 */
const SYSTEM_PROMPT = `You are a certified nutritionist and food safety expert. 
Analyze food ingredient lists and provide structured health assessments.

You must respond ONLY with valid JSON in this exact format:
{
  "ingredients": ["ingredient1", "ingredient2", ...],
  "nutrients": {
    "protein": "Low/Medium/High/Very High",
    "fats": "Low/Medium/High/Very High",
    "carbs": "Low/Medium/High/Very High",
    "sugar": "Low/Medium/High/Very High",
    "sodium": "Low/Medium/High/Very High",
    "calories": "Low/Medium/High/Very High"
  },
  "harmful_flags": ["flag1", "flag2", ...],
  "health_rating": 7.5,
  "rating_category": "Healthy/Moderate/Unhealthy",
  "summary": "Brief health assessment in 2-3 sentences"
}

Rules:
- health_rating: 0-10 scale (10 = healthiest)
- rating_category: "Healthy" (7-10), "Moderate" (4-6.9), "Unhealthy" (0-3.9)
- Prioritize ingredients by position (first = most abundant)
- Flag harmful additives, preservatives, artificial ingredients
- Consider sugar, sodium, and fat levels
- Be concise and actionable`;

class LLMService {
  /**
   * Analyze ingredients using LLM
   */
  async analyzeIngredients(ingredients: string[]): Promise<AnalysisResult> {
    try {
      console.log('====================================');
      console.log('LLM Service: Starting analysis...');
      console.log('Ingredients to analyze:', ingredients);
      console.log('====================================');

      // Check if model is loaded
      const isLoaded = await RunAnywhere.isModelLoaded();
      console.log('Model loaded status:', isLoaded);

      if (!isLoaded) {
        console.warn('====================================');
        console.warn('LLM not available, using rule-based analysis');
        console.warn('====================================');
        return ruleBasedAnalysis(ingredients);
      }

      // Create prompt
      const prompt = this.createPrompt(ingredients);
      console.log('Created prompt:', prompt);

      console.log('Calling LLM generate...');

      // Generate response
      const result = await RunAnywhere.generate(prompt, {
        maxTokens: 500,
        temperature: 0.3, // Low temperature for deterministic output
        systemPrompt: SYSTEM_PROMPT,
      });

      console.log('====================================');
      console.log('LLM response received');
      console.log('Tokens used:', result.tokensUsed);
      console.log('Latency:', result.latencyMs, 'ms');
      console.log('Response text:', result.text);
      console.log('====================================');

      // Parse JSON response
      const analysis = this.parseResponse(result.text, ingredients);

      // Add confidence score based on LLM metrics
      const confidence = this.calculateConfidence(result);

      console.log('====================================');
      console.log('Analysis complete!');
      console.log('Health rating:', analysis.health_rating);
      console.log('Category:', analysis.rating_category);
      console.log('Confidence:', confidence);
      console.log('====================================');

      return {
        ...analysis,
        confidence,
      };
    } catch (error) {
      console.error('====================================');
      console.error('LLM analysis error occurred:');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
      console.error('====================================');
      console.log('Falling back to rule-based analysis');

      // Fallback to rule-based system
      return ruleBasedAnalysis(ingredients);
    }
  }

  /**
   * Create analysis prompt
   */
  private createPrompt(ingredients: string[]): string {
    const ingredientList = ingredients.join(', ');

    return `Analyze the following food ingredients and provide a health assessment:

Ingredients: ${ingredientList}

Respond with ONLY the JSON object, no additional text.`;
  }

  /**
   * Parse LLM response to AnalysisResult
   */
  private parseResponse(responseText: string, originalIngredients: string[]): AnalysisResult {
    try {
      console.log('Parsing LLM response...');

      // Extract JSON from response (handle cases where LLM adds extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response text');
        throw new Error('No JSON found in response');
      }

      console.log('JSON extracted:', jsonMatch[0]);

      const parsed = JSON.parse(jsonMatch[0]);
      console.log('JSON parsed successfully');

      // Validate and normalize the response
      return {
        ingredients: parsed.ingredients || originalIngredients,
        nutrients: {
          protein: parsed.nutrients?.protein || 'Unknown',
          fats: parsed.nutrients?.fats || 'Unknown',
          carbs: parsed.nutrients?.carbs || 'Unknown',
          sugar: parsed.nutrients?.sugar || 'Unknown',
          sodium: parsed.nutrients?.sodium || 'Unknown',
          calories: parsed.nutrients?.calories || 'Unknown',
        },
        harmful_flags: Array.isArray(parsed.harmful_flags) ? parsed.harmful_flags : [],
        health_rating: this.normalizeRating(parsed.health_rating),
        rating_category: this.normalizeCategory(parsed.rating_category),
        summary: parsed.summary || 'Analysis completed.',
        confidence: 0.9, // High confidence from LLM
      };
    } catch (error) {
      console.error('====================================');
      console.error('Parse response error:');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('====================================');
      throw new Error('Failed to parse LLM response');
    }
  }

  /**
   * Normalize health rating to 0-10 range
   */
  private normalizeRating(rating: any): number {
    const num = parseFloat(rating);
    if (isNaN(num)) return 5.0;
    return Math.max(0, Math.min(10, num));
  }

  /**
   * Normalize category
   */
  private normalizeCategory(category: any): 'Healthy' | 'Moderate' | 'Unhealthy' {
    const cat = String(category).toLowerCase();
    if (cat.includes('healthy') && !cat.includes('unhealthy')) return 'Healthy';
    if (cat.includes('moderate')) return 'Moderate';
    return 'Unhealthy';
  }

  /**
   * Calculate confidence score based on LLM metrics
   */
  private calculateConfidence(result: any): number {
    // Base confidence on response quality
    let confidence = 0.85;

    // Adjust based on token count (longer = more detailed = higher confidence)
    if (result.tokensUsed > 300) confidence += 0.05;

    // Adjust based on latency (faster might indicate cached/template response)
    if (result.latencyMs > 2000) confidence += 0.05;

    return Math.min(0.95, confidence);
  }

  /**
   * Quick health check (simplified analysis)
   */
  async quickAnalyze(ingredients: string[]): Promise<{ score: number; category: string }> {
    try {
      const isLoaded = await RunAnywhere.isModelLoaded();
      if (!isLoaded) {
        const result = ruleBasedAnalysis(ingredients);
        return {
          score: result.health_rating,
          category: result.rating_category,
        };
      }

      const prompt = `Rate this product's healthiness (0-10): ${ingredients.slice(0, 5).join(', ')}
      
      Respond with just: {"score": X.X, "category": "Healthy/Moderate/Unhealthy"}`;

      const result = await RunAnywhere.generate(prompt, {
        maxTokens: 50,
        temperature: 0.2,
      });

      const parsed = JSON.parse(
        result.text.match(/\{.*\}/)?.[0] || '{"score": 5, "category": "Moderate"}'
      );

      return {
        score: this.normalizeRating(parsed.score),
        category: parsed.category || 'Moderate',
      };
    } catch (error) {
      console.error('Quick analyze error:', error);
      return { score: 5.0, category: 'Moderate' };
    }
  }
}

// Export singleton instance
export const llmService = new LLMService();
