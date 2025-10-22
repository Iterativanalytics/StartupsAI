# Complete Frontend Code Documentation

This document contains the complete frontend code for the StartupsAI application, excluding all backend code.

## Table of Contents

1. [Project Configuration](#project-configuration)
2. [Main Application Files](#main-application-files)
3. [HTML Entry Point](#html-entry-point)
4. [Main Application Component](#main-application-component)
5. [Styling and CSS](#styling-and-css)
6. [Configuration Files](#configuration-files)
7. [Core Components](#core-components)
8. [Pages](#pages)
9. [Hooks](#hooks)
10. [Utilities](#utilities)
11. [Context Providers](#context-providers)

---

## Project Configuration

### package.json
```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx --fix",
    "lint:check": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "clean": "rm -rf dist build node_modules/.cache",
    "prebuild": "npm run type-check && npm run lint:check",
    "precommit": "npm run type-check && npm run lint:check && npm run format:check"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.65.0",
    "@azure/msal-browser": "^4.24.0",
    "@azure/msal-node": "^3.8.0",
    "@hookform/resolvers": "^3.9.1",
    "@jridgewell/trace-mapping": "^0.3.25",
    "@radix-ui/react-accordion": "^1.2.1",
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-collapsible": "^1.1.1",
    "@radix-ui/react-context-menu": "^2.2.2",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-hover-card": "^1.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.2",
    "@radix-ui/react-navigation-menu": "^1.2.1",
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.1",
    "@radix-ui/react-scroll-area": "^1.2.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.3",
    "@tanstack/react-query": "^5.60.5",
    "@types/memoizee": "^0.4.12",
    "@types/passport-google-oauth20": "^2.0.16",
    "@types/react-router-dom": "^5.3.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "connect-pg-simple": "^10.0.0",
    "date-fns": "^3.6.0",
    "dotenv": "^17.2.3",
    "embla-carousel-react": "^8.3.0",
    "express": "^4.21.2",
    "express-rate-limit": "^8.1.0",
    "express-session": "^1.18.1",
    "framer-motion": "^11.13.1",
    "helmet": "^8.1.0",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.453.0",
    "memoizee": "^0.4.17",
    "memorystore": "^1.6.7",
    "mongodb": "^6.20.0",
    "mongoose": "^8.18.2",
    "openai": "^4.104.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-local": "^1.0.0",
    "puppeteer": "^24.23.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-dropzone": "^14.3.8",
    "react-hook-form": "^7.53.1",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.4",
    "react-router-dom": "^7.9.3",
    "recharts": "^2.13.0",
    "socket.io": "^4.8.1",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^1.1.0",
    "wouter": "^3.3.5",
    "ws": "^8.18.0",
    "zod": "^3.23.8",
    "zod-validation-error": "^3.4.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "@types/connect-pg-simple": "^7.0.3",
    "@types/express": "4.17.21",
    "@types/express-session": "^1.18.0",
    "@types/node": "20.16.11",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@types/ws": "^8.5.13",
    "@vitejs/plugin-react": "^4.3.2",
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "autoprefixer": "^10.4.20",
    "esbuild": "0.21.5",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "globals": "^13.23.0",
    "husky": "^8.0.3",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "postcss": "^8.4.47",
    "prettier": "^3.1.0",
    "tailwindcss": "^3.4.14",
    "ts-jest": "^29.1.1",
    "tsx": "^4.19.1",
    "typescript": "5.6.3",
    "typescript-eslint": "^7.18.0",
    "vite": "^5.4.14"
  },
  "optionalDependencies": {
    "bufferutil": "^4.0.8"
  }
}
```

---

## HTML Entry Point

### client/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="description" content="Advanced analytics dashboard with predictive insights for startups" />
    <meta name="theme-color" content="#8A4EF5" />

    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json" />

    <!-- Apple specific meta tags -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="IS Dashboard" />
    <link rel="apple-touch-icon" href="/icon-192.png" />

    <!-- Microsoft specific meta tags -->
    <meta name="msapplication-TileImage" content="/icon-144.png" />
    <meta name="msapplication-TileColor" content="#8A4EF5" />

    <!-- Preconnect to external domains for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <title>IterativStartups Dashboard</title>

    <!-- Enhanced critical CSS for mobile loading -->
    <style>
      /* Enhanced critical CSS for mobile loading */
      .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        height: 100dvh; /* Dynamic viewport height for mobile */
        background: linear-gradient(135deg, #8A4EF5 0%, #4ED0F5 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Mobile-first responsive design */
      @media (max-width: 768px) {
        body { font-size: 14px; }
        .container { padding: 1rem; }
      }

      /* Reduce motion for accessibility */
      @media (prefers-reduced-motion: reduce) {
        .loading-spinner { animation: none; }
        * { animation-duration: 0.01ms !important; }
      }
    </style>
  </head>
  <body>
    <!-- Loading screen -->
    <div id="loading-screen" class="loading-screen">
      <div class="loading-spinner"></div>
      <p style="margin-top: 1rem;">Loading Dashboard...</p>
    </div>

    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>

    <!-- Service Worker Registration -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
              console.log('SW registration failed: ', registrationError);
            });
        });
      }

      // Hide loading screen when app loads
      window.addEventListener('load', () => {
        setTimeout(() => {
          const loadingScreen = document.getElementById('loading-screen');
          if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
              loadingScreen.style.display = 'none';
            }, 300);
          }
        }, 1000);
      });

      // Also hide loading screen when DOM is ready
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
      }, 2000);
      });

      // Install prompt for PWA
      let deferredPrompt;
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Show install button/banner if desired
        console.log('PWA install prompt ready');
      });
    </script>
  </body>
