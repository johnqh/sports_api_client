/**
 * @module hooks/use-hockey-standings
 * @description React hook for standings endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHockeyClient, useApiHockeyStore } from "./hockey-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiHockeyKeys,
  type UseApiHockeyQueryOptionsRequired,
} from "./hockey-types";
import type { HockeyStanding, HockeyStandingsParams } from "../types";

/**
 * Hook to fetch league standings
 *
 * Requires league and season parameters.
 *
 * @param options - Query options with required params
 * @returns Query result with standings data
 */
export function useHockeyStandings(
  options: UseApiHockeyQueryOptionsRequired<
    HockeyStanding,
    HockeyStandingsParams
  >,
) {
  const client = useApiHockeyClient();
  const { getStandings, setStandings, cacheTTL } = useApiHockeyStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "standings",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiHockeyKeys.standings.list(params),
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
