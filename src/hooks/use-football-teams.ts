/**
 * @module hooks/use-football-teams
 * @description React hooks for teams endpoints
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient, useApiFootballStore } from "./context";
import { generateCacheKey } from "../store/cache-utils";
import {
  apiFootballKeys,
  type UseApiFootballQueryOptions,
  type UseApiFootballQueryOptionsRequired,
} from "./types";
import type {
  FootballTeamResponse,
  FootballTeamsParams,
  FootballTeamStatistics,
  FootballTeamStatisticsParams,
  FootballVenue,
  FootballVenuesParams,
} from "../types";

/**
 * Hook to fetch teams
 *
 * Requires at least one filter parameter.
 *
 * @param options - Query options with required params
 * @returns Query result with team data
 *
 * @example
 * ```typescript
 * // Get teams by league and season
 * function LeagueTeams({ leagueId, season }: Props) {
 *   const { data, isLoading } = useTeams({
 *     params: { league: leagueId, season },
 *   });
 *   // ...
 * }
 *
 * // Get specific team
 * function TeamDetails({ teamId }: Props) {
 *   const { data } = useTeams({ params: { id: teamId } });
 *   const team = data?.response[0];
 *   // ...
 * }
 * ```
 */
export function useFootballTeams(
  options: UseApiFootballQueryOptionsRequired<
    FootballTeamResponse,
    FootballTeamsParams
  >,
) {
  const client = useApiFootballClient();
  const { getTeams, setTeams, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "teams",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.teams.list(params),
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
          paging: { current: 1, total: 1 },
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
 * Hook to fetch team statistics
 *
 * @param options - Query options with required params (team, league, season)
 * @returns Query result with team statistics
 *
 * @example
 * ```typescript
 * function TeamStats({ teamId, leagueId, season }: Props) {
 *   const { data, isLoading } = useTeamStatistics({
 *     params: { team: teamId, league: leagueId, season },
 *   });
 *
 *   const stats = data?.response[0];
 *   // ...
 * }
 * ```
 */
export function useFootballTeamStatistics(
  options: UseApiFootballQueryOptionsRequired<
    FootballTeamStatistics,
    FootballTeamStatisticsParams
  >,
) {
  const client = useApiFootballClient();
  const { getTeamStatistics, setTeamStatistics, cacheTTL } =
    useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "team-statistics",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.teams.statistics(params),
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
          paging: { current: 1, total: 1 },
          response: [cached],
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...queryOptions,
  });
}

/**
 * Hook to fetch venues/stadiums
 *
 * @param options - Query options with optional filter params
 * @returns Query result with venue data
 *
 * @example
 * ```typescript
 * // Get venues by country
 * function EnglishStadiums() {
 *   const { data } = useVenues({ params: { country: "England" } });
 *   // ...
 * }
 *
 * // Search venues
 * function VenueSearch({ search }: Props) {
 *   const { data } = useVenues({ params: { search } });
 *   // ...
 * }
 * ```
 */
export function useFootballVenues(
  options?: UseApiFootballQueryOptions<FootballVenue, FootballVenuesParams>,
) {
  const client = useApiFootballClient();
  const { getVenues, setVenues, cacheTTL } = useApiFootballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "venues",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.venues.list(params),
    queryFn: async () => {
      const response = await client.getVenues(params);
      setVenues(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getVenues(cacheKey);
      if (cached) {
        return {
          get: "venues",
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