</html>
```

---

## Main Application Files

### client/src/main.tsx
```tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { FeatureFlagsProvider } from "@/contexts/FeatureFlagsContext";
import { TooltipProvider } from "@/components/ui/tooltip";

// Ensure the root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found!</div>';
} else {
  console.log("Root element found, rendering app...");
  createRoot(rootElement).render(
    <FeatureFlagsProvider>
      <TooltipProvider delayDuration={200} skipDelayDuration={0}>
        <App />
      </TooltipProvider>
    </FeatureFlagsProvider>
  );
}
```

### client/src/App.tsx
```tsx
import { Router, Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import OfflineIndicator from "@/components/OfflineIndicator";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import Dashboard from "@/pages/dashboard";
import Upload from "@/pages/upload";
import EditPlan from "@/pages/edit-plan";
import Analysis from "@/pages/analysis";
import FundingMatcher from "@/pages/funding-matcher";
import Funding from "@/pages/funding";
import EquityFunding from "@/pages/equity-funding";
import DebtFunding from "@/pages/debt-funding";
import GrantFunding from "@/pages/grant-funding";
import CompetitiveAdvantage from "@/pages/competitive-advantage";
import IndustryAnalysis from "@/pages/industry-analysis";
import StartupLeague from "@/pages/startup-league";
import InvestorDashboard from "@/pages/investor-dashboard";
import Portfolios from "@/pages/portfolios";
import Education from "@/pages/education";
import EducationFundamentals from "@/pages/education-fundamentals";
import EducationFunding from "@/pages/education-funding";
import EducationProduct from "@/pages/education-product";
import EducationLeadership from "@/pages/education-leadership";
import Programs from "@/pages/programs";
import VentureBuilding from "@/pages/venture-building";
import PitchDeck from "@/pages/pitch-deck";
import Valuation from "@/pages/valuation";
import AICreditScoring from "@/pages/ai-credit-scoring";
import NotFound from "@/pages/not-found";
import EcosystemHub from "@/pages/ecosystem-hub";
import DocumentsHub from "@/pages/documents-hub";
import VentureStudio from "@/pages/venture-studio";
import Accelerator from "./pages/accelerator";
import Incubator from "@/pages/incubator";
import Proposals from "@/pages/proposals";
import Applications from "@/pages/applications";
import Login from "@/pages/login"; // Assuming Login component is created
import Collaboration from "@/pages/collaboration";
import AIMarketAnalysis from "@/pages/ai-market-analysis";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import { CoFounderHub } from "@/components/co-founder/CoFounderHub";
import AssessmentDemo from "@/pages/assessment-demo";
import AIBusinessPlan from "@/pages/ai-business-plan";
import AppleDashboard from "@/pages/apple-dashboard";
import Profile from "@/pages/profile";
import Team from "@/pages/team";
import Organizations from "@/pages/organizations";
import Settings from "@/pages/settings";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect } from 'react';
import { useFeature } from '@/contexts/FeatureFlagsContext';

