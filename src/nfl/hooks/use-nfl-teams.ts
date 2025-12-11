/**
 * @module hooks/use-nfl-teams
 * @description React hooks for teams endpoints
 */

import { useQuery } from "@tanstack/react-query";
import { useApiNflClient, useApiNflStore } from "./nfl-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiNflKeys,
  type UseApiNflQueryOptions,
  type UseApiNflQueryOptionsRequired,
} from "./nfl-types";
import type {
  NflTeamResponse,
  NflTeamsParams,
  NflTeamStatistics,
  NflTeamStatisticsParams,
} from "../types";

/**
 * Hook to fetch teams
 *
 * @param options - Query options including optional filter params
 * @returns Query result with team data
 */
export function useNflTeams(
  options?: UseApiNflQueryOptions<NflTeamResponse, NflTeamsParams>,
) {
  const client = useApiNflClient();
  const { getTeams, setTeams, cacheTTL } = useApiNflStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "teams",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiNflKeys.teams.list(params),
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
 * Requires team, league, and season parameters.
 *
 * @param options - Query options with required params
 * @returns Query result with team statistics data
 */
export function useNflTeamStatistics(
  options: UseApiNflQueryOptionsRequired<
    NflTeamStatistics,
    NflTeamStatisticsParams
  >,
) {
  const client = useApiNflClient();
  const { getTeamStatistics, setTeamStatistics, cacheTTL } = useApiNflStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "team-statistics",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiNflKeys.teams.statistics(params),
    queryFn: async () => {
      const response = await client.getTeamStatistics(params);
      const stats = response.response[0];
      if (stats) {
        setTeamStatistics(cacheKey, stats);
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
