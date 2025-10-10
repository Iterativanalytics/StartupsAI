/**
 * Navigation Configuration
 * 
 * Role-specific, action-based navigation for all user types.
 * Provides primary actions and AI companion integration.
 */

export type UserType = 'entrepreneur' | 'investor' | 'lender' | 'grantor' | 'partner';

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  description: string;
  items: NavItem[];
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
  disabled?: boolean;
}

export interface AICompanion {
  label: string;
  description: string;
  path: string;
}

export interface NavigationConfig {
  primary: NavSection[];
  aiCompanion: AICompanion;
}

// ============================================================================
// NAVIGATION CONFIGURATIONS BY USER TYPE
// ============================================================================

export const NAVIGATION_CONFIG: Record<UserType, NavigationConfig> = {
  entrepreneur: {
    primary: [
      {
        id: 'build',
        label: 'Build',
        icon: 'pencil-ruler',
        description: 'Create and refine your business',
        items: [
          { label: 'Business Plan', path: '/build/business-plan', icon: 'document' },
          { label: 'Financial Model', path: '/build/financials', icon: 'calculator' },
          { label: 'Pitch Deck', path: '/build/pitch-deck', icon: 'presentation' },
          { label: 'Market Research', path: '/build/research', icon: 'search' }
        ]
      },
      {
        id: 'fund',
        label: 'Fund',
        icon: 'currency-dollar',
        description: 'Raise capital and secure funding',
        items: [
          { label: 'Funding Opportunities', path: '/fund/opportunities', icon: 'lightning-bolt' },
          { label: 'Investor Matching', path: '/fund/investors', icon: 'users' },
          { label: 'Loan Applications', path: '/fund/loans', icon: 'document-text' },
          { label: 'Grant Applications', path: '/fund/grants', icon: 'gift' }
        ]
      },
      {
        id: 'collaborate',
        label: 'Collaborate',
        icon: 'user-group',
        description: 'Build your team and network',
        items: [
          { label: 'Find Co-Founders', path: '/collaborate/co-founders', icon: 'user-plus' },
          { label: 'Team Management', path: '/collaborate/team', icon: 'users' },
          { label: 'Mentors & Advisors', path: '/collaborate/mentors', icon: 'academic-cap' },
          { label: 'Partnerships', path: '/collaborate/partners', icon: 'link' }
        ]
      },
      {
        id: 'learn',
        label: 'Learn',
        icon: 'book-open',
        description: 'Develop skills and knowledge',
        items: [
          { label: 'Courses', path: '/learn/courses', icon: 'play' },
          { label: 'Resources', path: '/learn/resources', icon: 'collection' },
          { label: 'Events', path: '/learn/events', icon: 'calendar' },
          { label: 'Community', path: '/learn/community', icon: 'chat' }
        ]
      }
    ],
    aiCompanion: {
      label: 'Co-Founder',
      description: 'Your strategic partner',
      path: '/co-founder'
    }
  },

  investor: {
    primary: [
      {
        id: 'discover',
        label: 'Discover',
        icon: 'search',
        description: 'Find investment opportunities',
        items: [
          { label: 'Deal Flow', path: '/discover/deals', icon: 'inbox' },
          { label: 'Startup Directory', path: '/discover/startups', icon: 'briefcase' },
          { label: 'Matching', path: '/discover/matching', icon: 'sparkles' },
          { label: 'Market Insights', path: '/discover/insights', icon: 'chart-bar' }
        ]
      },
      {
        id: 'analyze',
        label: 'Analyze',
        icon: 'chart-pie',
        description: 'Evaluate and assess deals',
        items: [
          { label: 'Deal Analysis', path: '/analyze/deals', icon: 'document-search' },
          { label: 'Valuation Tools', path: '/analyze/valuation', icon: 'calculator' },
          { label: 'Due Diligence', path: '/analyze/diligence', icon: 'clipboard-check' },
          { label: 'Risk Assessment', path: '/analyze/risk', icon: 'shield-check' }
        ]
      },
      {
        id: 'manage',
        label: 'Manage',
        icon: 'folder-open',
        description: 'Track your portfolio',
        items: [
          { label: 'Portfolio', path: '/manage/portfolio', icon: 'briefcase' },
          { label: 'Performance', path: '/manage/performance', icon: 'trending-up' },
          { label: 'Company Updates', path: '/manage/updates', icon: 'bell' },
          { label: 'Follow-On Analysis', path: '/manage/followon', icon: 'refresh' }
        ]
      },
      {
        id: 'connect',
        label: 'Connect',
        icon: 'users',
        description: 'Network and collaborate',
        items: [
          { label: 'Syndicate', path: '/connect/syndicate', icon: 'user-group' },
          { label: 'LP Relations', path: '/connect/lps', icon: 'briefcase' },
          { label: 'Mentorship', path: '/connect/mentorship', icon: 'academic-cap' },
          { label: 'Events', path: '/connect/events', icon: 'calendar' }
        ]
      }
    ],
    aiCompanion: {
      label: 'Co-Investor',
      description: 'Your deal intelligence partner',
      path: '/co-investor'
    }
  },

  lender: {
    primary: [
      {
        id: 'applications',
        label: 'Applications',
        icon: 'document-text',
        description: 'Review and process loans',
        items: [
          { label: 'New Applications', path: '/applications/new', icon: 'inbox' },
          { label: 'In Review', path: '/applications/review', icon: 'clock' },
          { label: 'Approved', path: '/applications/approved', icon: 'check-circle' },
          { label: 'Declined', path: '/applications/declined', icon: 'x-circle' }
        ]
      },
      {
        id: 'underwrite',
        label: 'Underwrite',
        icon: 'calculator',
        description: 'Analyze creditworthiness',
        items: [
          { label: 'Credit Analysis', path: '/underwrite/credit', icon: 'chart-bar' },
          { label: 'Risk Assessment', path: '/underwrite/risk', icon: 'shield-exclamation' },
          { label: 'Collateral Valuation', path: '/underwrite/collateral', icon: 'currency-dollar' },
          { label: 'Decision Support', path: '/underwrite/decision', icon: 'light-bulb' }
        ]
      },
      {
        id: 'portfolio',
        label: 'Portfolio',
        icon: 'briefcase',
        description: 'Monitor loan performance',
        items: [
          { label: 'Active Loans', path: '/portfolio/active', icon: 'document' },
          { label: 'Performance', path: '/portfolio/performance', icon: 'chart-line' },
          { label: 'At Risk', path: '/portfolio/at-risk', icon: 'exclamation-triangle' },
          { label: 'Collections', path: '/portfolio/collections', icon: 'bell' }
        ]
      },
      {
        id: 'insights',
        label: 'Insights',
        icon: 'light-bulb',
        description: 'Analytics and reporting',
        items: [
          { label: 'Dashboard', path: '/insights/dashboard', icon: 'chart-pie' },
          { label: 'Reports', path: '/insights/reports', icon: 'document-report' },
          { label: 'Market Trends', path: '/insights/trends', icon: 'trending-up' },
          { label: 'Benchmarking', path: '/insights/benchmarks', icon: 'scale' }
        ]
      }
    ],
    aiCompanion: {
      label: 'Co-Lender',
      description: 'Your credit intelligence partner',
      path: '/co-lender'
    }
  },

  grantor: {
    primary: [
      {
        id: 'applications',
        label: 'Applications',
        icon: 'document-duplicate',
        description: 'Review grant requests',
        items: [
          { label: 'New Submissions', path: '/applications/new', icon: 'inbox' },
          { label: 'Under Review', path: '/applications/review', icon: 'search' },
          { label: 'Recommended', path: '/applications/recommended', icon: 'thumb-up' },
          { label: 'Decisions', path: '/applications/decisions', icon: 'clipboard-check' }
        ]
      },
      {
        id: 'evaluate',
        label: 'Evaluate',
        icon: 'scale',
        description: 'Assess impact and alignment',
        items: [
          { label: 'Impact Analysis', path: '/evaluate/impact', icon: 'chart-bar' },
          { label: 'Mission Alignment', path: '/evaluate/alignment', icon: 'target' },
          { label: 'Risk Assessment', path: '/evaluate/risk', icon: 'shield-check' },
          { label: 'Theory of Change', path: '/evaluate/theory', icon: 'academic-cap' }
        ]
      },
      {
        id: 'portfolio',
        label: 'Portfolio',
        icon: 'folder-open',
        description: 'Track grantee progress',
        items: [
          { label: 'Active Grants', path: '/portfolio/active', icon: 'briefcase' },
          { label: 'Impact Tracking', path: '/portfolio/impact', icon: 'chart-line' },
          { label: 'Reports', path: '/portfolio/reports', icon: 'document-report' },
          { label: 'Renewals', path: '/portfolio/renewals', icon: 'refresh' }
        ]
      },
      {
        id: 'strategy',
        label: 'Strategy',
        icon: 'light-bulb',
        description: 'Optimize giving strategy',
        items: [
          { label: 'Portfolio Overview', path: '/strategy/overview', icon: 'chart-pie' },
          { label: 'Diversification', path: '/strategy/diversification', icon: 'arrows-expand' },
          { label: 'Focus Areas', path: '/strategy/focus', icon: 'filter' },
          { label: 'Collaboration', path: '/strategy/collaboration', icon: 'users' }
        ]
      }
    ],
    aiCompanion: {
      label: 'Co-Builder',
      description: 'Your impact intelligence partner',
      path: '/co-builder'
    }
  },

  partner: {
    primary: [
      {
        id: 'programs',
        label: 'Programs',
        icon: 'collection',
        description: 'Manage your initiatives',
        items: [
          { label: 'Active Cohorts', path: '/programs/cohorts', icon: 'user-group' },
          { label: 'Curriculum', path: '/programs/curriculum', icon: 'book-open' },
          { label: 'Events', path: '/programs/events', icon: 'calendar' },
          { label: 'Resources', path: '/programs/resources', icon: 'folder' }
        ]
      },
      {
        id: 'companies',
        label: 'Companies',
        icon: 'office-building',
        description: 'Track startup progress',
        items: [
          { label: 'Portfolio', path: '/companies/portfolio', icon: 'briefcase' },
          { label: 'Performance', path: '/companies/performance', icon: 'chart-bar' },
          { label: 'Interventions', path: '/companies/interventions', icon: 'support' },
          { label: 'Alumni', path: '/companies/alumni', icon: 'academic-cap' }
        ]
      },
      {
        id: 'connect',
        label: 'Connect',
        icon: 'link',
        description: 'Facilitate connections',
        items: [
          { label: 'Mentor Matching', path: '/connect/mentors', icon: 'user-plus' },
          { label: 'Investor Intros', path: '/connect/investors', icon: 'currency-dollar' },
          { label: 'Partnerships', path: '/connect/partnerships', icon: 'handshake' },
          { label: 'Network', path: '/connect/network', icon: 'globe' }
        ]
      },
      {
        id: 'impact',
        label: 'Impact',
        icon: 'trending-up',
        description: 'Measure and report',
        items: [
          { label: 'Outcomes', path: '/impact/outcomes', icon: 'badge-check' },
          { label: 'Analytics', path: '/impact/analytics', icon: 'chart-pie' },
          { label: 'Reports', path: '/impact/reports', icon: 'document-report' },
          { label: 'Success Stories', path: '/impact/stories', icon: 'star' }
        ]
      }
    ],
    aiCompanion: {
      label: 'Co-Builder',
      description: 'Your ecosystem intelligence partner',
      path: '/co-builder'
    }
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getNavigationConfig(userType: UserType): NavigationConfig {
  return NAVIGATION_CONFIG[userType];
}

export function getAICompanion(userType: UserType): AICompanion {
  return NAVIGATION_CONFIG[userType].aiCompanion;
}

export function getPrimarySections(userType: UserType): NavSection[] {
  return NAVIGATION_CONFIG[userType].primary;
}

export function findNavItem(userType: UserType, path: string): NavItem | null {
  const config = NAVIGATION_CONFIG[userType];
  
  for (const section of config.primary) {
    const item = section.items.find(i => i.path === path);
    if (item) return item;
  }
  
  return null;
}

export function getActiveSection(userType: UserType, currentPath: string): string | null {
  const config = NAVIGATION_CONFIG[userType];
  
  for (const section of config.primary) {
    if (section.items.some(item => currentPath.startsWith(item.path))) {
      return section.id;
    }
  }
  
  return null;
}