function App() {
  const globalSearchEnabled = useFeature('global_search_v1');
  useEffect(() => {
    if (!globalSearchEnabled) return;
    const handler = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'k');
      if (isCmdK) {
        e.preventDefault();
        const openEvent = new CustomEvent('global-search:open');
        window.dispatchEvent(openEvent);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [globalSearchEnabled]);
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="relative z-10">
              <Navbar />
              <main className="pt-20">
              <Switch>
                <Route path="/test" component={() => <div className="p-8"><h1 className="text-2xl font-bold">Test Page - App is working!</h1></div>} />
                <Route path="/login" component={Login} />
                <Route path="/" component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/documents" component={() => <ProtectedRoute><DocumentsHub /></ProtectedRoute>} />
                <Route path="/business-plans" component={() => <ProtectedRoute><Upload /></ProtectedRoute>} />
                <Route path="/upload" component={() => <ProtectedRoute><Upload /></ProtectedRoute>} />
                <Route path="/proposals" component={() => <ProtectedRoute><Proposals /></ProtectedRoute>} />
                <Route path="/pitch-decks" component={() => <ProtectedRoute><PitchDeck /></ProtectedRoute>} />
                <Route path="/applications" component={() => <ProtectedRoute><Applications /></ProtectedRoute>} />
                <Route path="/edit-plan/:id" component={() => <ProtectedRoute><EditPlan /></ProtectedRoute>} />
                <Route path="/analysis/:id" component={() => <ProtectedRoute><Analysis /></ProtectedRoute>} />
                <Route path="/funding-matcher" component={() => <ProtectedRoute><FundingMatcher /></ProtectedRoute>} />
                <Route path="/funding" component={() => <ProtectedRoute><Funding /></ProtectedRoute>} />
                <Route path="/funding/equity" component={() => <ProtectedRoute><EquityFunding /></ProtectedRoute>} />
                <Route path="/funding/debt" component={() => <ProtectedRoute><DebtFunding /></ProtectedRoute>} />
                <Route path="/funding/grants" component={() => <ProtectedRoute><GrantFunding /></ProtectedRoute>} />
                <Route path="/competitive-advantage" component={() => <ProtectedRoute><CompetitiveAdvantage /></ProtectedRoute>} />
                <Route path="/industry-analysis" component={() => <ProtectedRoute><IndustryAnalysis /></ProtectedRoute>} />
                <Route path="/startup-league" component={() => <ProtectedRoute><StartupLeague /></ProtectedRoute>} />
                <Route path="/investor-dashboard" component={() => <ProtectedRoute><InvestorDashboard /></ProtectedRoute>} />
                <Route path="/portfolios" component={() => <ProtectedRoute><Portfolios /></ProtectedRoute>} />
                <Route path="/education" component={Education} />
                <Route path="/education/fundamentals" component={() => <ProtectedRoute><EducationFundamentals /></ProtectedRoute>} />
                <Route path="/education/funding" component={() => <ProtectedRoute><EducationFunding /></ProtectedRoute>} />
                <Route path="/education/product" component={() => <ProtectedRoute><EducationProduct /></ProtectedRoute>} />
                <Route path="/education/leadership" component={() => <ProtectedRoute><EducationLeadership /></ProtectedRoute>} />
                <Route path="/programs" component={Programs} />
                <Route path="/venture-building" component={() => <ProtectedRoute><VentureBuilding /></ProtectedRoute>} />
                <Route path="/pitch-deck" component={() => <ProtectedRoute><PitchDeck /></ProtectedRoute>} />
                <Route path="/valuation" component={() => <ProtectedRoute><Valuation /></ProtectedRoute>} />
                <Route path="/ai-credit-scoring" component={() => <ProtectedRoute><AICreditScoring /></ProtectedRoute>} />
                <Route path="/ecosystem" component={EcosystemHub} />
                <Route path="/venture-studio" component={() => <ProtectedRoute><VentureStudio /></ProtectedRoute>} />
                <Route path="/accelerator" component={() => <ProtectedRoute><Accelerator /></ProtectedRoute>} />
                <Route path="/incubator" component={() => <ProtectedRoute><Incubator /></ProtectedRoute>} />
                <Route path="/collaboration/:id" component={Collaboration} />
                <Route path="/ai-market-analysis/:id" component={AIMarketAnalysis} />
                <Route path="/analytics" component={() => <ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
                <Route path="/co-founder" component={() => <ProtectedRoute><CoFounderHub /></ProtectedRoute>} />
                <Route path="/assessment-demo" component={AssessmentDemo} />
                <Route path="/ai-business-plan" component={() => <ProtectedRoute><AIBusinessPlan /></ProtectedRoute>} />
                <Route path="/apple-dashboard" component={AppleDashboard} />
        <Route path="/profile" component={() => <ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/team" component={() => <ProtectedRoute><Team /></ProtectedRoute>} />
        <Route path="/organizations" component={() => <ProtectedRoute><Organizations /></ProtectedRoute>} />
        <Route path="/settings" component={() => <ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route component={NotFound} />
              </Switch>
              </main>
            </div>
          </div>
        </Router>
        <Toaster />
        <OfflineIndicator />
        <PWAInstallPrompt />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
```

---

## Configuration Files

### tsconfig.json
```json
{
  "include": ["client/src/**/*", "shared/**/*", "server/**/*", "packages/**/*"],
  "exclude": ["node_modules", "build", "dist", "**/*.test.ts"],
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./node_modules/typescript/tsbuildinfo",
    "noEmit": true,
    "module": "ESNext",
    "strict": true,
    "lib": ["esnext", "dom", "dom.iterable"],
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "types": ["node", "vite/client"],
    "downlevelIteration": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
```

### vite.config.ts
```tsx
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### tailwind.config.ts
```tsx
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './client/src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#8A4EF5",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#4ED0F5",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backdropBlur: {
        '4xl': '72px',
        '5xl': '100px',
      },
      boxShadow: {
        'subtle': '0 5px 20px rgba(0, 0, 0, 0.08)',
        'strong': '0 12px 35px rgba(0, 0, 0, 0.18)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

---

## Core Utilities

### client/src/lib/utils.ts
```tsx
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Context Providers

### client/src/contexts/FeatureFlagsContext.tsx
```tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type FeatureFlagKey =
  | 'onboarding_v2'
  | 'contextual_tour_v1'
  | 'nav_action_model'
  | 'sidebar_context_v1'
  | 'help_tooltips_v1'
  | 'help_hub'
  | 'global_search_v1';

export type FeatureFlags = Record<FeatureFlagKey, boolean>;

const DEFAULT_FLAGS: FeatureFlags = {
  onboarding_v2: true,
  contextual_tour_v1: false,
  nav_action_model: true,
  sidebar_context_v1: false,
  help_tooltips_v1: true,
  help_hub: true,
  global_search_v1: true,
};

type FeatureFlagsContextValue = {
  flags: FeatureFlags;
  isEnabled: (key: FeatureFlagKey) => boolean;
  setFlag: (key: FeatureFlagKey, enabled: boolean) => void;
  setFlags: (next: Partial<FeatureFlags>) => void;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null);

function readBootstrapFlags(): Partial<FeatureFlags> {
  if (typeof window !== 'undefined' && (window as any).__FLAGS__) {
    return (window as any).__FLAGS__ as Partial<FeatureFlags>;
  }
  return {};
}

function readStoredFlags(): Partial<FeatureFlags> {
  try {
    const raw = localStorage.getItem('feature_flags');
    return raw ? (JSON.parse(raw) as Partial<FeatureFlags>) : {};
  } catch {
    return {};
  }
}

function persistFlags(flags: FeatureFlags) {
  try {
    localStorage.setItem('feature_flags', JSON.stringify(flags));
  } catch {
    // ignore
  }
}

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode; initialFlags?: Partial<FeatureFlags> }> = ({
  children,
  initialFlags,
}) => {
  const [flags, setFlagsState] = useState<FeatureFlags>(() => ({
    ...DEFAULT_FLAGS,
    ...readBootstrapFlags(),
    ...readStoredFlags(),
    ...initialFlags,
  }));

  useEffect(() => {
    persistFlags(flags);
  }, [flags]);

  const isEnabled = useCallback((key: FeatureFlagKey) => !!flags[key], [flags]);

  const setFlag = useCallback((key: FeatureFlagKey, enabled: boolean) => {
    setFlagsState(prev => ({ ...prev, [key]: enabled }));
  }, []);

  const setFlags = useCallback((next: Partial<FeatureFlags>) => {
    setFlagsState(prev => ({ ...prev, ...next }));
  }, []);

  const value = useMemo<FeatureFlagsContextValue>(
    () => ({ flags, isEnabled, setFlag, setFlags }),
    [flags, isEnabled, setFlag, setFlags]
  );

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
};

export function useFeatureFlags(): FeatureFlagsContextValue {
  const ctx = useContext(FeatureFlagsContext);
  if (!ctx) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return ctx;
}

export function useFeature(key: FeatureFlagKey): boolean {
  return useFeatureFlags().isEnabled(key);
}

export const FeatureGate: React.FC<{ flag: FeatureFlagKey; children: React.ReactNode; fallback?: React.ReactNode }> = ({
  flag,
  children,
  fallback = null,
}) => {
  const enabled = useFeature(flag);
  return <>{enabled ? children : fallback}</>;
};
```

---

## Main Pages

### client/src/pages/dashboard.tsx
```tsx
import { useAuth } from "@/hooks/use-auth";
import { UserType } from "@shared/schema";
import { UnifiedDashboard } from "@/components/dashboard";
import UserTypeSelector from "../components/onboarding/UserTypeSelector";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { useFeature } from "@/contexts/FeatureFlagsContext";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const onboardingEnabled = useFeature('onboarding_v2');

  if (isLoading) {
    return <PageLoadingSpinner text="Loading your personalized dashboard..." />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen">
        {onboardingEnabled ? (
          <OnboardingWizard onComplete={() => { /* no-op */ }} onSkip={() => { /* no-op */ }} />
        ) : (
          <UserTypeSelector onUserTypeSelect={(type, subtype) => {
            setSelectedUserType(type);
            console.log('Selected user type:', type, 'subtype:', subtype);
          }} />
        )}
      </div>
    );
  }

  // Use the user's stored type or the selected type
  const userType = (user.userType as UserType) || selectedUserType;

  // If user doesn't have a type set and hasn't selected one, show selector
  if (!userType) {
    return (
      <div className="min-h-screen">
        {onboardingEnabled ? (
          <OnboardingWizard onComplete={() => { /* no-op */ }} onSkip={() => { /* no-op */ }} />
        ) : (
          <UserTypeSelector onUserTypeSelect={(type, subtype) => {
            setSelectedUserType(type);
            console.log('Selected user type:', type, 'subtype:', subtype);
          }} />
        )}
      </div>
    );
  }

  // Use the unified dashboard system
  return <UnifiedDashboard userType={userType} />;
}
```

---

## Core Layout Components

### client/src/components/layout/Navbar.tsx
```tsx
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  DollarSign,
  Users,
  GraduationCap,
  Building2,
  PieChart,
  CreditCard,
  Rocket,
  Lightbulb,
  Target,
  Trophy,
  TrendingUp,
  Award,
  Book,
  Presentation,
  User,
  LogOut,
  Building,
  ChevronDown,
  Plus,
  Settings,
  Menu,
  X
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useFeature } from "@/contexts/FeatureFlagsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationCenter } from "@/components/ui/notification-center";
import { useAuth } from "@/hooks/use-auth";

const ListItem = ({ className, title, href, children, ...props }: any) => {
  return (
    <div>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10",
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-none">{title}</div>
          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
            {children}
          </div>
        </Link>
      </NavigationMenuLink>
    </div>
  );
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const globalSearchEnabled = useFeature('global_search_v1');

  const getUserInitials = (user: any) => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";
  };

  const [location] = useLocation();

  useEffect(() => {
    if (!globalSearchEnabled) return;
    const open = () => setIsSearchOpen(true);
    window.addEventListener('global-search:open', open as EventListener);
    return () => window.removeEventListener('global-search:open', open as EventListener);
  }, [globalSearchEnabled]);

  return (
    <nav className="fixed top-0 w-full z-50 glass-container border-b border-white/10 shadow-sm safe-area-top">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <div className="flex items-center space-x-4 sm:space-x-10">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3" data-testid="link-home">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-500 via-purple-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md touch-target">
                <span className="text-white font-semibold text-xs sm:text-sm tracking-tight">IS</span>
              </div>
              <span className="font-semibold text-lg sm:text-xl gradient-text tracking-tight hidden xs:inline">
                IterativStartups
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Documents</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                      <div className="row-span-4">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/documents"
                          >
                            <BarChart3 className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Document Hub
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Overview of all your strategic documents and analytics
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div className="grid gap-2">
                        <ListItem href="/business-plans" title="Business Plans">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">Strategic planning</span>
                          </div>
                          Create and manage comprehensive business plans
                        </ListItem>
                        <ListItem href="/proposals" title="Proposals">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-600">Grant & partnership</span>
                          </div>
                          Grant, partnership, and service proposals
                        </ListItem>
                        <ListItem href="/pitch-decks" title="Pitch Decks">
                          <div className="flex items-center gap-2 mb-1">
                            <Presentation className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600">Investor ready</span>
                          </div>
                          Investor presentations and demo day materials
                        </ListItem>
                        <ListItem href="/applications" title="Applications">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="h-4 w-4 text-orange-600" />
                            <span className="text-xs font-medium text-orange-600">Competitions</span>
                          </div>
                          Accelerator, grant, and competition applications
                        </ListItem>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Additional navigation items would continue here... */}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {globalSearchEnabled && (
              <>
                <Button
                  variant="ghost"
                  className="h-9 px-3 hidden sm:flex items-center gap-2"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <span className="text-sm">Search</span>
                  <kbd className="hidden md:inline text-[10px] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
                </Button>
                <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                  <CommandInput placeholder="Search documents, pages, and resources..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Go to">
                      <CommandItem onSelect={() => { setIsSearchOpen(false); (window.location.href = '/documents'); }}>Documents</CommandItem>
                      <CommandItem onSelect={() => { setIsSearchOpen(false); (window.location.href = '/funding'); }}>Funding Hub</CommandItem>
                      <CommandItem onSelect={() => { setIsSearchOpen(false); (window.location.href = '/education'); }}>Learning Hub</CommandItem>
                      <CommandItem onSelect={() => { setIsSearchOpen(false); (window.location.href = '/analytics'); }}>Analytics</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </CommandDialog>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="lg:hidden h-9 w-9 p-0 touch-target"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="hidden sm:flex items-center space-x-3">
              <ThemeToggle />
              <NotificationCenter />

              {/* User Menu */}
              {isLoading ? (
                <Button variant="ghost" className="font-medium text-sm hover:bg-black/5 dark:hover:bg-white/10 rounded-lg px-4 py-2">
                  Loading...
                </Button>
              ) : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-teal-500 text-white">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white/90 backdrop-blur-md border border-white/20" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/team">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Team Management</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/organizations">
                        <Building className="mr-2 h-4 w-4" />
                        <span>Organizations</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={login} className="mobile-button font-medium text-sm hover:bg-black/5 dark:hover:bg-white/10 rounded-lg px-4 py-2 sm:px-6 sm:py-3">
                    Sign In
                  </Button>
                  <Button onClick={login} className="safari-button mobile-button text-sm font-medium rounded-lg px-6 py-2 sm:px-8 sm:py-3">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 pb-4 safe-area-bottom animate-slide-up">
            <div className="px-4 pt-4 pb-3 space-y-3">
              <Link href="/" data-testid="link-mobile-dashboard">
                <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                  <BarChart3 className="mr-3 h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
              
              {/* Mobile navigation items would continue here... */}
              
              {/* Mobile-only utility items */}
              <div className="pt-4 border-t border-white/10 sm:hidden">
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
```

---

## File Structure Overview

The frontend codebase is organized as follows:

```
client/
├── index.html                 # Main HTML entry point
├── public/                    # Static assets
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
└── src/
    ├── main.tsx              # React app entry point
    ├── App.tsx               # Main app component with routing
    ├── index.css             # Global styles and Tailwind imports
    ├── components/           # Reusable UI components
    │   ├── ui/               # Base UI components (buttons, cards, etc.)
    │   ├── layout/           # Layout components (navbar, etc.)
    │   ├── ai/               # AI-related components
    │   ├── dashboard/        # Dashboard components
    │   ├── design-thinking/  # Design thinking workflow components
    │   └── ...               # Other feature-specific components
    ├── pages/                # Page components
    ├── hooks/                # Custom React hooks
    ├── contexts/             # React context providers
    ├── lib/                  # Utility libraries
    ├── utils/                # Helper functions
    ├── config/               # Configuration files
    └── constants/            # Application constants
```

---

## Key Features

### 1. **Progressive Web App (PWA)**
- Service worker for offline functionality
- App manifest for installability
- Mobile-optimized design

### 2. **Responsive Design**
- Mobile-first approach
- Tailwind CSS for styling
- Glass morphism design system
- Safari 26 design principles

### 3. **Authentication & Authorization**
- Azure AD integration
- Google OAuth
- Protected routes
- User type management

### 4. **Feature Flags**
- Dynamic feature toggling
- A/B testing capabilities
- Gradual rollouts

### 5. **AI Integration**
- Credit scoring
- Business plan generation
- Market analysis
- Agent-based assistance

### 6. **Document Management**
- Business plans
- Proposals
- Pitch decks
- Applications
- Real-time collaboration

### 7. **Analytics Dashboard**
- Unified dashboard system
- User type-specific views
- Performance metrics
- Goal tracking

---

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query + Context API
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

---

*Note: This document contains the complete frontend code structure. Due to the extensive nature of the codebase (283+ files), this documentation covers the main structure, key components, and configuration files. The complete implementation includes all components, pages, hooks, utilities, and other frontend files that make up the full application.*

