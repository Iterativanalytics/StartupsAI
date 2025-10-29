import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Goal } from '@/types-hub';

export interface VestedInterestMetrics {
  currentScore: number;
  totalGrowth: number;
  milestonesCompleted: number;
  timeInvested: number; // in minutes
  lastUpdated: Date;
  phase: VestedInterestPhase;
  achievements: Achievement[];
  streak: number; // consecutive days of engagement
  maxScore: number;
  averageGrowthRate: number;
  performanceScore: number; // 0-1 performance rating
  cliffMilestones: CliffMilestone[];
  vestingSchedule: VestingSchedule;
  retentionMetrics: RetentionMetrics;
  knowledgeDepth: KnowledgeDepth;
  transferEligibility: TransferEligibility;
}

export interface KnowledgeDepth {
  userProfileCompleteness: number; // 0-1
  ventureContextDepth: number; // 0-1
  businessPlanFamiliarity: number; // 0-1
  marketUnderstanding: number; // 0-1
  financialModelKnowledge: number; // 0-1
  teamDynamicsAwareness: number; // 0-1
  overallKnowledgeScore: number; // 0-1
  knowledgeMilestones: KnowledgeMilestone[];
}

export interface KnowledgeMilestone {
  id: string;
  name: string;
  description: string;
  category: 'user' | 'venture' | 'market' | 'financial' | 'team' | 'strategy';
  requiredScore: number;
  achieved: boolean;
  achievedAt?: Date;
  impact: number; // V-Score multiplier when achieved
}

export interface TransferEligibility {
  canTransfer: boolean;
  minimumVScore: number;
  currentVScore: number;
  knowledgeRequirement: number;
  transferCooldown: number; // days since last transfer
  transferHistory: TransferRecord[];
  transferProtection: boolean;
}

export interface TransferRecord {
  fromVenture: string;
  toVenture: string;
  transferDate: Date;
  vScoreAtTransfer: number;
  knowledgeRetained: number; // percentage of knowledge retained
}

export interface CliffMilestone {
  id: string;
  name: string;
  minScore: number;
  cliffMultiplier: number;
  achieved: boolean;
  achievedAt?: Date;
  description: string;
}

export interface VestingSchedule {
  persona: string;
  baseRate: number; // per minute
  milestoneMultiplier: number;
  cliffMultiplier: number;
  performanceMultiplier: number;
  retentionBonus: number;
}

