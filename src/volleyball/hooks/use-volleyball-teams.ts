/**
 * @module hooks/use-volleyball-teams
 * @description React hook for teams endpoint
 */

import { useQuery } from "@tanstack/react-query";
import {
  useApiVolleyballClient,
  useApiVolleyballStore,
} from "./volleyball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiVolleyballKeys,
  type UseApiVolleyballQueryOptions,
} from "./volleyball-types";
import type { VolleyballTeamResponse, VolleyballTeamsParams } from "../types";

/**
 * Hook to fetch teams
 */
export function useVolleyballTeams(
  options?: UseApiVolleyballQueryOptions<
    VolleyballTeamResponse,
    VolleyballTeamsParams
  >,
) {
  const client = useApiVolleyballClient();
  const { getTeams, setTeams, cacheTTL } = useApiVolleyballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "teams",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiVolleyballKeys.teams.list(params),
    queryFn: async () => {
      const response = await client.getTeams(params);
      setTeams(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getTeams(cacheKey);
      if (cached) {
        return {
          get: "teams",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: cached.length,
          response: cached,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...options,
  });
}
