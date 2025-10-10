import { useAuth } from "@/hooks/use-auth";
import { UserType } from "@shared/schema";
import { UnifiedDashboard } from "@/components/dashboard";
import UserTypeSelector from "../components/onboarding/UserTypeSelector";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  if (isLoading) {
    return <PageLoadingSpinner text="Loading your personalized dashboard..." />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen">
        <UserTypeSelector onUserTypeSelect={(type, subtype) => {
          setSelectedUserType(type);
          // Here you would typically save the user type to the backend
          console.log('Selected user type:', type, 'subtype:', subtype);
        }} />
      </div>
    );
  }

  // Use the user's stored type or the selected type
  const userType = (user.userType as UserType) || selectedUserType;

  // If user doesn't have a type set and hasn't selected one, show selector
  if (!userType) {
    return (
      <div className="min-h-screen">
        <UserTypeSelector onUserTypeSelect={(type, subtype) => {
          setSelectedUserType(type);
          // Save to backend
          console.log('Selected user type:', type, 'subtype:', subtype);
        }} />
      </div>
    );
  }

  // Use the unified dashboard system
  return <UnifiedDashboard userType={userType} />;
}