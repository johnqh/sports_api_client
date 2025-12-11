/**
 * @module hooks/use-hockey-leagues
 * @description React hook for leagues endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHockeyClient, useApiHockeyStore } from "./hockey-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiHockeyKeys, type UseApiHockeyQueryOptions } from "./hockey-types";
import type { HockeyLeagueResponse, HockeyLeaguesParams } from "../types";

/**
 * Hook to fetch leagues
 *
 * @param options - Query options including optional filter params
 * @returns Query result with league data
 */
export function useHockeyLeagues(
  options?: UseApiHockeyQueryOptions<HockeyLeagueResponse, HockeyLeaguesParams>,
) {
  const client = useApiHockeyClient();
  const { getLeagues, setLeagues, cacheTTL } = useApiHockeyStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "leagues",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiHockeyKeys.leagues.list(params),
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
