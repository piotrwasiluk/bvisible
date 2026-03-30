import { useQueryClient } from "@tanstack/react-query";
import {
  useGetWorkspace,
  useCreateWorkspace,
  getGetWorkspaceQueryKey,
  getGetWorkspaceQueryOptions,
} from "@workspace/api-client-react";

export function useWorkspaceConfig() {
  const queryOptions = getGetWorkspaceQueryOptions();
  return useGetWorkspace({
    query: {
      queryKey: queryOptions.queryKey,
      retry: false,
      refetchOnWindowFocus: false,
    },
  });
}

export function useSaveWorkspace() {
  const queryClient = useQueryClient();

  return useCreateWorkspace({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetWorkspaceQueryKey() });
      },
    },
  });
}
