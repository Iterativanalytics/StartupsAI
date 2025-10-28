
# IterativStartups Platform

A comprehensive startup ecosystem platform built with React, TypeScript, and Express.js featuring glassmorphism design.

## Features

### Core Business Plan Tools
- **Dashboard**: Overview of business plans and analytics
- **Upload Plan**: Create and upload new business plans
- **Edit Plan**: Modify existing business plans
- **Analysis**: Comprehensive business plan analysis with investor and entrepreneur perspectives
- **Pitch Deck**: Generate presentation materials
- **Valuation**: Calculate and track company valuations

### Funding & Investment
- **Funding Matcher**: Connect with relevant investors and funding opportunities
- **Funding Tracker**: Track funding rounds and investor relationships
- **Investor Dashboard**: Investor portal and due diligence materials
- **Portfolios**: Manage investment portfolios and performance

### Startup Ecosystem Models
- **Ecosystem Hub**: Choose between different startup ecosystem models
- **Venture Studio**: Build companies from scratch with full-service support (20-50% equity)
- **Accelerator**: Intensive 12-week programs for existing startups (6-10% equity)
- **Incubator**: Long-term nurturing with flexible support (0-10% equity)

### Documents Hub (New!)
- **IterativPlans**: AI-powered business plan creation with Fast-Track and Validated modes
- **IterativDecks**: Pitch deck generation with multiple presentation styles
- **IterativProposals**: Grant and investment proposal builder
- **IterativForms**: Application filler for accelerators, grants, and competitions
- **Co-Founder AI Agent**: Virtual co-founder with customizable personality and vested interest gamification
- **WhatsApp Integration**: Real-time notifications and milestone tracking
- **Onboarding System**: Persona-based assessment (RIASEC, Big Five, AI Readiness) with founder archetype matching

### Additional Tools
- **Education**: Educational resources and workshops
- **Programs**: Startup programs and cohort management
- **Venture Building**: Company building resources
- **Credit Monitoring**: Business credit tracking and monitoring

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS with glassmorphism design
- **UI Components**: Custom component library with Radix UI
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Design System

The app features a sophisticated glassmorphism design with:
- Purple-teal color scheme (#8A4EF5 to #4ED0F5)
- Glass-like components with backdrop blur effects
- Gradient backgrounds and text treatments
- Clean typography with Inter font
- Responsive design for mobile and desktop

## Development

The application runs on port 5000 with hot module reloading enabled. The backend Express server serves the API endpoints and uses Vite middleware to handle the frontend with HMR (Hot Module Reloading) support.

### Running the Application

1. The server starts automatically via the configured workflow
2. Access the application at the webview URL (port 5000)
3. The server logs show initialization progress and any errors

### Configuration

- **PORT**: 5000 (configured in .env)
- **MongoDB**: Disabled by default (connection string commented out in .env)
- **Vite**: Configured for Replit environment with HMR over WSS on port 443
- **Backend API**: Proxied through `/api` routes

### Key Routes
- `/` - Dashboard
- `/documents-hub` - **NEW**: Unified Documents Hub (Plans, Decks, Proposals, Forms)
- `/ecosystem` - Ecosystem hub with model comparison
- `/venture-studio` - Venture studio management
- `/accelerator` - Accelerator programs
- `/incubator` - Incubator spaces and programs
- `/funding-matcher` - Investor matching
- `/analysis/:id` - Business plan analysis
- `/valuation` - Company valuation tools

## Recent Updates

### IterativStartups 1.0 - Documents Hub Integration (Latest)
- **Four Unified Modules**: Integrated IterativPlans, IterativDecks, IterativProposals, and IterativForms into a central hub
- **Co-Founder AI Agent**: Virtual co-founder with personality customization, vested interest mechanics, and multi-mode conversation
- **Smart Onboarding**: RIASEC, Big Five, and AI Readiness assessments with founder archetype matching
- **WhatsApp Notifications**: Real-time alerts for high-priority insights, goal updates, and weekly summaries
- **Modular Architecture**: Clean separation with modules, contexts, and shared components
- **Google Gemini Integration**: AI content generation across all document types
- **Assumption Dashboard**: Cross-module assumption tracking and validation

### Previous Updates
- **Enhanced Landing Experience**: Smart onboarding flow with role-based personalization for entrepreneurs, investors, lenders, grantors, and partners
- **Improved User Journey Flows**: Multi-step assessment and customized dashboard generation based on user type and goals  
- **Advanced Ecosystem Hub**: AI-powered ecosystem matcher and global program directory with 500+ partner programs
- **Role-Based Navigation**: Mega menu with contextual paths and personalized tool recommendations
- **Comprehensive Design System**: Glassmorphism aesthetic with purple-teal gradients and enhanced accessibility
- **Performance Optimizations**: Progressive loading, mobile-first responsive design, and optimized user flows
- **Success Metrics Integration**: Real-time platform performance tracking and user engagement analytics

The platform provides a complete solution for entrepreneurs, investors, and startup ecosystem participants with tools for every stage of the startup journey.
