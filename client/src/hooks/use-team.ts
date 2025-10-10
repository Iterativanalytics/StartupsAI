import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer' | 'owner';
  avatar?: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  lastActive?: string;
  department?: string;
  skills?: string[];
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface TeamInvitation {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  message?: string;
}

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvites: number;
  departments: { [key: string]: number };
  roles: { [key: string]: number };
}

interface InviteData {
  email: string;
  role: 'admin' | 'member' | 'viewer';
  message?: string;
}

interface UpdateMemberData {
  role?: 'admin' | 'member' | 'viewer';
  department?: string;
  status?: 'active' | 'pending' | 'inactive';
}

async function fetchTeamMembers(): Promise<TeamMember[]> {
  const response = await fetch("/api/team/members");
  if (!response.ok) {
    throw new Error("Failed to fetch team members");
  }
  return await response.json();
}

async function fetchTeamInvitations(): Promise<TeamInvitation[]> {
  const response = await fetch("/api/team/invitations");
  if (!response.ok) {
    throw new Error("Failed to fetch team invitations");
  }
  return await response.json();
}

async function inviteTeamMember(data: InviteData): Promise<TeamInvitation> {
  const response = await fetch("/api/team/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to invite team member");
  }

  return await response.json();
}

async function updateTeamMember(memberId: string, data: UpdateMemberData): Promise<TeamMember> {
  const response = await fetch(`/api/team/members/${memberId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update team member");
  }

  return await response.json();
}

async function removeTeamMember(memberId: string): Promise<void> {
  const response = await fetch(`/api/team/members/${memberId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to remove team member");
  }
}

async function resendInvitation(invitationId: string): Promise<void> {
  const response = await fetch(`/api/team/invitations/${invitationId}/resend`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to resend invitation");
  }
}

async function cancelInvitation(invitationId: string): Promise<void> {
  const response = await fetch(`/api/team/invitations/${invitationId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to cancel invitation");
  }
}

export function useTeam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Team members
  const {
    data: members,
    isLoading: isLoadingMembers,
    error: membersError
  } = useQuery({
    queryKey: ["team-members"],
    queryFn: fetchTeamMembers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Team invitations
  const {
    data: invitations,
    isLoading: isLoadingInvitations,
    error: invitationsError
  } = useQuery({
    queryKey: ["team-invitations"],
    queryFn: fetchTeamInvitations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    mutationFn: inviteTeamMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${data.email}`,
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

  // Update member mutation
  const updateMemberMutation = useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: UpdateMemberData }) =>
      updateTeamMember(memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({
        title: "Member updated",
        description: "Team member has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: removeTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast({
        title: "Member removed",
        description: "Team member has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Resend invitation mutation
  const resendInvitationMutation = useMutation({
    mutationFn: resendInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
      toast({
        title: "Invitation resent",
        description: "Invitation has been resent successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resend invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Cancel invitation mutation
  const cancelInvitationMutation = useMutation({
    mutationFn: cancelInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
      toast({
        title: "Invitation cancelled",
        description: "Invitation has been cancelled successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate team stats
  const stats: TeamStats | undefined = members ? {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    pendingInvites: invitations?.filter(i => i.status === 'pending').length || 0,
    departments: members.reduce((acc, member) => {
      if (member.department) {
        acc[member.department] = (acc[member.department] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number }),
    roles: members.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  } : undefined;

  return {
    // Data
    members,
    invitations,
    stats,
    
    // Loading states
    isLoadingMembers,
    isLoadingInvitations,
    isLoading: isLoadingMembers || isLoadingInvitations,
    
    // Error states
    membersError,
    invitationsError,
    
    // Mutations
    inviteMember: inviteMemberMutation.mutate,
    isInviting: inviteMemberMutation.isPending,
    
    updateMember: updateMemberMutation.mutate,
    isUpdating: updateMemberMutation.isPending,
    
    removeMember: removeMemberMutation.mutate,
    isRemoving: removeMemberMutation.isPending,
    
    resendInvitation: resendInvitationMutation.mutate,
    isResending: resendInvitationMutation.isPending,
    
    cancelInvitation: cancelInvitationMutation.mutate,
    isCancelling: cancelInvitationMutation.isPending,
  };
}
