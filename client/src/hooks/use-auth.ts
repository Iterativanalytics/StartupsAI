
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  userType?: string;
}

async function fetchUser(): Promise<User | null> {
  try {
    const response = await fetch("/api/user");
    
    if (response.status === 401) {
      if (import.meta.env.DEV) {
        return {
          id: 'dev-user-123',
          email: 'dev@example.com',
          firstName: 'Dev',
          lastName: 'User',
          profileImageUrl: undefined,
          userType: 'ENTREPRENEUR'
        };
      }
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Auth error in development mode, using mock user:', error);
      return {
        id: 'dev-user-123',
        email: 'dev@example.com',
        firstName: 'Dev',
        lastName: 'User',
        profileImageUrl: undefined,
        userType: 'ENTREPRENEUR'
      };
    }
    console.error('Failed to fetch user:', error);
    return null;
  }
}

async function logout(): Promise<void> {
  window.location.href = "/api/logout";
}

export function useAuth() {
  const queryClient = useQueryClient();
  
  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const login = () => {
    window.location.href = "/api/login";
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout: logoutMutation.mutate,
    error
  };
}
