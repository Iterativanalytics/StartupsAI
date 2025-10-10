import { BaseDocument, DocumentType, DocumentContent, DocumentMetadata } from '../document.types';

/**
 * Pitch Deck Document Type
 * 
 * This document type handles pitch deck creation, management, and presentation.
 * It includes structured slides for investor presentations, demos, and storytelling.
 */
export interface PitchDeckDocument extends BaseDocument {
  type: 'pitch-deck';
  content: PitchDeckContent;
  metadata: PitchDeckMetadata;
}

export interface PitchDeckContent extends DocumentContent {
  format: 'structured';
  data: {
    slides: PitchSlide[];
    theme: PitchTheme;
    animations: Animation[];
    notes: SpeakerNotes[];
    timing: PresentationTiming;
  };
}

export interface PitchSlide {
  id: string;
  title: string;
  type: SlideType;
  content: SlideContent;
  order: number;
  visible: boolean;
  duration: number;
  aiGenerated: boolean;
  aiScore?: number;
  suggestions?: string[];
  lastModified: Date;
}

export type SlideType = 
  | 'title' 
  | 'problem' 
  | 'solution' 
  | 'market' 
  | 'business-model' 
  | 'traction' 
  | 'team' 
  | 'financials' 
  | 'ask' 
  | 'contact' 
  | 'custom';

export interface SlideContent {
  text: SlideText[];
  images: SlideImage[];
  charts: SlideChart[];
  videos: SlideVideo[];
  layout: SlideLayout;
  background: SlideBackground;
}

export interface SlideText {
  id: string;
  content: string;
  style: TextStyle;
  position: Position;
  animation?: Animation;
}

export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | 'light';
  color: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
}

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface SlideImage {
  id: string;
  src: string;
  alt: string;
  position: Position;
  style: ImageStyle;
  animation?: Animation;
}

export interface ImageStyle {
  borderRadius: number;
  opacity: number;
  filter?: string;
  transform?: string;
}

export interface SlideChart {
  id: string;
  type: ChartType;
  data: ChartData;
  position: Position;
  style: ChartStyle;
  animation?: Animation;
}

export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'area' 
  | 'scatter' 
  | 'radar' 
  | 'gauge' 
  | 'funnel';

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
  options: ChartOptions;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  scales?: any;
  plugins?: any;
}

