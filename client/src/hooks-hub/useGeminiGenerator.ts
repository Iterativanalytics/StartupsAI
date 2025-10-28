import { useState } from 'react';
// FIX: Changed GenerateContentRequest to GenerateContentParameters as it is deprecated.
import { GoogleGenAI, GenerateContentParameters } from '@google/genai';
import { ToastType } from '@/types-hub';

interface UseGeminiGeneratorReturn {
  isLoading: boolean;
  error: Error | null;
  generateContent: (request: GenerateContentParameters) => Promise<string | null>;
}

export const useGeminiGenerator = (
    addToast: (message: string, type: ToastType) => void
): UseGeminiGeneratorReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateContent = async (request: GenerateContentParameters): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent(request);
      addToast('AI generation successful!', 'success');
      return response.text;
    } catch (e) {
      console.error('AI Generation Error:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(e as Error);
      addToast(`AI generation failed: ${errorMessage}`, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, generateContent };
};