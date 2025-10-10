
import { UserType, User, InsertUser, BusinessPlan, InsertBusinessPlan, Organization, InsertOrganization } from "../shared/schema";

// Super Users for each user type
export const superUsers: InsertUser[] = [
  {
    email: "entrepreneur@superuser.com",
    firstName: "Alex",
    lastName: "Entrepreneur",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: UserType.ENTREPRENEUR,
    userSubtype: "serial-entrepreneur",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      industries: ["FinTech", "AI/ML", "SaaS"],
      fundingStages: ["Seed", "Series A"],
      investmentRange: { min: 500000, max: 5000000 },
      location: "San Francisco, CA"
    },
    metrics: {
      businessGrowth: 85,
      fundingStage: "Series A",
      teamSize: 12,
      revenueGrowth: 150,
      marketValidation: 78
    }
  },
  {
    email: "investor@superuser.com",
    firstName: "Sarah",
    lastName: "Investor",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: UserType.INVESTOR,
    userSubtype: "vc-fund",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      industries: ["FinTech", "HealthTech", "CleanTech"],
      stages: ["Seed", "Series A", "Series B"],
      checkSize: { min: 1000000, max: 50000000 },
      geography: ["North America", "Europe"],
      riskTolerance: "medium"
    },
    metrics: {
      dealAttractiveness: 92,
      potentialROI: 8.5,
      riskLevel: "medium",
      industryFit: 88,
      stageAlignment: "Series A"
    }
  },
  {
    email: "lender@superuser.com",
    firstName: "Michael",
    lastName: "Lender",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: UserType.LENDER,
    userSubtype: "commercial-bank",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      loanTypes: ["Term Loans", "Lines of Credit", "SBA Loans"],
      loanRange: { min: 100000, max: 10000000 },
      creditRequirements: "680+",
      industries: ["Technology", "Manufacturing", "Retail"],
      regions: ["West Coast", "East Coast"]
    },
    metrics: {
      creditworthiness: 750,
      dscr: 1.8,
      collateralValue: 2500000,
      riskAssessment: "low",
      paymentHistory: 95
    }
  },
  {
    email: "grantor@superuser.com",
    firstName: "Jennifer",
    lastName: "Grantor",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: UserType.GRANTOR,
    userSubtype: "foundation",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      grantTypes: ["Innovation Grants", "Social Impact Grants"],
      focusAreas: ["Environmental Impact", "Social Justice", "Technology Access"],
      impactRequirements: ["Measurable social outcomes", "Sustainability metrics"],
      eligibilityCriteria: {
        nonprofitStatus: false,
        geographicFocus: "Global",
        organizationSize: "Any"
      }
    },
    metrics: {
      socialImpact: 94,
      sustainability: 89,
      communityBenefit: 91,
      innovationLevel: 87,
      complianceScore: 98
    }
  },
  {
    email: "partner@superuser.com",
    firstName: "David",
    lastName: "Partner",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: UserType.PARTNER,
    userSubtype: "accelerator",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      partnershipTypes: ["Mentorship", "Resource Sharing", "Joint Ventures"],
      expertiseAreas: ["Product Development", "Go-to-Market", "Fundraising"],
      resourceOfferings: ["Network Access", "Technical Expertise", "Market Insights"],
      collaborationModels: ["Equity Partnership", "Service Exchange", "Revenue Share"]
    },
    metrics: {
      strategicFit: 88,
      resourceRequirements: ["Technical expertise", "Market access"],
      collaborationModel: "Equity Partnership",
      successRate: 76,
      networkValue: 92
    }
  },
  {
    email: "team@superuser.com",
    firstName: "Lisa",
    lastName: "TeamMember",
    profileImageUrl: "https://via.placeholder.com/100",
    userType: UserType.TEAM_MEMBER,
    userSubtype: "admin",
    verified: true,
    onboardingCompleted: true,
    preferences: {
      workingStyle: "Collaborative",
      communicationPreference: "Regular check-ins",
      expertiseAreas: ["Operations", "Strategy", "Analytics"]
    }
  }
];