export interface ChartStyle {
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export interface SlideVideo {
  id: string;
  src: string;
  type: 'mp4' | 'webm' | 'ogg';
  position: Position;
  controls: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}

export interface SlideLayout {
  type: 'single' | 'two-column' | 'three-column' | 'grid' | 'custom';
  columns: number;
  spacing: number;
  padding: number;
  alignment: 'left' | 'center' | 'right';
}

export interface SlideBackground {
  type: 'color' | 'gradient' | 'image' | 'pattern';
  color?: string;
  gradient?: Gradient;
  image?: string;
  pattern?: string;
  opacity: number;
}

export interface Gradient {
  type: 'linear' | 'radial';
  direction?: string;
  stops: GradientStop[];
}

export interface GradientStop {
  color: string;
  position: number;
}

export interface PitchTheme {
  name: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: ThemeSpacing;
  effects: ThemeEffects;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  caption: string;
  code: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ThemeEffects {
  shadows: boolean;
  borders: boolean;
  rounded: boolean;
  animations: boolean;
}

export interface Animation {
  id: string;
  type: AnimationType;
  duration: number;
  delay: number;
  easing: string;
  direction: 'forward' | 'reverse' | 'alternate';
  iteration: number;
}

export type AnimationType = 
  | 'fade' 
  | 'slide' 
  | 'zoom' 
  | 'rotate' 
  | 'bounce' 
  | 'pulse' 
  | 'shake' 
  | 'custom';

export interface SpeakerNotes {
  slideId: string;
  content: string;
  timing: number;
  cues: string[];
  lastModified: Date;
}

export interface PresentationTiming {
  totalDuration: number;
  slideTimings: SlideTiming[];
  transitions: Transition[];
  autoAdvance: boolean;
  loop: boolean;
}

export interface SlideTiming {
  slideId: string;
  duration: number;
  startTime: number;
  endTime: number;
}

export interface Transition {
  fromSlideId: string;
  toSlideId: string;
  type: TransitionType;
  duration: number;
  easing: string;
}

export type TransitionType = 
  | 'none' 
  | 'fade' 
  | 'slide' 
  | 'zoom' 
  | 'flip' 
  | 'cube' 
  | 'cover' 
  | 'uncover';

export interface PitchDeckMetadata extends DocumentMetadata {
  presentationType: PresentationType;
  audience: AudienceType;
  duration: number;
  slides: number;
  theme: string;
  language: string;
  accessibility: AccessibilitySettings;
  sharing: SharingSettings;
}

export type PresentationType = 
  | 'investor-pitch' 
  | 'demo' 
  | 'sales-presentation' 
  | 'training' 
  | 'conference' 
  | 'webinar' 
  | 'custom';

export type AudienceType = 
  | 'investors' 
  | 'customers' 
  | 'partners' 
  | 'employees' 
  | 'public' 
  | 'mixed';

export interface AccessibilitySettings {
  altText: boolean;
  captions: boolean;
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface SharingSettings {
  public: boolean;
  password?: string;
  expiresAt?: Date;
  allowDownload: boolean;
  allowComments: boolean;
  allowEdit: boolean;
  watermark?: string;
}

// Factory function
export function createPitchDeck(data: Partial<PitchDeckDocument>): PitchDeckDocument {
  const now = new Date();
  
  return {
    id: data.id || `pitch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'pitch-deck',
    title: data.title || 'Pitch Deck',
    description: data.description || 'Investor pitch presentation',
    content: data.content || createDefaultPitchDeckContent(),
    metadata: {
      category: 'pitch-deck',
      tags: ['pitch', 'presentation', 'investors'],
      status: 'draft',
      visibility: 'private',
      language: 'en',
      wordCount: 0,
      pageCount: 0,
      readingTime: 0,
      complexity: 'medium',
      presentationType: 'investor-pitch',
      audience: 'investors',
      duration: 0,
      slides: 0,
      theme: 'default',
      accessibility: {
        altText: true,
        captions: false,
        highContrast: false,
        screenReader: false,
        keyboardNavigation: true
      },
      sharing: {
        public: false,
        allowDownload: false,
        allowComments: false,
        allowEdit: false
      },
      creationMethod: 'manual',
      ...data.metadata
    },
    version: {
      current: '1.0.0',
      history: [],
      locked: false
    },
    permissions: {
      owner: data.permissions?.owner || '',
      editors: data.permissions?.editors || [],
      viewers: data.permissions?.viewers || [],
      commenters: data.permissions?.commenters || [],
      public: false
    },
    collaboration: {
      activeUsers: [],
      comments: [],
      suggestions: [],
      mentions: [],
      lastActivity: now
    },
    ai: {
      analyzed: false,
      overallScore: 0,
      qualityScore: 0,
      completenessScore: 0,
      readabilityScore: 0,
      insights: [],
      suggestions: [],
      autoGenerated: false,
      aiAssisted: false,
      confidence: 0
    },
    createdAt: now,
    updatedAt: now,
    createdBy: data.createdBy || '',
    lastModifiedBy: data.createdBy || ''
  };
}

// Default content creator
function createDefaultPitchDeckContent(): PitchDeckContent {
  return {
    format: 'structured',
    data: {
      slides: [
        {
          id: 'slide-1',
          title: 'Title Slide',
          type: 'title',
          content: {
            text: [
              {
                id: 'text-1',
                content: 'Your Company Name',
                style: {
                  fontSize: 48,
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  color: '#000000',
                  alignment: 'center',
                  lineHeight: 1.2
                },
                position: { x: 50, y: 200, width: 700, height: 100, zIndex: 1 }
              },
              {
                id: 'text-2',
                content: 'Tagline or Value Proposition',
                style: {
                  fontSize: 24,
                  fontFamily: 'Arial',
                  fontWeight: 'normal',
                  color: '#666666',
                  alignment: 'center',
                  lineHeight: 1.2
                },
                position: { x: 50, y: 320, width: 700, height: 50, zIndex: 1 }
              }
            ],
            images: [],
            charts: [],
            videos: [],
            layout: {
              type: 'single',
              columns: 1,
              spacing: 20,
              padding: 50,
              alignment: 'center'
            },
            background: {
              type: 'color',
              color: '#ffffff',
              opacity: 1
            }
          },
          order: 1,
          visible: true,
          duration: 10,
          aiGenerated: false,
          lastModified: new Date()
        },
        {
          id: 'slide-2',
          title: 'Problem',
          type: 'problem',
          content: {
            text: [
              {
                id: 'text-1',
                content: 'The Problem',
                style: {
                  fontSize: 36,
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  color: '#000000',
                  alignment: 'left',
                  lineHeight: 1.2
                },
                position: { x: 50, y: 50, width: 300, height: 50, zIndex: 1 }
              },
              {
                id: 'text-2',
                content: 'Describe the problem your solution addresses...',
                style: {
                  fontSize: 18,
                  fontFamily: 'Arial',
                  fontWeight: 'normal',
                  color: '#333333',
                  alignment: 'left',
                  lineHeight: 1.5
                },
                position: { x: 50, y: 120, width: 600, height: 200, zIndex: 1 }
              }
            ],
            images: [],
            charts: [],
            videos: [],
            layout: {
              type: 'single',
              columns: 1,
              spacing: 20,
              padding: 50,
              alignment: 'left'
            },
            background: {
              type: 'color',
              color: '#ffffff',
              opacity: 1
            }
          },
          order: 2,
          visible: true,
          duration: 15,
          aiGenerated: false,
          lastModified: new Date()
        },
        {
          id: 'slide-3',
          title: 'Solution',
          type: 'solution',
          content: {
            text: [
              {
                id: 'text-1',
                content: 'Our Solution',
                style: {
                  fontSize: 36,
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  color: '#000000',
                  alignment: 'left',
                  lineHeight: 1.2
                },
                position: { x: 50, y: 50, width: 300, height: 50, zIndex: 1 }
              },
              {
                id: 'text-2',
                content: 'Describe your solution and how it solves the problem...',
                style: {
                  fontSize: 18,
                  fontFamily: 'Arial',
                  fontWeight: 'normal',
                  color: '#333333',
                  alignment: 'left',
                  lineHeight: 1.5
                },
                position: { x: 50, y: 120, width: 600, height: 200, zIndex: 1 }
              }
            ],
            images: [],
            charts: [],
            videos: [],
            layout: {
              type: 'single',
              columns: 1,
              spacing: 20,
              padding: 50,
              alignment: 'left'
            },
            background: {
              type: 'color',
              color: '#ffffff',
              opacity: 1
            }
          },
          order: 3,
          visible: true,
          duration: 15,
          aiGenerated: false,
          lastModified: new Date()
        }
      ],
      theme: {
        name: 'default',
        colors: {
          primary: '#007bff',
          secondary: '#6c757d',
          accent: '#28a745',
          background: '#ffffff',
          text: '#000000',
          textSecondary: '#666666',
          success: '#28a745',
          warning: '#ffc107',
          error: '#dc3545'
        },
        fonts: {
          heading: 'Arial',
          body: 'Arial',
          caption: 'Arial',
          code: 'Courier New'
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32
        },
        effects: {
          shadows: false,
          borders: false,
          rounded: false,
          animations: false
        }
      },
      animations: [],
      notes: [],
      timing: {
        totalDuration: 0,
        slideTimings: [],
        transitions: [],
        autoAdvance: false,
        loop: false
      }
    }
  };
}
