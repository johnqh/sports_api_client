/**
 * @module hooks/use-nfl-standings
 * @description React hook for standings endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiNflClient, useApiNflStore } from "./nfl-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiNflKeys, type UseApiNflQueryOptionsRequired } from "./nfl-types";
import type { NflStanding, NflStandingsParams } from "../types";

/**
 * Hook to fetch league standings
 *
 * Requires league and season parameters.
 *
 * @param options - Query options with required params
 * @returns Query result with standings data
 */
export function useNflStandings(
  options: UseApiNflQueryOptionsRequired<NflStanding, NflStandingsParams>,
) {
  const client = useApiNflClient();
  const { getStandings, setStandings, cacheTTL } = useApiNflStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "standings",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiNflKeys.standings.list(params),
    queryFn: async () => {
      const response = await client.getStandings(params);
      setStandings(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getStandings(cacheKey);
      if (cached) {
        return {
          get: "standings",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: cached.length,
          response: cached,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...queryOptions,
  });
}
