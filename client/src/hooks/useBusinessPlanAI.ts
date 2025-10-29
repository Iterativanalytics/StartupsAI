import { useState, useCallback } from 'react';
import { useIterativePlan } from '@/contexts/IterativePlanContext';
import { getSectionById } from '@/constants/businessPlanStructure';

export interface AIGenerationOptions {
  tone?: 'professional' | 'casual' | 'technical' | 'persuasive';
  length?: 'short' | 'medium' | 'long';
  includeExamples?: boolean;
  customPrompt?: string;
}

export interface AIGenerationResult {
  content: string;
  confidence: number;
  suggestions: string[];
  wordCount: number;
}

export const useBusinessPlanAI = () => {
  const { updateSectionContent, getSectionContent, metadata } = useIterativePlan();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSectionContent = useCallback(async (
    chapterId: string,
    sectionId: string,
    options: AIGenerationOptions = {}
  ): Promise<AIGenerationResult> => {
    setIsGenerating(true);
    setError(null);

    try {
      const section = getSectionById(chapterId, sectionId);
      if (!section) {
        throw new Error('Section not found');
      }

      // TODO: Replace with actual AI API call
      // For now, simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const generatedContent = generateMockContent(
        section.title,
        section.aiPrompt || '',
        metadata,
        options
      );

      const result: AIGenerationResult = {
        content: generatedContent,
        confidence: 0.85,
        suggestions: [
          'Consider adding specific metrics and data',
          'Include real-world examples',
          'Expand on competitive advantages'
        ],
        wordCount: generatedContent.split(/\s+/).length
      };

      // Update the section with AI-generated content
      updateSectionContent(sectionId, generatedContent, true);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [metadata, updateSectionContent]);

  const improveSectionContent = useCallback(async (
    sectionId: string,
    improvementType: 'clarity' | 'length' | 'tone' | 'detail'
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const currentContent = getSectionContent(sectionId);
      if (!currentContent) {
        throw new Error('No content to improve');
      }

      // TODO: Replace with actual AI API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      let improvedContent = currentContent;
      
      switch (improvementType) {
        case 'clarity':
          improvedContent = `${currentContent}\n\n[Improved for clarity with better structure and clearer language]`;
          break;
        case 'length':
          improvedContent = `${currentContent}\n\nAdditional context and details have been added to provide more comprehensive coverage of this topic.`;
          break;
        case 'tone':
          improvedContent = `${currentContent}\n\n[Tone adjusted to be more professional and persuasive]`;
          break;
        case 'detail':
          improvedContent = `${currentContent}\n\nSpecific examples:\n- Example 1: Detailed scenario\n- Example 2: Real-world application\n- Example 3: Industry benchmark`;
          break;
      }

      updateSectionContent(sectionId, improvedContent, false);
      return improvedContent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to improve content';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [getSectionContent, updateSectionContent]);

  const getSuggestions = useCallback(async (
    sectionId: string
  ): Promise<string[]> => {
    try {
      const content = getSectionContent(sectionId);
      
      // TODO: Replace with actual AI API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const suggestions = [
        'Add more specific data and metrics',
        'Include customer testimonials or case studies',
        'Expand on competitive advantages',
        'Clarify your unique value proposition',
        'Add visual elements like charts or diagrams'
      ];

      return suggestions;
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      return [];
    }
  }, [getSectionContent]);

  const analyzeContent = useCallback(async (
    sectionId: string
  ): Promise<{
    score: number;
    strengths: string[];
    improvements: string[];
    readability: number;
    completeness: number;
  }> => {
    try {
      const content = getSectionContent(sectionId);
      
      // TODO: Replace with actual AI API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const wordCount = content.split(/\s+/).length;
      const hasData = /\d+%|\$\d+|[0-9,]+/.test(content);
      const hasStructure = content.includes('\n\n') || content.includes('##');

      const score = Math.min(100, 
        (wordCount > 100 ? 30 : wordCount * 0.3) +
        (hasData ? 30 : 0) +
        (hasStructure ? 20 : 0) +
        20
      );

      return {
        score: Math.round(score),
        strengths: [
          wordCount > 200 ? 'Good length and detail' : null,
          hasData ? 'Includes data and metrics' : null,
          hasStructure ? 'Well-structured content' : null
        ].filter(Boolean) as string[],
        improvements: [
          wordCount < 100 ? 'Add more detail and context' : null,
          !hasData ? 'Include specific metrics and data' : null,
          !hasStructure ? 'Improve structure with headings' : null
        ].filter(Boolean) as string[],
        readability: Math.round(Math.random() * 20 + 70),
        completeness: Math.round((wordCount / 300) * 100)
      };
    } catch (err) {
      console.error('Failed to analyze content:', err);
      throw err;
    }
  }, [getSectionContent]);

  return {
    generateSectionContent,
    improveSectionContent,
    getSuggestions,
    analyzeContent,
    isGenerating,
    error
  };
};

// Mock content generator (replace with actual AI API)
function generateMockContent(
  title: string,
  prompt: string,
  metadata: any,
  options: AIGenerationOptions
): string {
  const companyName = metadata.name || 'Your Company';
  const industry = metadata.industry || 'Technology';

  const templates: Record<string, string> = {
    'Summary': `${companyName} is a ${metadata.businessStage} stage company in the ${industry} industry. We are revolutionizing the market with our innovative approach to solving critical challenges.

## Key Highlights
- Strong market opportunity with significant growth potential
- Experienced team with proven track record
- Unique competitive advantages
- Clear path to profitability

## Our Vision
We envision becoming the leading solution provider in our market segment, delivering exceptional value to customers while building a sustainable and profitable business.`,

    'Our Mission': `At ${companyName}, our mission is to transform the ${industry} industry by delivering innovative solutions that address real customer needs.

## Core Values
- Customer Success: We prioritize customer satisfaction above all
- Innovation: We continuously push boundaries
- Integrity: We operate with transparency and ethics
- Excellence: We strive for the highest quality in everything we do

## Long-term Vision
To become the most trusted and innovative company in our industry, setting new standards for quality and customer service.`,

    'default': `# ${title}

${prompt}

## Overview
${companyName} operates in the ${industry} sector, focusing on delivering value through innovative solutions.

## Key Points
- Strategic approach aligned with market needs
- Data-driven decision making
- Focus on sustainable growth
- Customer-centric philosophy

## Details
Our approach is built on deep market understanding and commitment to excellence. We leverage industry best practices while innovating to stay ahead of competition.

${options.includeExamples ? '\n## Examples\n- Example 1: Practical application\n- Example 2: Real-world scenario\n- Example 3: Success story' : ''}

## Conclusion
This positions us strongly for success in the ${industry} market.`
  };

  return templates[title] || templates['default'];
}
