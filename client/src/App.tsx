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
  // Very simple test to isolate the issue
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '1rem' }}>
        🚀 StartupsAI Dashboard
      </h1>
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#666', marginBottom: '1rem' }}>Application Status</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '8px 0', color: 'green' }}>✅ Server is running on port 3000</li>
          <li style={{ margin: '8px 0', color: 'green' }}>✅ React app is loading</li>
          <li style={{ margin: '8px 0', color: 'green' }}>✅ Vite HMR is working</li>
          <li style={{ margin: '8px 0', color: 'orange' }}>⚠️ Authentication is disabled in development</li>
        </ul>
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>Available Routes:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '5px 0' }}>
              <a href="/test" style={{ color: '#0066cc', textDecoration: 'none' }}>/test - Test page</a>
            </li>
            <li style={{ margin: '5px 0' }}>
              <a href="/login" style={{ color: '#0066cc', textDecoration: 'none' }}>/login - Login page</a>
            </li>
            <li style={{ margin: '5px 0' }}>
              <a href="/education" style={{ color: '#0066cc', textDecoration: 'none' }}>/education - Education hub</a>
            </li>
            <li style={{ margin: '5px 0' }}>
              <a href="/ecosystem" style={{ color: '#0066cc', textDecoration: 'none' }}>/ecosystem - Ecosystem hub</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;