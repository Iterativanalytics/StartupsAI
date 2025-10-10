import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

interface UserSettings {
  // Account Settings
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  timezone: string;
  language: string;
  
  // Privacy Settings
  profileVisibility: 'public' | 'private' | 'organization';
  dataSharing: boolean;
  analyticsOptIn: boolean;
  marketingEmails: boolean;
  
  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notificationFrequency: 'immediate' | 'daily' | 'weekly';
  
  // AI Agent Settings
  aiPersonality: 'professional' | 'casual' | 'technical' | 'creative';
  aiResponseLength: 'brief' | 'detailed' | 'comprehensive';
  aiProactiveInsights: boolean;
  aiDataRetention: number; // days
  
  // Organization Settings
  defaultOrganization: string;
  organizationNotifications: boolean;
  teamCollaboration: boolean;
  
  // Appearance Settings
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  
  // Security Settings
  twoFactorAuth: boolean;
  sessionTimeout: number; // minutes
  loginNotifications: boolean;
  deviceTrust: boolean;
}

async function fetchSettings(): Promise<UserSettings> {
  const response = await fetch("/api/settings");
  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }
  return await response.json();
}

async function updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  const response = await fetch("/api/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update settings");
  }

  return await response.json();
}

async function resetSettings(): Promise<void> {
  const response = await fetch("/api/settings/reset", {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to reset settings");
  }
}

async function exportSettings(): Promise<Blob> {
  const response = await fetch("/api/settings/export");
  if (!response.ok) {
    throw new Error("Failed to export settings");
  }
  return await response.blob();
}

export function useSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Settings data
  const {
    data: settings,
    isLoading,
    error
  } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(["settings"], data);
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Reset settings mutation
  const resetSettingsMutation = useMutation({
    mutationFn: resetSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Settings reset",
        description: "Your settings have been reset to default values.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Export settings mutation
  const exportSettingsMutation = useMutation({
    mutationFn: exportSettings,
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Settings exported",
        description: "Your settings have been exported successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to export settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    settings,
    
    // Loading states
    isLoading,
    
    // Error states
    error,
    
    // Mutations
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
    
    resetSettings: resetSettingsMutation.mutate,
    isResetting: resetSettingsMutation.isPending,
    
    exportSettings: exportSettingsMutation.mutate,
    isExporting: exportSettingsMutation.isPending,
  };
}
