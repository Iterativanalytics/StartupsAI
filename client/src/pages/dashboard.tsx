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