import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetWorkspace, 
  useCreateWorkspace,
  getGetWorkspaceQueryKey
} from "@workspace/api-client-react";

// Re-export the generated hooks, adding cache invalidation on mutations
export function useWorkspaceConfig() {
  return useGetWorkspace({
    query: {
      retry: false, // Don't retry if 404
      refetchOnWindowFocus: false,
    }
  });
}

export function useSaveWorkspace() {
  const queryClient = useQueryClient();
  
  return useCreateWorkspace({
    mutation: {
      onSuccess: () => {
        // Invalidate workspace query to trigger UI update
        queryClient.invalidateQueries({ queryKey: getGetWorkspaceQueryKey() });
      },
    }
  });
}
