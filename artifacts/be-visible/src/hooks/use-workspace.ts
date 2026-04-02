import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useGetWorkspace,
  useCreateWorkspace,
  getGetWorkspaceQueryKey,
  getGetWorkspaceQueryOptions,
} from "@workspace/api-client-react";
import { useSearch } from "wouter";

/**
 * Fetch workspace config. If `workspaceId` is in the URL search params,
 * fetch that specific workspace via GET /api/workspace/:id.
 * Otherwise fall back to the default paid workspace (GET /api/workspace).
 */
export function useWorkspaceConfig() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const workspaceId = params.get("workspaceId");

  // When a specific workspaceId is requested, use a manual query
  const manualQuery = useQuery({
    queryKey: [`/api/workspace/${workspaceId}`],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/workspace/${workspaceId}`, { signal });
      if (!res.ok) throw new Error("Workspace not found");
      return res.json();
    },
    enabled: !!workspaceId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // When no workspaceId, use the generated hook for the default paid workspace
  const defaultQueryOptions = getGetWorkspaceQueryOptions();
  const defaultQuery = useGetWorkspace({
    query: {
      queryKey: defaultQueryOptions.queryKey,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !workspaceId,
    },
  });

  return workspaceId ? manualQuery : defaultQuery;
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
