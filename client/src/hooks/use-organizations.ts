import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { UserType } from "../../../shared/schema";

interface Organization {
  id: string;
  name: string;
  description?: string;
  organizationType: UserType;
  ownerId: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  revenue?: number;
  fundingStage?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  department?: string;
}

interface OrganizationStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalMembers: number;
  industries: { [key: string]: number };
  organizationTypes: { [key: string]: number };
  totalRevenue: number;
  averageRevenue: number;
}

interface CreateOrganizationData {
  name: string;
  description?: string;
  organizationType: UserType;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface UpdateOrganizationData {
  name?: string;
  description?: string;
  organizationType?: UserType;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface InviteMemberData {
  email: string;
  role: 'admin' | 'member' | 'viewer';
  message?: string;
}

async function fetchOrganizations(): Promise<Organization[]> {
  const response = await fetch("/api/organizations");
  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }
  return await response.json();
}

async function fetchOrganization(orgId: string): Promise<Organization> {
  const response = await fetch(`/api/organizations/${orgId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch organization");
  }
  return await response.json();
}

async function fetchOrganizationMembers(orgId: string): Promise<OrganizationMember[]> {
  const response = await fetch(`/api/organizations/${orgId}/members`);
  if (!response.ok) {
    throw new Error("Failed to fetch organization members");
  }
  return await response.json();
}

async function fetchOrganizationAnalytics(orgId: string): Promise<any> {
  const response = await fetch(`/api/organizations/${orgId}/analytics`);
  if (!response.ok) {
    throw new Error("Failed to fetch organization analytics");
  }
  return await response.json();
}

async function createOrganization(data: CreateOrganizationData): Promise<Organization> {
  const response = await fetch("/api/organizations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create organization");
  }

  return await response.json();
}

async function updateOrganization(orgId: string, data: UpdateOrganizationData): Promise<Organization> {
  const response = await fetch(`/api/organizations/${orgId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update organization");
  }

  return await response.json();
}

async function deleteOrganization(orgId: string): Promise<void> {
  const response = await fetch(`/api/organizations/${orgId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete organization");
  }
}

async function inviteMember(orgId: string, data: InviteMemberData): Promise<any> {
  const response = await fetch(`/api/organizations/${orgId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to invite member");
  }

  return await response.json();
}

export function useOrganizations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Organizations list
  const {
    data: organizations,
    isLoading: isLoadingOrganizations,
    error: organizationsError
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create organization mutation
  const createOrganizationMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast({
        title: "Organization created",
        description: `${data.name} has been created successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create organization. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update organization mutation
  const updateOrganizationMutation = useMutation({
    mutationFn: ({ orgId, data }: { orgId: string; data: UpdateOrganizationData }) =>
      updateOrganization(orgId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization", data.id] });
      toast({
        title: "Organization updated",
        description: `${data.name} has been updated successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update organization. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete organization mutation
  const deleteOrganizationMutation = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast({
        title: "Organization deleted",
        description: "Organization has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete organization. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    mutationFn: ({ orgId, data }: { orgId: string; data: InviteMemberData }) =>
      inviteMember(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-members"] });
      toast({
        title: "Invitation sent",
        description: "Member invitation has been sent successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate stats
  const stats: OrganizationStats | undefined = organizations ? {
    totalOrganizations: organizations.length,
    activeOrganizations: organizations.filter(org => org.verified).length,
    totalMembers: organizations.reduce((sum, org) => sum + (org.memberCount || 0), 0),
    industries: organizations.reduce((acc, org) => {
      if (org.industry) {
        acc[org.industry] = (acc[org.industry] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number }),
    organizationTypes: organizations.reduce((acc, org) => {
      acc[org.organizationType] = (acc[org.organizationType] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number }),
    totalRevenue: organizations.reduce((sum, org) => sum + (org.revenue || 0), 0),
    averageRevenue: organizations.length > 0 
      ? organizations.reduce((sum, org) => sum + (org.revenue || 0), 0) / organizations.length 
      : 0
  } : undefined;

  return {
    // Data
    organizations,
    stats,
    
    // Loading states
    isLoadingOrganizations,
    isLoading: isLoadingOrganizations,
    
    // Error states
    organizationsError,
    
    // Mutations
    createOrganization: createOrganizationMutation.mutate,
    isCreating: createOrganizationMutation.isPending,
    
    updateOrganization: updateOrganizationMutation.mutate,
    isUpdating: updateOrganizationMutation.isPending,
    
    deleteOrganization: deleteOrganizationMutation.mutate,
    isDeleting: deleteOrganizationMutation.isPending,
    
    inviteMember: inviteMemberMutation.mutate,
    isInviting: inviteMemberMutation.isPending,
  };
}

export function useOrganization(orgId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Organization details
  const {
    data: organization,
    isLoading: isLoadingOrganization,
    error: organizationError
  } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => fetchOrganization(orgId),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Organization members
  const {
    data: members,
    isLoading: isLoadingMembers,
    error: membersError
  } = useQuery({
    queryKey: ["organization-members", orgId],
    queryFn: () => fetchOrganizationMembers(orgId),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Organization analytics
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    error: analyticsError
  } = useQuery({
    queryKey: ["organization-analytics", orgId],
    queryFn: () => fetchOrganizationAnalytics(orgId),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    // Data
    organization,
    members,
    analytics,
    
    // Loading states
    isLoadingOrganization,
    isLoadingMembers,
    isLoadingAnalytics,
    isLoading: isLoadingOrganization || isLoadingMembers || isLoadingAnalytics,
    
    // Error states
    organizationError,
    membersError,
    analyticsError,
  };
}
