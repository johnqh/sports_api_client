/**
 * @module hooks/use-rugby-leagues
 * @description React hook for leagues endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiRugbyClient, useApiRugbyStore } from "./rugby-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiRugbyKeys, type UseApiRugbyQueryOptions } from "./rugby-types";
import type { RugbyLeagueResponse, RugbyLeaguesParams } from "../types";

/**
 * Hook to fetch leagues
 *
 * @param options - Query options including optional params
 * @returns Query result with league data
 */
export function useRugbyLeagues(
  options?: UseApiRugbyQueryOptions<RugbyLeagueResponse, RugbyLeaguesParams>,
) {
  const client = useApiRugbyClient();
  const { getLeagues, setLeagues, cacheTTL } = useApiRugbyStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "leagues",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiRugbyKeys.leagues.list(params),
    queryFn: async () => {
      const response = await client.getLeagues(params);
      setLeagues(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getLeagues(cacheKey);
      if (cached) {
        return {
          get: "leagues",
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
