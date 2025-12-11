/**
 * @module hooks/use-nfl-leagues
 * @description React hook for leagues endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiNflClient, useApiNflStore } from "./nfl-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiNflKeys, type UseApiNflQueryOptions } from "./nfl-types";
import type { NflLeagueResponse, NflLeaguesParams } from "../types";

/**
 * Hook to fetch leagues
 *
 * @param options - Query options including optional filter params
 * @returns Query result with league data
 */
export function useNflLeagues(
  options?: UseApiNflQueryOptions<NflLeagueResponse, NflLeaguesParams>,
) {
  const client = useApiNflClient();
  const { getLeagues, setLeagues, cacheTTL } = useApiNflStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "leagues",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiNflKeys.leagues.list(params),
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
