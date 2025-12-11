/**
 * @module hooks/use-basketball-teams
 * @description React hooks for teams endpoints
 */

import { useQuery } from "@tanstack/react-query";
import {
  useApiBasketballClient,
  useApiBasketballStore,
} from "./basketball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiBasketballKeys,
  type UseApiBasketballQueryOptions,
  type UseApiBasketballQueryOptionsRequired,
} from "./basketball-types";
import type {
  BasketballTeamResponse,
  BasketballTeamsParams,
  BasketballTeamStatistics,
  BasketballTeamStatisticsParams,
} from "../types";

/**
 * Hook to fetch teams
 *
 * @param options - Query options including optional filter params
 * @returns Query result with team data
 *
 * @example
 * ```typescript
 * // Get teams by league and season
 * function NBATeams() {
 *   const { data, isLoading } = useBasketballTeams({
 *     params: { league: 12, season: "2023-2024" },
 *   });
 *   // ...
 * }
 *
 * // Get specific team
 * function Lakers() {
 *   const { data } = useBasketballTeams({ params: { id: 1 } });
 *   const team = data?.response[0];
 *   // ...
 * }
 * ```
 */
export function useBasketballTeams(
  options?: UseApiBasketballQueryOptions<
    BasketballTeamResponse,
    BasketballTeamsParams
  >,
) {
  const client = useApiBasketballClient();
  const { getTeams, setTeams, cacheTTL } = useApiBasketballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "teams",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBasketballKeys.teams.list(params),
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
 *
 * @example
 * ```typescript
 * function TeamStats({ teamId, leagueId, season }: Props) {
 *   const { data, isLoading } = useBasketballTeamStatistics({
 *     params: { team: teamId, league: leagueId, season },
 *   });
 *   // ...
 * }
 * ```
 */
export function useBasketballTeamStatistics(
  options: UseApiBasketballQueryOptionsRequired<
    BasketballTeamStatistics,
    BasketballTeamStatisticsParams
  >,
) {
  const client = useApiBasketballClient();
  const { getTeamStatistics, setTeamStatistics, cacheTTL } =
    useApiBasketballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "team-statistics",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBasketballKeys.teams.statistics(params),
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
          get: "statistics",
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
