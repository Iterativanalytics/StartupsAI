# IterativStartups - Complete Application Documentation

## 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Complete File Structure](#complete-file-structure)
3. [System Architecture](#system-architecture)
4. [AI Agent System](#ai-agent-system)
5. [Design Thinking Integration](#design-thinking-integration)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Deployment Guide](#deployment-guide)
9. [Security & Authentication](#security--authentication)
10. [Performance & Optimization](#performance--optimization)
11. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 🚀 Application Overview

**IterativStartups** is a comprehensive AI-powered business innovation platform that transforms startups from idea to success through advanced AI agents, Design Thinking methodology, and real-time collaboration tools. The platform serves as a complete innovation operating system for the startup ecosystem.

### 🌟 Key Differentiators
- **🧠 6 Specialized AI Agents** - Each user type has a dedicated AI assistant
- **🎨 Design Thinking Integration** - Complete innovation methodology from empathy to execution
- **📊 Unified Dashboard System** - Role-based dashboards with customizable widgets
- **🤝 Real-time Collaboration** - Live document editing and team management
- **📱 Progressive Web App** - Install on any device with offline capabilities
- **🔒 Enterprise Security** - Azure AI Services with content safety and compliance

### Core User Types
- **Entrepreneurs**: Business plan development, AI analysis, funding tools, Design Thinking tools
- **Investors**: Deal flow management, portfolio analytics, due diligence, DT rigor scoring
- **Lenders**: Credit assessment, risk analysis, loan portfolio management
- **Grantors**: Impact evaluation, ESG compliance, grant program optimization
- **Partners/Accelerators**: Program management, startup matching, venture building
- **Team Members**: Collaborative workspaces, task management, progress tracking

---

## 📁 Complete File Structure

```
/Users/lgfutwa/Documents/GitHub/Startups/
├── 📁 client/                          # React Frontend Application
│   ├── 📁 public/
│   │   ├── manifest.json              # PWA manifest
│   │   └── sw.js                      # Service worker
│   ├── 📁 src/
│   │   ├── 📁 components/             # Reusable UI Components
│   │   │   ├── 📁 ai/                 # AI Chat & Interaction Components
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   ├── AIAssistant.tsx
│   │   │   │   ├── ConversationHistory.tsx
│   │   │   │   └── [8 more AI components]
│   │   │   ├── 📁 co-founder/         # Co-Founder Agent Interface
│   │   │   │   ├── CoFounderHub.tsx
│   │   │   │   └── CoFounderChat.tsx
│   │   │   ├── 📁 documents/          # Document Management
│   │   │   │   ├── DocumentViewer.tsx
│   │   │   │   ├── DocumentEditor.tsx
│   │   │   │   ├── VersionControl.tsx
│   │   │   │   ├── CollaborationTools.tsx
│   │   │   │   └── DocumentAnalytics.tsx
│   │   │   ├── 📁 layout/             # Navigation & Layout
│   │   │   │   └── Navbar.tsx
│   │   │   ├── 📁 onboarding/         # User Onboarding
│   │   │   │   └── UserTypeSelector.tsx
│   │   │   ├── 📁 design-thinking/   # Design Thinking Tools
│   │   │   │   └── 📁 empathize/      # Empathy Phase Tools
│   │   │   │       └── EmpathyMapBuilder.tsx
│   │   │   ├── 📁 dashboard/          # Unified Dashboard System
│   │   │   │   ├── 📁 core/          # Core framework components
│   │   │   │   ├── 📁 widgets/       # Widget implementations
│   │   │   │   └── 📁 providers/     # Context providers
│   │   │   ├── 📁 ui/                # Base UI Component Library
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   └── [47 more UI components]
│   │   │   ├── AzureSignIn.tsx        # Azure Authentication
│   │   │   ├── GoogleSignIn.tsx       # Google Authentication
│   │   │   ├── ProtectedRoute.tsx      # Route Protection
│   │   │   ├── OfflineIndicator.tsx    # PWA Offline Support
│   │   │   ├── PWAInstallPrompt.tsx   # PWA Installation
│   │   │   └── team-management.tsx    # Team Management
│   │   ├── 📁 hooks/                  # Custom React Hooks
│   │   │   ├── 📁 ai/                 # AI-related Hooks
│   │   │   │   ├── use-ai-chat.ts
│   │   │   │   ├── use-ai-suggestions.ts
│   │   │   │   ├── use-ai-analysis.ts
│   │   │   │   ├── use-ai-insights.ts
│   │   │   │   └── use-ai-automation.ts
│   │   │   ├── 📁 co-founder/         # Co-Founder Hooks
│   │   │   │   ├── use-co-founder-chat.ts
│   │   │   │   ├── use-co-founder-insights.ts
│   │   │   │   └── use-co-founder-accountability.ts
│   │   │   ├── use-auth.ts            # Authentication Hook
│   │   │   ├── use-mobile.tsx        # Mobile Detection
│   │   │   ├── use-notifications.ts   # Notification System
│   │   │   └── use-toast.ts          # Toast Notifications
│   │   ├── 📁 lib/                    # Utility Functions & Configs
│   │   │   ├── 📁 ai/
│   │   │   │   └── ai-service.ts      # AI Service Integration
│   │   │   ├── queryClient.ts         # TanStack Query Config
│   │   │   ├── safari-26-optimizations.ts
│   │   │   └── utils.ts              # Utility Functions
│   │   ├── 📁 pages/                  # Route-based Page Components
│   │   │   ├── dashboard.tsx          # Main Dashboard Router
│   │   │   ├── entrepreneur-dashboard.tsx
│   │   │   ├── investor-dashboard.tsx
│   │   │   ├── lender-dashboard.tsx
│   │   │   ├── grantor-dashboard.tsx
│   │   │   ├── partner-dashboard.tsx
│   │   │   ├── team-member-dashboard.tsx
│   │   │   ├── admin-dashboard.tsx
│   │   │   ├── advanced-dashboard.tsx
│   │   │   ├── analytics-dashboard.tsx
│   │   │   ├── apple-dashboard.tsx
│   │   │   ├── upload.tsx             # Business Plan Upload
│   │   │   ├── edit-plan.tsx          # Plan Editor
│   │   │   ├── analysis.tsx           # Plan Analysis
│   │   │   ├── pitch-deck.tsx         # Pitch Deck Generator
│   │   │   ├── valuation.tsx          # Company Valuation
│   │   │   ├── funding-matcher.tsx    # Funding Opportunities
│   │   │   ├── funding.tsx            # Funding Management
│   │   │   ├── portfolios.tsx         # Portfolio Management
│   │   │   ├── applications.tsx       # Application Management
│   │   │   ├── proposals.tsx          # Proposal Management
│   │   │   ├── collaboration.tsx      # Team Collaboration
│   │   │   ├── documents-hub.tsx      # Document Management
│   │   │   ├── ecosystem-hub.tsx      # Ecosystem Selection
│   │   │   ├── venture-studio.tsx     # Venture Studio Model
│   │   │   ├── accelerator.tsx        # Accelerator Program
│   │   │   ├── incubator.tsx          # Incubator Program
│   │   │   ├── venture-building.tsx     # Venture Building Tools
│   │   │   ├── education.tsx          # Educational Resources
│   │   │   ├── programs.tsx           # Program Management
│   │   │   ├── credit-monitoring.tsx  # Credit Monitoring
│   │   │   ├── ai-credit-scoring.tsx  # AI Credit Scoring
│   │   │   ├── ai-market-analysis.tsx # AI Market Analysis
│   │   │   ├── ai-business-plan.tsx   # AI Business Plan Generator
│   │   │   ├── assessment-demo.tsx    # Assessment Demo
│   │   │   ├── login.tsx              # Authentication
│   │   │   └── not-found.tsx          # 404 Page
│   │   ├── 📁 styles/
│   │   │   └── safari-26.css          # Safari 26 Optimizations
│   │   ├── App.tsx                    # Main App Component
│   │   ├── main.tsx                   # App Entry Point
│   │   └── index.css                  # Global Styles
│   └── index.html                     # HTML Template
├── 📁 server/                          # Express.js Backend
│   ├── 📁 ai-agents/                  # AI Agent System
│   │   ├── 📁 agents/                 # Individual Agent Implementations
│   │   │   ├── 📁 business-advisor/   # Business Advisor Agent
│   │   │   │   └── index.ts
│   │   │   ├── 📁 deal-analyzer/      # Deal Analyzer Agent
│   │   │   │   └── index.ts
│   │   │   ├── 📁 credit-assessor/    # Credit Assessor Agent
│   │   │   │   └── index.ts
│   │   │   ├── 📁 impact-evaluator/   # Impact Evaluator Agent
│   │   │   │   └── index.ts
│   │   │   ├── 📁 partnership-facilitator/ # Partnership Facilitator
│   │   │   │   └── index.ts
│   │   │   ├── 📁 platform-orchestrator/ # Platform Orchestrator
│   │   │   │   └── index.ts
│   │   │   └── 📁 co-founder/         # Co-Founder Agent
│   │   │       ├── index.ts
│   │   │       ├── 📁 core/
│   │   │       │   ├── co-founder-brain.ts
│   │   │       │   ├── personality.ts
│   │   │       │   ├── relationship-manager.ts
│   │   │       │   └── memory-system.ts
│   │   │       ├── 📁 capabilities/
│   │   │       │   ├── 📁 accountability/
│   │   │       │   │   ├── goal-tracker.ts
│   │   │       │   │   └── performance-coach.ts
│   │   │       │   ├── 📁 strategic-thinking/
│   │   │       │   │   └── strategic-planning.ts
│   │   │       │   └── azure-enhanced-capabilities.ts
│   │   │       └── [11 more co-founder modules]
│   │   ├── 📁 core/                   # Agent Engine & Context Management
│   │   │   ├── agent-engine.ts        # Main Agent Engine
│   │   │   ├── azure-ai-services.ts    # Azure AI Integration
│   │   │   ├── azure-cognitive-services.ts
│   │   │   ├── azure-openai-advanced.ts
│   │   │   ├── azure-openai-client.ts
│   │   │   └── context-manager.ts      # Context Management
│   │   └── 📁 memory/
│   │       └── conversation-store.ts   # Conversation Storage
│   ├── 📁 routes/                     # API Route Handlers
│   │   └── dt-routes.ts              # Design Thinking Routes
│   ├── 📁 services/                   # Business Logic Services
│   │   └── empathy-map-service.ts    # Empathy Map Service
│   ├── 📁 migrations/                 # Database Migrations
│   │   └── 001_add_dt_tables.sql     # Design Thinking Tables
│   ├── ai-agent-orchestrator.ts       # AI Agent Orchestration
│   ├── ai-agent-routes.ts             # AI API Endpoints
│   ├── ai-service.ts                  # OpenAI Integration Service
│   ├── auth-middleware.ts             # Authentication Middleware
│   ├── azureAuth.ts                   # Azure Authentication
│   ├── googleAuth.ts                  # Google Authentication
│   ├── db.ts                          # Database Configuration
│   ├── error-handler.ts               # Error Handling
│   ├── index.ts                       # Server Entry Point
│   ├── routes.ts                      # Main API Routes
│   ├── seed-data.ts                   # Database Seeding
│   ├── storage.ts                     # Data Layer Abstraction
│   └── vite.ts                        # Vite Integration
├── 📁 packages/                        # Monorepo Packages
│   ├── 📁 ai-agents/                   # AI Agents Package
│   │   ├── 📁 src/
│   │   │   ├── 📁 agent-router/        # Agent Routing Logic
│   │   │   ├── 📁 agents/              # Agent Implementations
│   │   │   ├── 📁 co-agents/           # Collaborative Agents
│   │   │   ├── 📁 collaboration/      # Agent Collaboration
│   │   │   ├── 📁 core/                # Core Agent Framework
│   │   │   ├── 📁 functional-agents/   # Functional Agents
│   │   │   ├── 📁 memory/              # Memory Management
│   │   │   ├── 📁 models/              # Data Models
│   │   │   ├── 📁 tools/               # Agent Tools
│   │   │   ├── 📁 types/               # TypeScript Types
│   │   │   ├── 📁 utils/               # Utility Functions
│   │   │   ├── 📁 workflows/           # Workflow Management
│   │   │   └── index.ts                # Package Entry Point
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   └── 📁 assessment-engine/           # Assessment Engine Package
│       ├── 📁 src/
│       │   ├── 📁 assessments/         # Assessment Logic
│       │   └── 📁 models/              # Assessment Models
│       ├── 📁 dist/                    # Compiled Output
│       ├── package.json
│       └── tsconfig.json
├── 📁 shared/                          # Shared TypeScript Interfaces
│   └── schema.ts                       # Shared Schema Definitions
├── 📁 docs/                            # Documentation Files
│   ├── 📁 ai/                          # AI Documentation
│   │   ├── agent-architecture.md
│   │   ├── IMPLEMENTATION_SUMMARY.md
│   │   └── integration-guide.md
│   ├── 📁 assessment/                  # Assessment Documentation
│   │   ├── IMPLEMENTATION_STATUS.md
│   │   └── README.md
│   ├── AZURE_ARCHITECTURE_DIAGRAM.md
│   ├── AZURE_AUTH_SETUP.md
│   ├── AZURE_IMPLEMENTATION_SUMMARY.md
│   ├── AZURE_INTEGRATION.md
│   ├── AZURE_QUICK_START.md
│   ├── DASHBOARD_IMPROVEMENT_PROPOSAL.md
│   ├── DOCUMENTS_HUB_ENHANCEMENT.md
│   ├── INTEGRATION_COMPLETE.md
│   ├── README_AZURE_AUTH.md
│   ├── README-AI-AGENTS.md
│   ├── README-AI-IMPLEMENTATION.md
│   ├── README-AZURE-COFOUNDER.md
│   ├── RFP_RFI_RFQ_AUTOMATION_SUMMARY.md
│   ├── SAFARI_26_IMPLEMENTATION.md
│   └── api.md
├── 📁 attached_assets/                 # Design Assets & Documentation
│   ├── [47 files including .txt, .tsx, .json files]
├── 📁 temp/                            # Temporary Files
│   ├── 📁 functional-agents/
│   └── 📁 types/
├── 📄 package.json                     # Project Dependencies
├── 📄 package-lock.json               # Dependency Lock File
├── 📄 tsconfig.json                    # TypeScript Configuration
├── 📄 tailwind.config.ts               # Tailwind CSS Configuration
├── 📄 vite.config.ts                   # Vite Configuration
├── 📄 postcss.config.js                # PostCSS Configuration
├── 📄 env.example                      # Environment Variables Example
├── 📄 README.md                        # Project Documentation
├── 📄 replit.md                        # Replit Configuration
├── 📄 replit.nix                       # Replit Nix Configuration
├── 📄 theme.json                       # Theme Configuration
├── 📄 generated-icon.png               # App Icon
├── 📄 app-skin-documentation.txt       # App Skin Documentation
├── 📄 complete-app-code.txt            # Complete App Code
└── 📄 node_modules/                    # Dependencies
```

---

## 🎨 User Interface Wireframes

### 1. Main Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│ 🏠 IterativStartups                    👤 User Menu    🔔   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   📊 Analytics   │  │  💼 Business    │  │  🤖 AI       │ │
│  │   Dashboard     │  │     Plans       │  │  Assistant   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  💰 Funding     │  │  📈 Portfolio   │  │  👥 Team      │ │
│  │   Matcher       │  │   Management    │  │  Management  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                📋 Recent Activity                      │ │
│  │  • Business plan analysis completed                    │ │
│  │  • New funding opportunity matched                     │ │
│  │  • Team member added to project                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2. Entrepreneur Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ 👤 Entrepreneur Dashboard                    📊 Quick Stats │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  📈 Business Metrics                                   │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │ │
│  │  │ Plans: 3│ │ Goal:   │ │ Team: 8 │ │Growth:  │      │ │
│  │  │         │ │ $500K   │ │         │ │ 23%     │      │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  💰 Funding Opportunities                              │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 🚀 Tech Accelerator Program    Match: 94%          │ │ │
│  │  │ $100K + Mentorship            Deadline: Feb 15     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 💡 Innovation Grant            Match: 89%          │ │ │
│  │  │ $50K Non-dilutive             Deadline: Jan 30     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  🤖 AI Co-Founder Assistant                           │ │
│  │  "Ready to help with your strategic planning. What     │ │
│  │   would you like to focus on today?"                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. Investor Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ 💼 Investor Dashboard                        📊 Portfolio   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  📈 Portfolio Performance                              │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │ │
│  │  │ Total   │ │ Active  │ │ ROI:    │ │ Risk:   │      │ │
│  │  │ Value   │ │ Deals   │ │ 24.5%   │ │ Low     │      │ │
│  │  │ $2.4M   │ │ 12      │ │         │ │         │      │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  🔍 Deal Pipeline                                      │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 🚀 TechStart Inc.           Stage: Series A        │ │ │
│  │  │ SaaS Platform              Ask: $2M for 20%        │ │ │
│  │  │ Match Score: 87%           Due Diligence: 85%     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ 💡 GreenTech Solutions      Stage: Seed             │ │ │
│  │  │ Clean Energy               Ask: $500K for 15%      │ │ │
│  │  │ Match Score: 92%           Due Diligence: 70%     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  🤖 Deal Analyzer AI                                  │ │
│  │  "I've identified 3 high-potential opportunities       │ │
│  │   that match your investment criteria."                │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 4. AI Chat Interface
```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 AI Assistant                        ⚙️ Settings    ❌   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  💬 Conversation History                               │ │
│  │                                                         │ │
│  │  👤 User: "Help me analyze my business plan"            │ │
│  │  🤖 AI: "I'd be happy to help! I can analyze your      │ │
│  │        business plan for market viability, financial   │ │
│  │        projections, and competitive positioning..."    │ │
│  │                                                         │ │
│  │  👤 User: "Focus on the financial projections"         │ │
│  │  🤖 AI: "Let me examine your financial projections.    │ │
│  │        I notice several areas that need attention..."   │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  💡 Quick Actions                                       │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │ │
│  │  │ Analyze │ │ Generate│ │ Review  │ │ Export  │      │ │
│  │  │ Plan    │ │ Report  │ │ Metrics │ │ Data    │      │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Type your message...                           📎 🎤  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow Diagrams

### 1. User Onboarding Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Landing   │───▶│   Sign Up   │───▶│ User Type   │
│    Page     │    │   / Login   │    │ Selection   │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Dashboard  │◀───│  Profile    │◀───│  Onboarding │
│   Access    │    │  Setup      │    │  Complete   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 2. Business Plan Creation Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Upload    │───▶│   AI        │───▶│  Analysis   │
│   Document  │    │ Analysis    │    │  Results    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Edit Plan  │    │  AI         │    │  Export     │
│  (Optional) │    │ Suggestions │    │  Reports    │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 3. Funding Matching Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Funding    │───▶│  AI         │───▶│  Match      │
│  Request    │    │ Matching    │    │  Results    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Apply to   │    │  Track      │    │  Connect    │
│  Funding    │    │  Progress   │    │  with       │
│  Sources    │    │             │    │  Funders    │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 4. AI Agent Interaction Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  User       │───▶│  Agent      │───▶│  AI         │
│  Request    │    │  Selection  │    │  Processing │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Response   │◀───│  Context    │◀───│  Memory     │
│  Delivery   │    │  Analysis   │    │  Update     │
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## 🏗️ System Architecture

### 1. High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Dashboard │ │   AI Chat   │ │  Document   │          │
│  │   Components│ │  Interface  │ │  Management │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   API       │ │   AI        │ │  Auth       │          │
│  │   Routes    │ │   Agents    │ │  Service    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   OpenAI    │ │   Azure     │ │   Google    │          │
│  │   API       │ │   AI        │ │   OAuth     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 2. AI Agent Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    AI Agent System                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                Agent Engine                            │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │ │
│  │  │   Request   │ │   Context   │ │   Response  │      │ │
│  │  │   Router    │ │   Manager   │ │   Handler   │      │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                Specialized Agents                       │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │ │
│  │  │  Business   │ │   Deal      │ │   Credit    │      │ │
│  │  │  Advisor    │ │  Analyzer   │ │  Assessor   │      │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘      │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │ │
│  │  │   Impact    │ │ Partnership │ │ Co-Founder │      │ │
│  │  │  Evaluator  │ │ Facilitator │ │   Agent    │      │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘      │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Agent System

### Agent Types and Capabilities

| Agent Type | Primary User | Key Capabilities |
|------------|--------------|------------------|
| **Business Advisor** | Entrepreneurs | Strategic planning, market analysis, financial modeling |
| **Deal Analyzer** | Investors | Investment evaluation, portfolio optimization, risk assessment |
| **Credit Assessor** | Lenders | Loan underwriting, financial analysis, risk scoring |
| **Impact Evaluator** | Grantors | Social impact measurement, ESG reporting |
| **Partnership Facilitator** | Partners/Accelerators | Startup-program matching, resource optimization |
| **Co-Founder Agent** | All Users | Universal strategic partner, accountability, coaching |

### AI Agent Features
- **Context-Aware Processing**: Maintains conversation history and user context
- **Task-Specific Prompts**: Specialized prompts for different business functions
- **Real-Time Responses**: Streaming responses for better user experience
- **Multi-Modal Capabilities**: Text, data, and document analysis
- **Memory System**: Learns from interactions and improves over time
- **Collaborative Intelligence**: Agents can work together on complex tasks
- **Azure AI Services Integration**: Content safety, sentiment analysis, intent detection
- **Emotional Intelligence**: Multi-dimensional emotion detection and response
- **Proactive Insights**: AI spots opportunities and risks automatically

### Advanced AI Capabilities
- **Multi-Perspective Decision Analysis**: 5+ AI viewpoints on critical decisions
- **Crisis Management**: Structured emergency response planning
- **Semantic Memory**: Vector-based search across business history
- **Content Safety**: Enterprise-grade content moderation
- **Personality Adaptation**: Agents adapt to user communication style
- **Goal Tracking**: Automated progress monitoring and accountability
- **Strategic Planning**: Long-term business strategy development
- **Performance Coaching**: Proactive guidance and motivation

### Co-Founder Agent Special Features
- **Daily Standup Management**: Structured daily progress reviews
- **Strategic Session Facilitation**: Deep strategic planning sessions
- **Devil's Advocate**: Critical thinking and challenge assumptions
- **Decision Support**: Multi-perspective decision analysis
- **Brainstorming Sessions**: Creative ideation facilitation
- **Accountability Checks**: Progress monitoring and course correction
- **Crisis Support**: Emergency response and problem-solving
- **Adaptive Response**: Context-aware communication styles

---

## 🎨 Design Thinking Integration

### Overview
The platform integrates Design Thinking methodology to prevent the #1 cause of startup failure: building solutions nobody wants. This creates a complete innovation operating system from idea to execution.

### 🎯 Design Thinking Process
1. **Empathize**: Deep user research and understanding
2. **Define**: Problem framing and opportunity identification
3. **Ideate**: Solution generation and brainstorming
4. **Prototype**: Rapid experimentation and testing
5. **Test**: User validation and learning

### 🛠️ Core DT Tools

#### Empathize Phase
- **Empathy Map Builder**: 6-quadrant canvas for user psychology analysis
- **User Journey Mapping**: End-to-end experience visualization
- **Interview Guide Generator**: Structured user research protocols
- **Persona Development**: User archetype creation and validation

#### Define Phase
- **POV Statement Builder**: Problem framing without solution bias
- **HMW Question Generator**: "How Might We" question creation
- **Problem Statement Canvas**: Structured problem definition
- **Opportunity Mapping**: Market gap identification

#### Ideate Phase
- **Brainstorming Canvas**: Structured ideation sessions
- **Solution Mapping**: Feature and functionality planning
- **Concept Development**: High-level solution design
- **Innovation Challenges**: Creative problem-solving exercises

#### Prototype Phase
- **Prototype Planner**: Fidelity selection and planning
- **Storyboard Builder**: Service concept visualization
- **Wireframe Tools**: Low-fidelity interface design
- **Mockup Generator**: Visual design creation

#### Test Phase
- **Test Session Manager**: 5-user testing protocol
- **Feedback Collection**: Structured user feedback
- **Learning Synthesis**: Pattern detection and insights
- **Iteration Planning**: Next steps based on learnings

### 🚀 Design Sprint Integration
- **5-Day Sprint Orchestrator**: Structured innovation process
- **Role Assignment**: Decider, Facilitator, Maker, etc.
- **Time Boxing**: Structured time management
- **Deliverable Tracking**: Progress monitoring and accountability

### 📊 DT-Specific AI Agents
1. **Empathy Coach**: Analyzes interviews, suggests missing insights
2. **Problem Framing Agent**: Detects solution bias, validates POVs
3. **Prototype Advisor**: Recommends fidelity, generates test plans
4. **Test Analyzer**: Real-time pattern detection, pivot recommendations
5. **Sprint Facilitator**: Day-by-day guidance, time-boxing enforcement
6. **Lean Coach**: Enforces Learn → Measure → Build sequence

### 📈 DT Rigor Scoring
```
DT Rigor Score = 
  Problem Validation (40%) +
  Solution Validation (30%) +
  Learning Velocity (20%) +
  Iteration Comfort (10%)
```

### 🎯 Business Impact
- **70% reduction** in building wrong solutions
- **5-10x faster** learning and validation
- **30% reduction** in time to product-market fit
- **3x improvement** in user retention
- **20% increase** in investment conversion

---

## 📊 Database Schema

### Core Entities
```typescript
// User Management
interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

// Business Plans
interface BusinessPlan {
  id: string;
  userId: string;
  title: string;
  content: string;
  status: PlanStatus;
  analysis: PlanAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

// AI Conversations
interface Conversation {
  id: string;
  userId: string;
  agentType: AgentType;
  messages: Message[];
  context: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

// Team Management
interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Endpoints

### Core Business Plan Endpoints
```
POST   /api/business-plans          # Create new business plan
GET    /api/business-plans/:id      # Get business plan details
PUT    /api/business-plans/:id      # Update business plan
DELETE /api/business-plans/:id      # Delete business plan
POST   /api/business-plans/:id/analyze  # AI analysis of business plan
```

### AI Agent Endpoints
```
POST   /api/ai-agents/chat          # Send message to AI agent
POST   /api/ai-agents/suggestions   # Get contextual suggestions
GET    /api/ai-agents/insights      # Get dashboard insights
POST   /api/ai-agents/automate      # Execute automation tasks
POST   /api/ai/market-analysis      # AI market analysis
POST   /api/ai/competitive-analysis # AI competitive analysis
POST   /api/ai/business-guidance    # AI business guidance
POST   /api/ai/credit-scoring       # AI credit scoring
```

### Design Thinking Endpoints
```
POST   /api/design-thinking/empathy-map     # Create empathy map
GET    /api/design-thinking/empathy-map/:id # Get empathy map
POST   /api/design-thinking/user-journey   # Create user journey
POST   /api/design-thinking/pov-statement  # Create POV statement
POST   /api/design-thinking/hmw-questions  # Generate HMW questions
POST   /api/design-thinking/prototype      # Create prototype plan
POST   /api/design-thinking/test-session   # Manage test sessions
POST   /api/design-thinking/sprint         # Start design sprint
```

### User and Team Management
```
GET    /api/users/profile           # Get user profile
PUT    /api/users/profile           # Update user profile
POST   /api/teams/invite            # Invite team member
GET    /api/teams/:id/members       # Get team members
POST   /api/teams/:id/roles         # Assign team roles
```

### Analytics and Reporting
```
GET    /api/analytics/dashboard     # Get dashboard metrics
GET    /api/analytics/reports       # Generate reports
POST   /api/analytics/export        # Export data
GET    /api/analytics/performance   # Performance metrics
```

### Point System Endpoints
```
GET    /api/points/:userId          # Get user points
POST   /api/points/add              # Add reward points
GET    /api/point-transactions/:userId # Get point transactions
POST   /api/point-transactions      # Create point transaction
```

### Authentication Endpoints
```
GET    /auth/azure                  # Initiate Azure AD OAuth
GET    /auth/azure/callback         # Handle Azure OAuth callback
GET    /auth/google                 # Initiate Google OAuth
GET    /auth/google/callback        # Handle Google OAuth callback
GET    /auth/user                   # Get current user
POST   /auth/logout                 # Logout user
```

---

## 🎨 Design System

### Color Palette
- **Primary Purple**: #8A4EF5 (Brand color, primary actions)
- **Teal Accent**: #4ED0F5 (Secondary actions, highlights)
- **Glass Effects**: Various opacity white backgrounds
- **Text Colors**: #2C2C2C (primary), #5A5A5A (secondary)

### Typography
- **Font Family**: Inter with weights 300-900
- **Responsive Scale**: Fluid typography that adapts to screen size
- **Hierarchy**: Clear distinction between headings, body, and interface text

### Glassmorphism Design
- Semi-transparent backgrounds with backdrop blur effects
- Layered glass containers with subtle borders and shadows
- Organic gradient backgrounds with animated blur shapes
- Consistent elevation system for visual hierarchy

---

## 📱 Progressive Web App Features

### PWA Capabilities
- **Offline Functionality**: Core features work without internet connection
- **Push Notifications**: Real-time updates and important alerts
- **App-Like Experience**: Install on mobile devices and desktop
- **Fast Loading**: Service worker caching for instant startup
- **Background Sync**: Data synchronization when connection is restored

### Mobile Optimization
- **Responsive Design**: Optimized layouts for all screen sizes
- **Touch Interactions**: Touch-friendly buttons and gestures
- **Mobile Navigation**: Collapsible menus and drawer navigation
- **Performance**: Optimized for mobile networks and devices

---

## 🔐 Security & Authentication

### Authentication Methods
- **Replit Auth**: Seamless integration with Replit ecosystem
- **Google OAuth**: External authentication for broader access
- **Development Mode**: Authentication bypass for local development
- **Session Management**: Secure cookie-based sessions with CSRF protection

### Security Features
- **Role-Based Access Control**: Permissions based on user type and team role
- **Data Validation**: Runtime validation with Zod schemas
- **Rate Limiting**: API protection against abuse
- **Secure Headers**: Security headers for XSS and injection protection
- **Environment Variables**: Secure configuration management

---

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for lightning-fast development and optimized builds
- **TanStack Query** for efficient server state management
- **Wouter** for client-side routing and navigation
- **Tailwind CSS** with custom glassmorphism design system
- **Radix UI** for accessible, customizable component library
- **Recharts** for advanced data visualization and analytics

### Backend
- **Express.js** with TypeScript for robust API development
- **Node.js** runtime for scalable server-side execution
- **OpenAI API Integration** for advanced AI capabilities
- **Passport.js** for secure authentication
- **Zod** for runtime type validation and data integrity
- **In-memory storage** for rapid development (database-ready architecture)

### AI Integration
- **Azure OpenAI**: GPT-4 with function calling and embeddings
- **Azure Cognitive Services**: Sentiment analysis, intent detection, content safety
- **Context-Aware Processing**: Maintains conversation history and user context
- **Task-Specific Prompts**: Specialized prompts for different business functions
- **Real-Time Responses**: Streaming responses for better user experience
- **Multi-Modal Capabilities**: Text, data, and document analysis

---

## 🚀 Deployment Guide

### Prerequisites
- **Node.js 18+** and npm/yarn
- **Azure OpenAI API key** for AI features
- **MongoDB** for data persistence
- **Git** for version control
- **Azure Account** for AI services (optional but recommended)

### Development Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd iterativstartups
   npm install
   ```

2. **Environment Configuration**
   Create `.env` file with required variables:
   ```bash
   # Database
   MONGODB_URI=mongodb://localhost:27017/iterativstartups
   
   # Azure OpenAI
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_API_KEY=your-azure-openai-key
   AZURE_OPENAI_DEPLOYMENT=gpt-4
   
   # Azure AI Services
   AZURE_AI_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
   AZURE_AI_API_KEY=your-azure-ai-key
   AZURE_REGION=eastus
   
   # Authentication
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Application
   NODE_ENV=development
   PORT=5000
   SESSION_SECRET=secure-random-string
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Access the application at `http://localhost:5000`

### Production Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy on Azure**
   - Configure Azure App Service
   - Set up Azure Cosmos DB
   - Configure environment variables
   - Enable Azure AI Services

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🔐 Security & Authentication

### Authentication Methods
- **Azure AD**: Enterprise-grade authentication with SSO
- **Google OAuth**: External authentication for broader access
- **Development Mode**: Authentication bypass for local development
- **Session Management**: Secure cookie-based sessions with CSRF protection

### Security Features
- **Role-Based Access Control**: Permissions based on user type and team role
- **Data Validation**: Runtime validation with Zod schemas
- **Rate Limiting**: API protection against abuse
- **Secure Headers**: Security headers for XSS and injection protection
- **Content Safety**: Azure AI Services content moderation
- **Environment Variables**: Secure configuration management

### Azure AI Services Security
- **Content Safety**: Automatic content moderation and filtering
- **Data Residency**: Control over data location and processing
- **Compliance**: SOC 2, ISO 27001, and GDPR compliance
- **Encryption**: End-to-end encryption for all data transmission

---

## ⚡ Performance & Optimization

### Frontend Optimizations
- **Code Splitting**: Lazy loading for components and routes
- **Bundle Optimization**: Vite for fast builds and HMR
- **Caching**: Service worker for offline functionality
- **Image Optimization**: WebP format and lazy loading
- **Tree Shaking**: Remove unused code from bundles

### Backend Optimizations
- **Database Indexing**: Optimized queries for MongoDB
- **Caching**: Redis for session and data caching
- **Rate Limiting**: Prevent API abuse and ensure fair usage
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip compression for API responses

  ### AI Performance
  - **Streaming Responses**: Real-time AI responses
  - **Context Management**: Efficient conversation history handling
  - **Caching**: Intelligent caching of AI responses
  - **Load Balancing**: Distribute AI requests across multiple instances

  ### Monitoring & Metrics

  ## 🧪 Assessment System (New)

  ### Overview
  The platform includes a fully integrated assessment system with backend services, REST API, Azure MongoDB persistence, frontend hooks, and a complete UI flow. It powers personality-driven agent adaptation and user insights.

  ### Components
  - Engine Package: `packages/assessment-engine/`
    - Modules: `assessments/riasec`, `assessments/design-thinking`, `models/*`, `engine.ts`, `index.ts`
  - Backend Services:
    - `server/services/assessment-database.ts`
    - `server/services/assessment-integration.ts`
    - `server/routes/assessment-routes.ts`
  - Frontend:
    - Hook: `client/src/hooks/useAssessment.ts`
    - UI: `client/src/components/assessments/AssessmentFlow.tsx`
  - ### Database Collections (Azure MongoDB)
  - `assessment_sessions` – active and completed sessions
  - `completed_assessments` – persisted results and optional composite profile
  - `assessment_history` – longitudinal tracking and evolution
  - ### API Endpoints (base: `/api/assessments`)
  - `GET /types` – list available assessments
  - `POST /start` – create session and return questions
  - `POST /response` – submit an answer and update progress
  - `POST /complete` – compute results, persist assessment
  - `POST /abandon` – abandon session
  - `GET /session/:sessionId` – fetch session details
  - `GET /active` – list user’s active sessions
  - `GET /results/:assessmentType` – latest results of a type
  - `GET /results` – list all results for user
  - `GET /profile` – composite profile (if available)
  - `GET /personality` – latest personality profile
  - `GET /agent-adaptation/:agentType` – agent-specific adaptation
  - `POST /adapt-agents` – adapt all Co-Agents from latest personality profile
  - ### Frontend Usage
  - Start assessment: `useAssessment().startNewAssessment('riasec')`
  - Submit answer: `useAssessment().answerQuestion(questionId, value)`
  - Complete: `useAssessment().finishAssessment()`
  - Adapt agents: `useAssessment().adaptAgents()`
  - Results: `useAssessmentResults('riasec')`
  - ### Documentation
  - `docs/ASSESSMENT_SYSTEM_IMPLEMENTATION.md`
  - `docs/TWO_TIER_AGENTIC_SYSTEM_IMPLEMENTATION.md`

---

## Business Plan Editor (Updated)

### Overview
The Business Plan experience has been upgraded with a structured editor, real-time progress tracking, and AI-ready hooks. The primary page is `client/src/pages/edit-plan.tsx`, which composes navigation, an editor, and a progress dashboard.

### Frontend Structure
- **Page**: `client/src/pages/edit-plan.tsx`
  - Uses `BusinessPlanProvider` from `client/src/contexts/BusinessPlanContext.tsx`
  - Loads structure from `client/src/constants/businessPlanStructure.ts`
  - Fetches plan data via React Query: `useQuery({ queryKey: [\`/api/business-plans/${id}\`] })`
- **Components** (`client/src/components/business-plan/`):
  - `ChapterNavigation.tsx` – hierarchical chapter/section navigation
  - `SectionEditor.tsx` – rich editor with save hooks, word count, AI integration points
  - `ProgressDashboard.tsx` – overall and per-chapter progress stats

### Behavior
- **Deep linking**: The page persists `chapter` and `section` in the URL query string for shareable state.
- **Tabs**: Two views – `Editor` and `Progress` – via `Tabs` from the UI library.
- **Actions**: Header includes navigation back to `'/dashboard'`, and placeholders for `Preview` and `Export` actions (wired to toasts for now).

### State & Context
- `BusinessPlanProvider` supplies metadata, section content, progress, auto-save, and persistence helpers.
- Hooks planned/available for AI and progress: `useBusinessPlanAI`, `useBusinessPlanProgress`.

### Related Documentation
- See `docs/BUSINESS_PLAN_IMPROVEMENTS.md` for the detailed architecture, components, hooks, and usage examples.

## Business Plan API (Updated)

Base path: `/api/business-plans` (see `server/routes/business-plan-routes.ts`). All routes require authentication via `isAuthenticated` middleware.

### Plan Endpoints
- `GET /api/business-plans` – list plans for the authenticated user
- `GET /api/business-plans/:id` – fetch a specific plan (ownership enforced)
- `POST /api/business-plans` – create a plan (validated by `InsertBusinessPlanSchema`)
- `PATCH /api/business-plans/:id` – update a plan (ownership enforced)
- `DELETE /api/business-plans/:id` – delete a plan (ownership enforced)

### Section Endpoints
- `GET /api/business-plans/:planId/sections` – list sections for a plan
- `POST /api/business-plans/:planId/sections` – create a section for a plan (validated by `InsertPlanSectionSchema`)

### Frontend Usage Example
- Fetch in `edit-plan.tsx`:
  - `useQuery({ queryKey: [\`/api/business-plans/${id}\`] })`
- Navigation and editor selection are derived from `BUSINESS_PLAN_STRUCTURE` and URL params.

### Notes
- Validation schemas referenced from `shared/types/validation.ts`.
- Repository access via `server/repositories` with request logging in `server/utils/logger`.