// Sample Organizations
export const sampleOrganizations: InsertOrganization[] = [
  {
    name: "TechFlow Ventures",
    description: "Early-stage VC fund focusing on AI and automation startups",
    organizationType: UserType.INVESTOR,
    ownerId: "investor-super-user",
    industry: "Venture Capital",
    size: "51-200",
    location: "Palo Alto, CA",
    website: "https://techflowventures.com",
    verified: true
  },
  {
    name: "Green Impact Foundation",
    description: "Non-profit foundation supporting environmental sustainability initiatives",
    organizationType: UserType.GRANTOR,
    ownerId: "grantor-super-user",
    industry: "Non-profit",
    size: "11-50",
    location: "Seattle, WA",
    website: "https://greenimpactfoundation.org",
    verified: true
  },
  {
    name: "StartupBoost Accelerator",
    description: "3-month intensive accelerator program for early-stage startups",
    organizationType: UserType.PARTNER,
    ownerId: "partner-super-user",
    industry: "Business Services",
    size: "11-50",
    location: "Austin, TX",
    website: "https://startupboost.com",
    verified: true
  },
  {
    name: "Capital Bridge Bank",
    description: "Commercial bank specializing in startup and small business lending",
    organizationType: UserType.LENDER,
    ownerId: "lender-super-user",
    industry: "Financial Services",
    size: "501-1000",
    location: "New York, NY",
    website: "https://capitalbridge.com",
    verified: true
  }
];

// Sample Business Plans
export const sampleBusinessPlans: InsertBusinessPlan[] = [
  {
    name: "AI-Powered Customer Service Platform",
    userId: "entrepreneur-super-user",
    description: "Revolutionary AI platform that automates customer service interactions with 95% accuracy",
    industry: "AI/ML",
    stage: "Seed",
    fundingGoal: 2000000,
    teamSize: 8,
    revenueProjection: 5000000,
    marketSize: 25000000000,
    competitiveAdvantage: "Proprietary NLP technology with multilingual support",
    userType: UserType.ENTREPRENEUR,
    visibility: "investors",
    content: `
    ## Executive Summary
    Our AI-powered customer service platform revolutionizes how businesses handle customer interactions. Using advanced natural language processing, we provide 95% accurate automated responses across 15 languages.
    
    ## Market Opportunity
    The global customer service software market is valued at $25B and growing at 15% annually. Traditional solutions are expensive and require extensive human oversight.
    
    ## Solution
    Our platform integrates seamlessly with existing CRM systems and provides:
    - 24/7 automated customer support
    - Multilingual capabilities
    - Real-time sentiment analysis
    - Seamless human handoff when needed
    
    ## Business Model
    SaaS subscription model with tiered pricing based on interaction volume.
    
    ## Financial Projections
    Year 1: $500K revenue, $2M funding
    Year 2: $2M revenue, break-even
    Year 3: $5M revenue, 40% profit margin
    `
  },
  {
    name: "Sustainable Food Delivery Network",
    userId: "entrepreneur-super-user",
    description: "Carbon-neutral food delivery platform connecting local farms directly to consumers",
    industry: "FoodTech",
    stage: "Pre-Seed",
    fundingGoal: 750000,
    teamSize: 5,
    revenueProjection: 1200000,
    marketSize: 8000000000,
    competitiveAdvantage: "Direct farm partnerships and electric vehicle fleet",
    userType: UserType.ENTREPRENEUR,
    visibility: "partners",
    content: `
    ## Executive Summary
    Sustainable Food Delivery Network creates a direct connection between local farms and consumers through carbon-neutral delivery.
    
    ## Problem
    Current food delivery systems have high carbon footprints and disconnect consumers from local food sources.
    
    ## Solution
    - Direct partnerships with local organic farms
    - Electric vehicle delivery fleet
    - Blockchain-based supply chain tracking
    - Zero-waste packaging
    
    ## Market
    $8B local food market growing 20% annually
    
    ## Revenue Model
    Commission from farmers + delivery fees + premium subscriptions
    `
  },
  {
    name: "FinTech Credit Analytics Platform",
    userId: "entrepreneur-super-user",
    description: "Advanced credit scoring platform using alternative data sources for underbanked populations",
    industry: "FinTech",
    stage: "Series A",
    fundingGoal: 8000000,
    teamSize: 15,
    revenueProjection: 12000000,
    marketSize: 15000000000,
    competitiveAdvantage: "Proprietary alternative data algorithms with 40% better accuracy",
    userType: UserType.ENTREPRENEUR,
    visibility: "public",
    content: `
    ## Executive Summary
    Revolutionary credit scoring platform that uses alternative data to provide credit access to 2B underbanked individuals globally.
    
    ## Technology
    Machine learning algorithms analyze:
    - Mobile phone usage patterns
    - Social media behavior
    - Utility payment history
    - Education and employment data
    
    ## Market Opportunity
    $15B credit scoring market with 2B underbanked individuals lacking traditional credit history.
    
    ## Traction
    - 50,000 credit assessments completed
    - 40% improvement in default prediction accuracy
    - Partnerships with 12 microfinance institutions
    
    ## Funding Use
    - Product development: 40%
    - Market expansion: 35%
    - Team growth: 25%
    `
  }
];

