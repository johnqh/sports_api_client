/**
 * @module hooks/use-football-leagues
 * @description React hooks for leagues endpoints
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient, useApiFootballStore } from "./context";
import { generateCacheKey } from "../store/cache-utils";
import { apiFootballKeys, type UseApiFootballQueryOptions } from "./types";
import type { FootballLeagueResponse, FootballLeaguesParams } from "../types";

/**
 * Hook to fetch leagues
 *
 * Fetches leagues with optional filtering and caches results in Zustand.
 *
 * @param options - Query options including optional filter params
 * @returns Query result with league data
 *
 * @example
 * ```typescript
 * // Get all leagues
 * function AllLeagues() {
 *   const { data, isLoading } = useLeagues();
 *   // ...
 * }
 *
 * // Get leagues by country
 * function EnglishLeagues() {
 *   const { data } = useLeagues({ params: { country: "England" } });
 *   // ...
 * }
 *
 * // Get specific league
 * function PremierLeague() {
 *   const { data } = useLeagues({ params: { id: 39 } });
 *   const league = data?.response[0];
 *   // ...
 * }
 * ```
 */
export function useFootballLeagues(
  options?: UseApiFootballQueryOptions<
    FootballLeagueResponse,
    FootballLeaguesParams
  >,
) {
  const client = useApiFootballClient();
  const { getLeagues, setLeagues, cacheTTL } = useApiFootballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "leagues",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.leagues.list(params),
    queryFn: async () => {
      const response = await client.getLeagues(params);
      // Cache in Zustand
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
          paging: { current: 1, total: 1 },
          response: cached,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...options,
  });
}