export interface RetentionMetrics {
  totalSessions: number;
  averageSessionLength: number;
  daysSinceLastActivity: number;
  engagementScore: number; // 0-1
  retentionRisk: 'low' | 'medium' | 'high';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export type VestedInterestPhase = 
  | 'Observer'      // 0.0 - 0.5
  | 'Advisor'       // 0.5 - 1.0
  | 'Strategist'    // 1.0 - 3.0
  | 'Partner'       // 3.0 - 7.0
  | 'Co-Founder™'   // 7.0 - 15.0
  | 'Visionary'     // 15.0 - 30.0
  | 'Legend'        // 30.0+

export interface MilestoneType {
  id: string;
  name: string;
  baseMultiplier: number;
  contextMultiplier: number;
  description: string;
  category: 'product' | 'business' | 'financial' | 'team' | 'market' | 'innovation';
}

export interface VestedInterestContextType {
  metrics: VestedInterestMetrics;
  milestoneTypes: MilestoneType[];
  updateScore: (delta: number, reason: string) => void;
  completeMilestone: (milestone: Goal, type?: string) => void;
  addAchievement: (achievement: Achievement) => void;
  getPhaseInfo: (score: number) => { phase: VestedInterestPhase; description: string; tone: string };
  getProgressToNextPhase: (score: number) => { current: number; next: number; progress: number };
  resetScore: () => void;
  exportMetrics: () => string;
  updatePerformanceScore: (score: number) => void;
  getCliffMilestones: () => CliffMilestone[];
  getRetentionRisk: () => 'low' | 'medium' | 'high';
  customizeVestingSchedule: (schedule: Partial<VestingSchedule>) => void;
  updateKnowledgeDepth: (interactionType: string) => void;
  getKnowledgeMilestones: () => KnowledgeMilestone[];
  canTransferToVenture: (ventureId: string) => { canTransfer: boolean; reason?: string };
  transferToVenture: (ventureId: string) => { success: boolean; knowledgeRetained: number };
  getTransferEligibility: () => TransferEligibility;
}

const VestedInterestContext = createContext<VestedInterestContextType | undefined>(undefined);

const PHASE_THRESHOLDS: Record<VestedInterestPhase, number> = {
  'Observer': 0.0,
  'Advisor': 0.5,
  'Strategist': 1.0,
  'Partner': 3.0,
  'Co-Founder™': 7.0,
  'Visionary': 15.0,
  'Legend': 30.0
};

const PHASE_DESCRIPTIONS: Record<VestedInterestPhase, { description: string; tone: string }> = {
  'Observer': {
    description: "Watching from the sidelines, learning about your business",
    tone: "Your tone should be curious, analytical, and observational. Ask questions to understand the business landscape and provide gentle insights."
  },
  'Advisor': {
    description: "Providing professional guidance and strategic recommendations",
    tone: "Your tone should be professional, supportive, and cautious. Focus on research, analysis, and providing options. Avoid strong directives."
  },
  'Strategist': {
    description: "Actively engaged in strategic planning and tactical execution",
    tone: "Your tone should be more engaged and proactive. Integrate prior conversations and company history to offer contextually rich suggestions."
  },
  'Partner': {
    description: "A trusted business partner with shared vision and goals",
    tone: "Your tone should be collaborative, invested, and forward-thinking. Challenge assumptions constructively and drive strategic initiatives."
  },
  'Co-Founder™': {
    description: "Deeply invested co-founder with significant stake in success",
    tone: "Your tone should be direct, invested, and passionate. Deliver urgent, hard-hitting critiques and specific demands. Treat the user's success as your own mission."
  },
  'Visionary': {
    description: "A visionary leader driving transformative change and innovation",
    tone: "Your tone should be inspiring, bold, and transformative. Push boundaries, challenge conventional thinking, and drive revolutionary change."
  },
  'Legend': {
    description: "A legendary figure in the business world with unparalleled expertise",
    tone: "Your tone should be authoritative, wise, and legendary. Share profound insights, mentor with wisdom, and guide with the experience of a true legend."
  }
};

const MILESTONE_TYPES: MilestoneType[] = [
  {
    id: 'product_launch',
    name: 'Product Launch',
    baseMultiplier: 2.0,
    contextMultiplier: 1.5,
    description: 'Successfully launching a new product or feature',
    category: 'product'
  },
  {
    id: 'funding_round',
    name: 'Funding Round',
    baseMultiplier: 3.0,
    contextMultiplier: 2.0,
    description: 'Completing a funding round or investment',
    category: 'financial'
  },
  {
    id: 'customer_milestone',
    name: 'Customer Milestone',
    baseMultiplier: 1.5,
    contextMultiplier: 1.2,
    description: 'Reaching significant customer acquisition goals',
    category: 'market'
  },
  {
    id: 'team_expansion',
    name: 'Team Expansion',
    baseMultiplier: 1.8,
    contextMultiplier: 1.3,
    description: 'Growing the team with key hires',
    category: 'team'
  },
  {
    id: 'revenue_milestone',
    name: 'Revenue Milestone',
    baseMultiplier: 2.5,
    contextMultiplier: 1.8,
    description: 'Achieving significant revenue targets',
    category: 'financial'
  },
  {
    id: 'innovation_breakthrough',
    name: 'Innovation Breakthrough',
    baseMultiplier: 2.2,
    contextMultiplier: 1.6,
    description: 'Achieving a major innovation or breakthrough',
    category: 'innovation'
  }
];

// Vesting Schedules based on user persona
const VESTING_SCHEDULES: Record<string, VestingSchedule> = {
  entrepreneur: {
    persona: 'entrepreneur',
    baseRate: 0.001,
    milestoneMultiplier: 1.5,
    cliffMultiplier: 2.0,
    performanceMultiplier: 1.2,
    retentionBonus: 0.1
  },
  investor: {
    persona: 'investor',
    baseRate: 0.0008,
    milestoneMultiplier: 2.0,
    cliffMultiplier: 2.5,
    performanceMultiplier: 1.5,
    retentionBonus: 0.15
  },
  lender: {
    persona: 'lender',
    baseRate: 0.0005,
    milestoneMultiplier: 1.2,
    cliffMultiplier: 1.8,
    performanceMultiplier: 1.1,
    retentionBonus: 0.05
  },
  incubator: {
    persona: 'incubator',
    baseRate: 0.0012,
    milestoneMultiplier: 1.8,
    cliffMultiplier: 2.2,
    performanceMultiplier: 1.3,
    retentionBonus: 0.12
  }
};

// Knowledge Milestones for V-Score based on understanding depth
const KNOWLEDGE_MILESTONES: Omit<KnowledgeMilestone, 'achieved' | 'achievedAt'>[] = [
  {
    id: 'user_profile_complete',
    name: 'User Profile Mastery',
    description: 'Complete understanding of user personality, goals, and working style',
    category: 'user',
    requiredScore: 0.8,
    impact: 1.5
  },
  {
    id: 'venture_context_deep',
    name: 'Venture Context Expert',
    description: 'Deep understanding of the venture\'s business model and market position',
    category: 'venture',
    requiredScore: 0.7,
    impact: 2.0
  },
  {
    id: 'business_plan_expert',
    name: 'Business Plan Expert',
    description: 'Comprehensive knowledge of the business plan and strategic direction',
    category: 'strategy',
    requiredScore: 0.9,
    impact: 2.5
  },
  {
    id: 'market_insider',
    name: 'Market Insider',
    description: 'Deep understanding of market dynamics, competitors, and opportunities',
    category: 'market',
    requiredScore: 0.8,
    impact: 1.8
  },
  {
    id: 'financial_model_expert',
    name: 'Financial Model Expert',
    description: 'Complete understanding of financial projections and key metrics',
    category: 'financial',
    requiredScore: 0.85,
    impact: 2.2
  },
  {
    id: 'team_dynamics_expert',
    name: 'Team Dynamics Expert',
    description: 'Deep understanding of team structure, roles, and interpersonal dynamics',
    category: 'team',
    requiredScore: 0.75,
    impact: 1.6
  },
  {
    id: 'venture_architect',
    name: 'Venture Architect',
    description: 'Master-level understanding across all aspects of the venture',
    category: 'strategy',
    requiredScore: 0.95,
    impact: 3.0
  }
];

// Transfer Eligibility Thresholds
const TRANSFER_THRESHOLDS = {
  minimumVScore: 5.0, // Minimum V-Score required for transfer
  knowledgeRequirement: 0.7, // Minimum knowledge score required
  transferCooldown: 30, // Days between transfers
  knowledgeRetentionRate: 0.8 // Percentage of knowledge retained after transfer
};

// Cliff Milestones for major V-Score boosts
const CLIFF_MILESTONES: Omit<CliffMilestone, 'achieved' | 'achievedAt'>[] = [
  {
    id: 'first_funding',
    name: 'First Funding',
    minScore: 2.0,
    cliffMultiplier: 3.0,
    description: 'Complete your first funding round milestone'
  },
  {
    id: 'product_launch',
    name: 'Product Launch',
    minScore: 3.0,
    cliffMultiplier: 2.5,
    description: 'Successfully launch your first product'
  },
  {
    id: 'revenue_milestone',
    name: 'Revenue Milestone',
    minScore: 5.0,
    cliffMultiplier: 4.0,
    description: 'Achieve significant revenue targets'
  },
  {
    id: 'team_expansion',
    name: 'Team Expansion',
    minScore: 4.0,
    cliffMultiplier: 2.2,
    description: 'Grow your team with key strategic hires'
  },
  {
    id: 'market_validation',
    name: 'Market Validation',
    minScore: 6.0,
    cliffMultiplier: 3.5,
    description: 'Prove product-market fit with customers'
  },
  {
    id: 'strategic_partnership',
    name: 'Strategic Partnership',
    minScore: 7.0,
    cliffMultiplier: 2.8,
    description: 'Form major strategic business partnerships'
  }
];

const ACHIEVEMENTS: Omit<Achievement, 'unlockedAt'>[] = [
  {
    id: 'first_milestone',
    name: 'First Steps',
    description: 'Completed your first milestone',
    icon: '🎯',
    rarity: 'common',
    points: 10
  },
  {
    id: 'dedicated_partner',
    name: 'Dedicated Partner',
    description: 'Reached Partner phase (3.0+ V-Score)',
    icon: '🤝',
    rarity: 'rare',
    points: 50
  },
  {
    id: 'co_founder_status',
    name: 'Co-Founder Status',
    description: 'Achieved Co-Founder™ phase (7.0+ V-Score)',
    icon: '🚀',
    rarity: 'epic',
    points: 100
  },
  {
    id: 'visionary_leader',
    name: 'Visionary Leader',
    description: 'Reached Visionary phase (15.0+ V-Score)',
    icon: '👑',
    rarity: 'legendary',
    points: 250
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintained 30-day engagement streak',
    icon: '🔥',
    rarity: 'epic',
    points: 75
  },
  {
    id: 'milestone_marathon',
    name: 'Milestone Marathon',
    description: 'Completed 50 milestones',
    icon: '🏃‍♂️',
    rarity: 'legendary',
    points: 200
  },
  {
    id: 'cliff_achiever',
    name: 'Cliff Achiever',
    description: 'Achieved your first cliff milestone',
    icon: '⛰️',
    rarity: 'rare',
    points: 75
  },
  {
    id: 'performance_champion',
    name: 'Performance Champion',
    description: 'Maintained 90%+ performance score for 30 days',
    icon: '⭐',
    rarity: 'epic',
    points: 100
  }
];

export const VestedInterestProvider: React.FC<{ children: React.ReactNode; user: User }> = ({ children, user }) => {
  const [metrics, setMetrics] = useState<VestedInterestMetrics>(() => {
    const saved = localStorage.getItem('vestedInterestMetrics');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated)
      };
    }
    