// Sample user data for each type
export const sampleUsers: InsertUser[] = [
  // Additional Entrepreneurs
  {
    email: "jane.startup@example.com",
    firstName: "Jane",
    lastName: "Startup",
    userType: UserType.ENTREPRENEUR,
    userSubtype: "first-time-founder",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "bob.innovator@example.com",
    firstName: "Bob",
    lastName: "Innovator",
    userType: UserType.ENTREPRENEUR,
    userSubtype: "corporate-innovator",
    verified: false,
    onboardingCompleted: false
  },
  
  // Additional Investors
  {
    email: "angel.investor@example.com",
    firstName: "Angel",
    lastName: "Smith",
    userType: UserType.INVESTOR,
    userSubtype: "angel-investor",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "family.office@example.com",
    firstName: "Family",
    lastName: "Office",
    userType: UserType.INVESTOR,
    userSubtype: "family-office",
    verified: true,
    onboardingCompleted: true
  },
  
  // Additional Lenders
  {
    email: "credit.union@example.com",
    firstName: "Credit",
    lastName: "Union",
    userType: UserType.LENDER,
    userSubtype: "credit-union",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "online.lender@example.com",
    firstName: "Online",
    lastName: "Lender",
    userType: UserType.LENDER,
    userSubtype: "online-lender",
    verified: true,
    onboardingCompleted: true
  },
  
  // Additional Grantors
  {
    email: "gov.agency@example.com",
    firstName: "Government",
    lastName: "Agency",
    userType: UserType.GRANTOR,
    userSubtype: "government-agency",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "corporate.foundation@example.com",
    firstName: "Corporate",
    lastName: "Foundation",
    userType: UserType.GRANTOR,
    userSubtype: "corporate-foundation",
    verified: true,
    onboardingCompleted: true
  },
  
  // Additional Partners
  {
    email: "incubator.partner@example.com",
    firstName: "Incubator",
    lastName: "Partner",
    userType: UserType.PARTNER,
    userSubtype: "incubator",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "mentor.advisor@example.com",
    firstName: "Mentor",
    lastName: "Advisor",
    userType: UserType.PARTNER,
    userSubtype: "mentor",
    verified: true,
    onboardingCompleted: true
  },
  
  // Additional Team Members
  {
    email: "team.member@example.com",
    firstName: "Team",
    lastName: "Member",
    userType: UserType.TEAM_MEMBER,
    userSubtype: "member",
    verified: true,
    onboardingCompleted: true
  },
  {
    email: "contributor@example.com",
    firstName: "Content",
    lastName: "Contributor",
    userType: UserType.TEAM_MEMBER,
    userSubtype: "contributor",
    verified: true,
    onboardingCompleted: true
  }
];

// Function to seed all data
export const seedData = () => {
  return {
    superUsers,
    sampleUsers,
    sampleOrganizations,
    sampleBusinessPlans
  };
};
