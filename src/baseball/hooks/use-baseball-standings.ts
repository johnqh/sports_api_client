/**
 * @module hooks/use-baseball-standings
 * @description React hook for standings endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiBaseballClient, useApiBaseballStore } from "./baseball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiBaseballKeys,
  type UseApiBaseballQueryOptionsRequired,
} from "./baseball-types";
import type { BaseballStanding, BaseballStandingsParams } from "../types";

/**
 * Hook to fetch standings
 *
 * @param options - Query options with required params (league, season)
 * @returns Query result with standings data
 */
export function useBaseballStandings(
  options: UseApiBaseballQueryOptionsRequired<
    BaseballStanding,
    BaseballStandingsParams
  >,
) {
  const client = useApiBaseballClient();
  const { getStandings, setStandings, cacheTTL } = useApiBaseballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "standings",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBaseballKeys.standings.list(params),
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
