/**
 * @module hooks/use-rugby-teams
 * @description React hooks for teams endpoints
 */

import { useQuery } from "@tanstack/react-query";
import { useApiRugbyClient, useApiRugbyStore } from "./rugby-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiRugbyKeys,
  type UseApiRugbyQueryOptions,
  type UseApiRugbyQueryOptionsRequired,
} from "./rugby-types";
import type {
  RugbyTeamResponse,
  RugbyTeamsParams,
  RugbyTeamStatistics,
  RugbyTeamStatisticsParams,
} from "../types";

/**
 * Hook to fetch teams
 *
 * @param options - Query options including optional params
 * @returns Query result with team data
 */
export function useRugbyTeams(
  options?: UseApiRugbyQueryOptions<RugbyTeamResponse, RugbyTeamsParams>,
) {
  const client = useApiRugbyClient();
  const { getTeams, setTeams, cacheTTL } = useApiRugbyStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "teams",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiRugbyKeys.teams.list(params),
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

/**
 * Hook to fetch team statistics
 *
 * @param options - Query options with required params (league, season, team)
 * @returns Query result with team statistics data
 */
export function useRugbyTeamStatistics(
  options: UseApiRugbyQueryOptionsRequired<
    RugbyTeamStatistics,
    RugbyTeamStatisticsParams
  >,
) {
  const client = useApiRugbyClient();
  const { getTeamStatistics, setTeamStatistics, cacheTTL } = useApiRugbyStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "team-stats",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiRugbyKeys.teams.statistics(params),
    queryFn: async () => {
      const response = await client.getTeamStatistics(params);
      if (response.response[0]) {
        setTeamStatistics(cacheKey, response.response[0]);
      }
      return response;
    },
    initialData: () => {
      const cached = getTeamStatistics(cacheKey);
      if (cached) {
        return {
          get: "teams/statistics",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: 1,
          response: [cached],
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...queryOptions,
  });
}
