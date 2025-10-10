import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

/**
 * Centralized form mutation hook
 * Eliminates duplication of form submission, error handling, and success notifications
 */

interface FormMutationOptions<TData = any> {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  successTitle?: string;
  successDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  invalidateQueries?: string[];
  onSuccess?: (data: TData) => void;
  onError?: (error: any) => void;
  transformData?: (data: any) => any;
}

export function useFormMutation<TData = any, TVariables = any>({
  endpoint,
  method = 'POST',
  successTitle = "Success",
  successDescription = "Operation completed successfully.",
  errorTitle = "Error",
  errorDescription = "Operation failed. Please try again.",
  invalidateQueries = [],
  onSuccess,
  onError,
  transformData
}: FormMutationOptions<TData>) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: TVariables) => {
      const transformedData = transformData ? transformData(data) : data;
      
      const response = await apiRequest(endpoint, {
        method,
        body: JSON.stringify(transformedData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.json();
    },
    onSuccess: (data: TData) => {
      // Invalidate specified queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });

      // Show success toast
      toast({
        title: successTitle,
        description: successDescription,
      });

      // Call custom success handler
      onSuccess?.(data);
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });

      // Call custom error handler
      onError?.(error);
    },
  });
}

/**
 * Specialized hooks for common CRUD operations
 */

export function useCreateMutation<TData = any, TVariables = any>(
  endpoint: string,
  entityName: string,
  invalidateQueries: string[] = []
) {
  return useFormMutation<TData, TVariables>({
    endpoint,
    method: 'POST',
    successTitle: `${entityName} created`,
    successDescription: `The ${entityName.toLowerCase()} has been created successfully.`,
    errorTitle: "Error",
    errorDescription: `Failed to create ${entityName.toLowerCase()}. Please try again.`,
    invalidateQueries
  });
}

export function useUpdateMutation<TData = any, TVariables = any>(
  endpoint: string,
  entityName: string,
  invalidateQueries: string[] = []
) {
  return useFormMutation<TData, TVariables>({
    endpoint,
    method: 'PUT',
    successTitle: `${entityName} updated`,
    successDescription: `The ${entityName.toLowerCase()} has been updated successfully.`,
    errorTitle: "Error",
    errorDescription: `Failed to update ${entityName.toLowerCase()}. Please try again.`,
    invalidateQueries
  });
}

export function useDeleteMutation<TData = any>(
  endpoint: string,
  entityName: string,
  invalidateQueries: string[] = []
) {
  return useFormMutation<TData, { id: string | number }>({
    endpoint,
    method: 'DELETE',
    successTitle: `${entityName} deleted`,
    successDescription: `The ${entityName.toLowerCase()} has been deleted successfully.`,
    errorTitle: "Error",
    errorDescription: `Failed to delete ${entityName.toLowerCase()}. Please try again.`,
    invalidateQueries
  });
}
