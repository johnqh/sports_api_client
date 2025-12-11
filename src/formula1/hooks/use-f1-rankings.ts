/**
 * @module hooks/use-f1-rankings
 * @description React hooks for rankings endpoints
 */

import { useQuery } from "@tanstack/react-query";
import { useApiF1Client, useApiF1Store } from "./f1-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiF1Keys, type UseApiF1QueryOptionsRequired } from "./f1-types";
import type {
  F1DriverRanking,
  F1DriverRankingsParams,
  F1TeamRanking,
  F1TeamRankingsParams,
} from "../types";

/**
 * Hook to fetch driver rankings
 *
 * @param options - Query options with required params (season)
 * @returns Query result with driver rankings data
 */
export function useF1DriverRankings(
  options: UseApiF1QueryOptionsRequired<
    F1DriverRanking,
    F1DriverRankingsParams
  >,
) {
  const client = useApiF1Client();
  const { getDriverRankings, setDriverRankings, cacheTTL } = useApiF1Store();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "driver-rankings",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiF1Keys.rankings.drivers(params),
    queryFn: async () => {
      const response = await client.getDriverRankings(params);
      setDriverRankings(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getDriverRankings(cacheKey);
      if (cached) {
        return {
          get: "rankings/drivers",
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

/**
 * Hook to fetch team (constructor) rankings
 *
 * @param options - Query options with required params (season)
 * @returns Query result with team rankings data
 */
export function useF1TeamRankings(
  options: UseApiF1QueryOptionsRequired<F1TeamRanking, F1TeamRankingsParams>,
) {
  const client = useApiF1Client();
  const { getTeamRankings, setTeamRankings, cacheTTL } = useApiF1Store();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "team-rankings",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiF1Keys.rankings.teams(params),
    queryFn: async () => {
      const response = await client.getTeamRankings(params);
      setTeamRankings(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getTeamRankings(cacheKey);
      if (cached) {
        return {
          get: "rankings/teams",
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
