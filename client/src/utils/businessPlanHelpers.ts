/**
 * Business Plan Utility Functions
 * Helper functions for business plan operations
 */

import type { SectionStatus } from '@/contexts/BusinessPlanContext';

/**
 * Calculate word count from text content
 */
export function calculateWordCount(content: string): number {
  return content.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
}

/**
 * Get status color class
 */
export function getStatusColor(status: SectionStatus): string {
  switch (status) {
    case 'complete':
      return 'text-green-600 bg-green-50';
    case 'in_progress':
      return 'text-yellow-600 bg-yellow-50';
    case 'not_started':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status: SectionStatus): string {
  switch (status) {
    case 'complete':
      return 'Complete';
    case 'in_progress':
      return 'In Progress';
    case 'not_started':
      return 'Not Started';
    default:
      return 'Unknown';
  }
}

/**
 * Export business plan to markdown format
 */
export function exportToMarkdown(
  sections: Array<{ title: string; content: string }>,
  metadata: { name: string; industry: string }
): string {
  let markdown = `# ${metadata.name}\n\n`;
  markdown += `**Industry:** ${metadata.industry}\n\n`;
  markdown += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
  markdown += '---\n\n';

  sections.forEach((section) => {
    if (section.content) {
      markdown += `## ${section.title}\n\n`;
      markdown += `${section.content}\n\n`;
      markdown += '---\n\n';
    }
  });

  return markdown;
}

/**
 * Export business plan to plain text format
 */
export function exportToText(
  sections: Array<{ title: string; content: string }>,
  metadata: { name: string; industry: string }
): string {
  let text = `${metadata.name}\n`;
  text += `${'='.repeat(metadata.name.length)}\n\n`;
  text += `Industry: ${metadata.industry}\n`;
  text += `Generated: ${new Date().toLocaleDateString()}\n\n`;
  text += `${'-'.repeat(50)}\n\n`;

  sections.forEach((section) => {
    if (section.content) {
      text += `${section.title}\n`;
      text += `${'-'.repeat(section.title.length)}\n\n`;
      text += `${section.content}\n\n`;
      text += `${'-'.repeat(50)}\n\n`;
    }
  });

  return text;
}

/**
 * Validate section content
 */
export function validateSectionContent(content: string, minWords: number = 50): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const wordCount = calculateWordCount(content);

  if (!content || content.trim().length === 0) {
    errors.push('Content cannot be empty');
  }

  if (wordCount < minWords) {
    warnings.push(`Content is shorter than recommended (${wordCount}/${minWords} words)`);
  }

  // Check for placeholder text
  if (content.includes('[INSERT') || content.includes('[TODO')) {
    warnings.push('Content contains placeholder text');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generate section summary
 */
export function generateSectionSummary(content: string, maxLength: number = 150): string {
  if (!content || content.length === 0) {
    return 'No content yet';
  }

  const cleanContent = content.replace(/[#*_\[\]]/g, '').trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  return cleanContent.substring(0, maxLength).trim() + '...';
}

/**
 * Calculate completion percentage based on word count
 */
export function calculateCompletionPercentage(
  currentWords: number,
  targetWords: number
): number {
  if (targetWords === 0) return 0;
  return Math.min(100, Math.round((currentWords / targetWords) * 100));
}

/**
 * Get quality score based on various metrics
 */
export function calculateQualityScore(content: string): {
  score: number;
  factors: Array<{ name: string; score: number; weight: number }>;
} {
  const factors = [
    {
      name: 'Length',
      score: Math.min(100, (calculateWordCount(content) / 300) * 100),
      weight: 0.3
    },
    {
      name: 'Structure',
      score: (content.includes('\n\n') || content.includes('##')) ? 100 : 50,
      weight: 0.2
    },
    {
      name: 'Data',
      score: /\d+%|\$\d+|[0-9,]+/.test(content) ? 100 : 50,
      weight: 0.3
    },
    {
      name: 'Completeness',
      score: content.length > 500 ? 100 : (content.length / 500) * 100,
      weight: 0.2
    }
  ];

  const totalScore = factors.reduce((sum, factor) => {
    return sum + (factor.score * factor.weight);
  }, 0);

  return {
    score: Math.round(totalScore),
    factors
  };
}
