/**
 * @module hooks/use-f1-teams
 * @description React hook for teams endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiF1Client, useApiF1Store } from "./f1-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiF1Keys, type UseApiF1QueryOptions } from "./f1-types";
import type { F1Team, F1TeamsParams } from "../types";

/**
 * Hook to fetch teams (constructors)
 *
 * @param options - Query options including optional params
 * @returns Query result with team data
 */
export function useF1Teams(
  options?: UseApiF1QueryOptions<F1Team, F1TeamsParams>,
) {
  const client = useApiF1Client();
  const { getTeams, setTeams, cacheTTL } = useApiF1Store();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "teams",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiF1Keys.teams.list(params),
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