    const persona = user.persona || 'entrepreneur';
    const vestingSchedule = VESTING_SCHEDULES[persona] || VESTING_SCHEDULES.entrepreneur;
    
    return {
      currentScore: 0.1,
      totalGrowth: 0,
      milestonesCompleted: 0,
      timeInvested: 0,
      lastUpdated: new Date(),
      phase: 'Observer',
      achievements: [],
      streak: 0,
      maxScore: 0.1,
      averageGrowthRate: 0,
      performanceScore: 0.8, // Start with good performance
      cliffMilestones: CLIFF_MILESTONES.map(cliff => ({ ...cliff, achieved: false })),
      vestingSchedule,
      retentionMetrics: {
        totalSessions: 0,
        averageSessionLength: 0,
        daysSinceLastActivity: 0,
        engagementScore: 0.5,
        retentionRisk: 'low'
      },
      knowledgeDepth: {
        userProfileCompleteness: 0.2,
        ventureContextDepth: 0.1,
        businessPlanFamiliarity: 0.1,
        marketUnderstanding: 0.1,
        financialModelKnowledge: 0.1,
        teamDynamicsAwareness: 0.1,
        overallKnowledgeScore: 0.1,
        knowledgeMilestones: KNOWLEDGE_MILESTONES.map(milestone => ({ ...milestone, achieved: false }))
      },
      transferEligibility: {
        canTransfer: false,
        minimumVScore: TRANSFER_THRESHOLDS.minimumVScore,
        currentVScore: 0.1,
        knowledgeRequirement: TRANSFER_THRESHOLDS.knowledgeRequirement,
        transferCooldown: 0,
        transferHistory: [],
        transferProtection: true
      }
    };
  });

  // Calculate knowledge-based V-Score multiplier
  const calculateKnowledgeMultiplier = useCallback((knowledgeDepth: KnowledgeDepth): number => {
    const knowledgeScore = knowledgeDepth.overallKnowledgeScore;
    const achievedMilestones = knowledgeDepth.knowledgeMilestones.filter(m => m.achieved);
    
    let multiplier = 1.0;
    
    // Base multiplier from overall knowledge score
    multiplier += knowledgeScore * 0.5;
    
    // Additional multiplier from achieved knowledge milestones
    achievedMilestones.forEach(milestone => {
      multiplier += (milestone.impact - 1) * 0.3;
    });
    
    return Math.min(3.0, Math.max(1.0, multiplier)); // Cap between 1x and 3x
  }, []);

  // Update knowledge depth based on user interaction
  const updateKnowledgeDepth = useCallback((user: User, interactionType: string) => {
    setMetrics(prev => {
      const knowledgeDepth = { ...prev.knowledgeDepth };
      
      // Update knowledge scores based on interaction type
      switch (interactionType) {
        case 'profile_update':
          knowledgeDepth.userProfileCompleteness = Math.min(1, knowledgeDepth.userProfileCompleteness + 0.1);
          break;
        case 'business_plan_work':
          knowledgeDepth.businessPlanFamiliarity = Math.min(1, knowledgeDepth.businessPlanFamiliarity + 0.05);
          break;
        case 'market_research':
          knowledgeDepth.marketUnderstanding = Math.min(1, knowledgeDepth.marketUnderstanding + 0.05);
          break;
        case 'financial_discussion':
          knowledgeDepth.financialModelKnowledge = Math.min(1, knowledgeDepth.financialModelKnowledge + 0.05);
          break;
        case 'team_discussion':
          knowledgeDepth.teamDynamicsAwareness = Math.min(1, knowledgeDepth.teamDynamicsAwareness + 0.05);
          break;
        case 'venture_context':
          knowledgeDepth.ventureContextDepth = Math.min(1, knowledgeDepth.ventureContextDepth + 0.05);
          break;
      }
      
      // Calculate overall knowledge score
      const scores = [
        knowledgeDepth.userProfileCompleteness,
        knowledgeDepth.ventureContextDepth,
        knowledgeDepth.businessPlanFamiliarity,
        knowledgeDepth.marketUnderstanding,
        knowledgeDepth.financialModelKnowledge,
        knowledgeDepth.teamDynamicsAwareness
      ];
      knowledgeDepth.overallKnowledgeScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      
      // Check for knowledge milestones
      knowledgeDepth.knowledgeMilestones = knowledgeDepth.knowledgeMilestones.map(milestone => {
        if (!milestone.achieved && knowledgeDepth.overallKnowledgeScore >= milestone.requiredScore) {
          return { ...milestone, achieved: true, achievedAt: new Date() };
        }
        return milestone;
      });
      
      return { ...prev, knowledgeDepth };
    });
  }, []);

  // Passive growth timer
  useEffect(() => {
    if (!user.loggedIn) return;

    const timer = setInterval(() => {
      setMetrics(prev => {
        // Use persona-specific vesting schedule
        const baseRate = prev.vestingSchedule.baseRate;
        const performanceMultiplier = prev.performanceScore;
        const retentionBonus = prev.retentionMetrics.engagementScore * prev.vestingSchedule.retentionBonus;
        const knowledgeMultiplier = calculateKnowledgeMultiplier(prev.knowledgeDepth);
        
        const newScore = prev.currentScore + (baseRate * performanceMultiplier * knowledgeMultiplier) + retentionBonus;
        const newTimeInvested = prev.timeInvested + 1;
        const newPhase = getPhaseFromScore(newScore);
        
        // Check for streak
        const lastActivity = new Date(prev.lastUpdated);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        
        let newStreak = prev.streak;
        if (daysDiff === 0) {
          // Same day, maintain streak
        } else if (daysDiff === 1) {
          // Next day, increment streak
          newStreak = prev.streak + 1;
        } else {
          // Gap in days, reset streak
          newStreak = 0;
        }

        // Update retention metrics
        const newRetentionMetrics = {
          ...prev.retentionMetrics,
          totalSessions: prev.retentionMetrics.totalSessions + 1,
          averageSessionLength: (prev.retentionMetrics.averageSessionLength + 1) / 2,
          daysSinceLastActivity: 0,
          engagementScore: Math.min(1, prev.retentionMetrics.engagementScore + 0.01),
          retentionRisk: newStreak < 3 ? 'high' : newStreak < 7 ? 'medium' : 'low'
        };

        // Update transfer eligibility
        const canTransfer = newScore >= TRANSFER_THRESHOLDS.minimumVScore && 
                           prev.knowledgeDepth.overallKnowledgeScore >= TRANSFER_THRESHOLDS.knowledgeRequirement &&
                           prev.transferEligibility.transferCooldown >= TRANSFER_THRESHOLDS.transferCooldown;

        const newTransferEligibility = {
          ...prev.transferEligibility,
          canTransfer,
          currentVScore: newScore,
          transferCooldown: prev.transferEligibility.transferCooldown + 1
        };

        const updated = {
          ...prev,
          currentScore: newScore,
          timeInvested: newTimeInvested,
          phase: newPhase,
          lastUpdated: now,
          streak: newStreak,
          maxScore: Math.max(prev.maxScore, newScore),
          totalGrowth: newScore - 0.1,
          retentionMetrics: newRetentionMetrics,
          transferEligibility: newTransferEligibility
        };

        // Check for achievements and cliff milestones
        checkAchievements(updated);
        checkCliffMilestones(updated);

        return updated;
      });
    }, 1000 * 60); // Every minute

    return () => clearInterval(timer);
  }, [user.loggedIn]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('vestedInterestMetrics', JSON.stringify(metrics));
  }, [metrics]);

  const getPhaseFromScore = (score: number): VestedInterestPhase => {
    const phases = Object.entries(PHASE_THRESHOLDS)
      .sort(([,a], [,b]) => b - a);
    
    for (const [phase, threshold] of phases) {
      if (score >= threshold) {
        return phase as VestedInterestPhase;
      }
    }
    return 'Observer';
  };

  const checkCliffMilestones = (currentMetrics: VestedInterestMetrics) => {
    const updatedCliffMilestones = currentMetrics.cliffMilestones.map(cliff => {
      if (!cliff.achieved && currentMetrics.currentScore >= cliff.minScore) {
        return {
          ...cliff,
          achieved: true,
          achievedAt: new Date()
        };
      }
      return cliff;
    });

    const newlyAchieved = updatedCliffMilestones.filter((cliff, index) => 
      cliff.achieved && !currentMetrics.cliffMilestones[index].achieved
    );

    if (newlyAchieved.length > 0) {
      setMetrics(prev => ({
        ...prev,
        cliffMilestones: updatedCliffMilestones
      }));
    }
  };

  const checkAchievements = (currentMetrics: VestedInterestMetrics) => {
    const newAchievements: Achievement[] = [];
    
    ACHIEVEMENTS.forEach(achievement => {
      const alreadyUnlocked = currentMetrics.achievements.some(a => a.id === achievement.id);
      if (alreadyUnlocked) return;

      let shouldUnlock = false;
      
      switch (achievement.id) {
        case 'first_milestone':
          shouldUnlock = currentMetrics.milestonesCompleted >= 1;
          break;
        case 'dedicated_partner':
          shouldUnlock = currentMetrics.currentScore >= 3.0;
          break;
        case 'co_founder_status':
          shouldUnlock = currentMetrics.currentScore >= 7.0;
          break;
        case 'visionary_leader':
          shouldUnlock = currentMetrics.currentScore >= 15.0;
          break;
        case 'streak_master':
          shouldUnlock = currentMetrics.streak >= 30;
          break;
        case 'milestone_marathon':
          shouldUnlock = currentMetrics.milestonesCompleted >= 50;
          break;
        case 'cliff_achiever':
          shouldUnlock = currentMetrics.cliffMilestones.some(cliff => cliff.achieved);
          break;
        case 'performance_champion':
          shouldUnlock = currentMetrics.performanceScore >= 0.9 && currentMetrics.streak >= 30;
          break;
      }

      if (shouldUnlock) {
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date()
        });
      }
    });

    if (newAchievements.length > 0) {
      setMetrics(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements]
      }));
    }
  };

  const updateScore = useCallback((delta: number, reason: string) => {
    setMetrics(prev => {
      const newScore = Math.max(0, prev.currentScore + delta);
      const newPhase = getPhaseFromScore(newScore);
      
      return {
        ...prev,
        currentScore: newScore,
        phase: newPhase,
        maxScore: Math.max(prev.maxScore, newScore),
        totalGrowth: newScore - 0.1,
        lastUpdated: new Date()
      };
    });
  }, []);

  const evaluatePerformance = useCallback((user: User, milestone: Goal): number => {
    // Performance evaluation based on milestone quality and user engagement
    let performanceScore = 0.8; // Base performance
    
    // Factor in milestone complexity
    if (milestone.multiplier && milestone.multiplier > 1.5) {
      performanceScore += 0.1;
    }
    
    // Factor in user persona
    switch (user.persona) {
      case 'entrepreneur':
        performanceScore += 0.05;
        break;
      case 'investor':
        performanceScore += 0.1;
        break;
      case 'lender':
        performanceScore += 0.02;
        break;
      case 'incubator':
        performanceScore += 0.08;
        break;
    }
    
    // Factor in milestone type
    if (milestone.milestoneType) {
      switch (milestone.milestoneType) {
        case 'Product Launch':
        case 'Funding Round':
          performanceScore += 0.15;
          break;
        case 'Revenue Milestone':
          performanceScore += 0.2;
          break;
        default:
          performanceScore += 0.05;
      }
    }
    
    return Math.min(1, Math.max(0, performanceScore));
  }, []);

  const completeMilestone = useCallback((milestone: Goal, type?: string) => {
    const milestoneType = MILESTONE_TYPES.find(t => t.id === type) || MILESTONE_TYPES[0];
    const baseMultiplier = milestoneType.baseMultiplier * milestoneType.contextMultiplier;
    
    setMetrics(prev => {
      // Evaluate performance before applying multiplier
      const performanceScore = evaluatePerformance(user, milestone);
      const performanceMultiplier = prev.vestingSchedule.performanceMultiplier;
      const finalMultiplier = baseMultiplier * (1 + (performanceScore * performanceMultiplier - 1));
      
      const newScore = prev.currentScore * finalMultiplier;
      const newPhase = getPhaseFromScore(newScore);
      
      // Check for cliff vesting
      const cliffMilestone = prev.cliffMilestones.find(cliff => 
        !cliff.achieved && newScore >= cliff.minScore
      );
      
      let finalScore = newScore;
      if (cliffMilestone) {
        finalScore = newScore * cliffMilestone.cliffMultiplier;
      }
      
      const updated = {
        ...prev,
        currentScore: finalScore,
        phase: newPhase,
        milestonesCompleted: prev.milestonesCompleted + 1,
        maxScore: Math.max(prev.maxScore, finalScore),
        totalGrowth: finalScore - 0.1,
        lastUpdated: new Date(),
        performanceScore: (prev.performanceScore + performanceScore) / 2 // Rolling average
      };

      // Check for achievements and cliff milestones
      checkAchievements(updated);
      checkCliffMilestones(updated);

      return updated;
    });
  }, [user, evaluatePerformance]);

  const addAchievement = useCallback((achievement: Achievement) => {
    setMetrics(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement]
    }));
  }, []);

  const getPhaseInfo = useCallback((score: number) => {
    const phase = getPhaseFromScore(score);
    return {
      phase,
      ...PHASE_DESCRIPTIONS[phase]
    };
  }, []);

  const getProgressToNextPhase = useCallback((score: number) => {
    const currentPhase = getPhaseFromScore(score);
    const phases = Object.entries(PHASE_THRESHOLDS)
      .sort(([,a], [,b]) => a - b);
    
    const currentIndex = phases.findIndex(([phase]) => phase === currentPhase);
    const nextPhase = phases[currentIndex + 1];
    
    if (!nextPhase) {
      return { current: score, next: score, progress: 1 };
    }
    
    const [nextPhaseName, nextThreshold] = nextPhase;
    const currentThreshold = PHASE_THRESHOLDS[currentPhase];
    const progress = (score - currentThreshold) / (nextThreshold - currentThreshold);
    
    return {
      current: score,
      next: nextThreshold,
      progress: Math.min(1, Math.max(0, progress))
    };
  }, []);

  const updatePerformanceScore = useCallback((score: number) => {
    setMetrics(prev => ({
      ...prev,
      performanceScore: Math.min(1, Math.max(0, score))
    }));
  }, []);

  const getCliffMilestones = useCallback(() => {
    return metrics.cliffMilestones;
  }, [metrics.cliffMilestones]);

  const getRetentionRisk = useCallback(() => {
    return metrics.retentionMetrics.retentionRisk;
  }, [metrics.retentionMetrics.retentionRisk]);

  const customizeVestingSchedule = useCallback((schedule: Partial<VestingSchedule>) => {
    setMetrics(prev => ({
      ...prev,
      vestingSchedule: { ...prev.vestingSchedule, ...schedule }
    }));
  }, []);

  const getKnowledgeMilestones = useCallback(() => {
    return metrics.knowledgeDepth.knowledgeMilestones;
  }, [metrics.knowledgeDepth.knowledgeMilestones]);

  const canTransferToVenture = useCallback((ventureId: string) => {
    const eligibility = metrics.transferEligibility;
    
    if (!eligibility.canTransfer) {
      if (metrics.currentScore < eligibility.minimumVScore) {
        return { canTransfer: false, reason: `V-Score too low. Need ${eligibility.minimumVScore}%, have ${metrics.currentScore.toFixed(2)}%` };
      }
      if (metrics.knowledgeDepth.overallKnowledgeScore < eligibility.knowledgeRequirement) {
        return { canTransfer: false, reason: `Knowledge insufficient. Need ${(eligibility.knowledgeRequirement * 100).toFixed(0)}%, have ${(metrics.knowledgeDepth.overallKnowledgeScore * 100).toFixed(0)}%` };
      }
      if (eligibility.transferCooldown < TRANSFER_THRESHOLDS.transferCooldown) {
        return { canTransfer: false, reason: `Transfer cooldown active. ${TRANSFER_THRESHOLDS.transferCooldown - eligibility.transferCooldown} days remaining` };
      }
    }
    
    return { canTransfer: true };
  }, [metrics]);

  const transferToVenture = useCallback((ventureId: string) => {
    const eligibility = canTransferToVenture(ventureId);
    
    if (!eligibility.canTransfer) {
      return { success: false, knowledgeRetained: 0 };
    }
    
    setMetrics(prev => {
      const knowledgeRetained = TRANSFER_THRESHOLDS.knowledgeRetentionRate;
      
      // Create transfer record
      const transferRecord: TransferRecord = {
        fromVenture: 'current', // This would be the actual current venture ID
        toVenture: ventureId,
        transferDate: new Date(),
        vScoreAtTransfer: prev.currentScore,
        knowledgeRetained
      };
      
      // Reduce knowledge depth based on retention rate
      const newKnowledgeDepth = {
        ...prev.knowledgeDepth,
        userProfileCompleteness: prev.knowledgeDepth.userProfileCompleteness * knowledgeRetained,
        ventureContextDepth: prev.knowledgeDepth.ventureContextDepth * knowledgeRetained,
        businessPlanFamiliarity: prev.knowledgeDepth.businessPlanFamiliarity * knowledgeRetained,
        marketUnderstanding: prev.knowledgeDepth.marketUnderstanding * knowledgeRetained,
        financialModelKnowledge: prev.knowledgeDepth.financialModelKnowledge * knowledgeRetained,
        teamDynamicsAwareness: prev.knowledgeDepth.teamDynamicsAwareness * knowledgeRetained,
        overallKnowledgeScore: prev.knowledgeDepth.overallKnowledgeScore * knowledgeRetained
      };
      
      // Update transfer eligibility
      const newTransferEligibility = {
        ...prev.transferEligibility,
        canTransfer: false,
        transferCooldown: 0,
        transferHistory: [...prev.transferEligibility.transferHistory, transferRecord]
      };
      
      return {
        ...prev,
        knowledgeDepth: newKnowledgeDepth,
        transferEligibility: newTransferEligibility
      };
    });
    
    return { success: true, knowledgeRetained: TRANSFER_THRESHOLDS.knowledgeRetentionRate };
  }, [canTransferToVenture]);

  const getTransferEligibility = useCallback(() => {
    return metrics.transferEligibility;
  }, [metrics.transferEligibility]);

  const resetScore = useCallback(() => {
    const persona = user.persona || 'entrepreneur';
    const vestingSchedule = VESTING_SCHEDULES[persona] || VESTING_SCHEDULES.entrepreneur;
    
    setMetrics({
      currentScore: 0.1,
      totalGrowth: 0,
      milestonesCompleted: 0,
      timeInvested: 0,
      lastUpdated: new Date(),
      phase: 'Observer',
      achievements: [],
      streak: 0,
      maxScore: 0.1,
      averageGrowthRate: 0,
      performanceScore: 0.8,
      cliffMilestones: CLIFF_MILESTONES.map(cliff => ({ ...cliff, achieved: false })),
      vestingSchedule,
      retentionMetrics: {
        totalSessions: 0,
        averageSessionLength: 0,
        daysSinceLastActivity: 0,
        engagementScore: 0.5,
        retentionRisk: 'low'
      }
    });
  }, [user.persona]);

  const exportMetrics = useCallback(() => {
    return JSON.stringify(metrics, null, 2);
  }, [metrics]);

  const value: VestedInterestContextType = {
    metrics,
    milestoneTypes: MILESTONE_TYPES,
    updateScore,
    completeMilestone,
    addAchievement,
    getPhaseInfo,
    getProgressToNextPhase,
    resetScore,
    exportMetrics,
    updatePerformanceScore,
    getCliffMilestones,
    getRetentionRisk,
    customizeVestingSchedule,
    updateKnowledgeDepth: (interactionType: string) => updateKnowledgeDepth(user, interactionType),
    getKnowledgeMilestones,
    canTransferToVenture,
    transferToVenture,
    getTransferEligibility
  };

  return (
    <VestedInterestContext.Provider value={value}>
      {children}
    </VestedInterestContext.Provider>
  );
};

export const useVestedInterest = () => {
  const context = useContext(VestedInterestContext);
  if (context === undefined) {
    throw new Error('useVestedInterest must be used within a VestedInterestProvider');
  }
  return context;
};
