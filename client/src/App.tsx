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
import IterativDeck from "@/pages/iterativ-deck";
import Valuation from "@/pages/valuation";
import AICreditScoring from "@/pages/ai-credit-scoring";
import NotFound from "@/pages/not-found";
import EcosystemHub from "@/pages/ecosystem-hub";
import DocumentsHub from "@/pages/documents-hub";
import VentureStudio from "@/pages/venture-studio";
import Accelerator from "./pages/accelerator";
import Incubator from "@/pages/incubator";
import IterativProposals from "@/pages/iterativ-proposals";
import IterativForms from "@/pages/iterativ-forms";
import PlansApp from "@/modules/plans/PlansApp";
import DecksApp from "@/modules/decks/DecksApp";
import ProposalsApp from "@/modules/proposals/ProposalsApp";
import FormsApp from "@/modules/forms/FormsApp";
import Login from "@/pages/login"; // Assuming Login component is created

// Wrapper component for PlansApp with default props
const PlansAppWrapper = () => {
  const addToast = (message: string, type: any) => {
    console.log(`Toast: ${message} (${type})`);
  };
  
  const user = { loggedIn: false, persona: null, name: 'Guest' };
  const agentPersonality = null;
  const vestedInterest = 0;

  return (
    <PlansApp 
      addToast={addToast}
      user={user}
      agentPersonality={agentPersonality}
      vestedInterest={vestedInterest}
    />
  );
};

// Wrapper component for DecksApp with default props
const DecksAppWrapper = () => {
  const showToast = (message: string, type: any) => {
    console.log(`Toast: ${message} (${type})`);
  };
  
  const user = { loggedIn: false, persona: null, name: 'Guest' };

  return (
    <DecksApp 
      showToast={showToast}
      user={user}
    />
  );
};

// Wrapper component for ProposalsApp with default props
const ProposalsAppWrapper = () => {
  const addToast = (message: string, type: any) => {
    console.log(`Toast: ${message} (${type})`);
  };
  
  const user = { loggedIn: false, persona: null, name: 'Guest' };

  return (
    <ProposalsApp 
      addToast={addToast}
      user={user}
    />
  );
};

// Wrapper component for FormsApp with default props
const FormsAppWrapper = () => {
  const addToast = (message: string, type: any) => {
    console.log(`Toast: ${message} (${type})`);
  };
  
  const user = { loggedIn: false, persona: null, name: 'Guest' };

  return (
    <FormsApp 
      addToast={addToast}
      user={user}
    />
  );
};
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
                <Route path="/business-plans" component={() => <ProtectedRoute><PlansAppWrapper /></ProtectedRoute>} />
                <Route path="/upload" component={() => <ProtectedRoute><Upload /></ProtectedRoute>} />
                <Route path="/proposals" component={() => <ProtectedRoute><ProposalsAppWrapper /></ProtectedRoute>} />
                <Route path="/decks" component={() => <ProtectedRoute><DecksAppWrapper /></ProtectedRoute>} />
                <Route path="/forms" component={() => <ProtectedRoute><FormsAppWrapper /></ProtectedRoute>} />
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
                <Route path="/pitch-deck" component={() => <ProtectedRoute><IterativDeck /></ProtectedRoute>} />
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