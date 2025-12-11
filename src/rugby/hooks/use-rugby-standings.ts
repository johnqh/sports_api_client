/**
 * @module hooks/use-rugby-standings
 * @description React hook for standings endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiRugbyClient, useApiRugbyStore } from "./rugby-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiRugbyKeys,
  type UseApiRugbyQueryOptionsRequired,
} from "./rugby-types";
import type { RugbyStanding, RugbyStandingsParams } from "../types";

/**
 * Hook to fetch standings
 *
 * @param options - Query options with required params (league, season)
 * @returns Query result with standings data
 */
export function useRugbyStandings(
  options: UseApiRugbyQueryOptionsRequired<RugbyStanding, RugbyStandingsParams>,
) {
  const client = useApiRugbyClient();
  const { getStandings, setStandings, cacheTTL } = useApiRugbyStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "standings",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiRugbyKeys.standings.list(params),
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
