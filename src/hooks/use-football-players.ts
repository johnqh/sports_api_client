/**
 * @module hooks/use-football-players
 * @description React hooks for players endpoints
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
  FootballPlayerResponse,
  FootballPlayersParams,
  FootballPlayersSeasonParams,
  FootballSquadResponse,
  FootballSquadsParams,
  FootballTopAssistsParams,
  FootballTopCardsParams,
  FootballTopScorersParams,
} from "../types";

/**
 * Hook to fetch players
 *
 * Requires at least one filter parameter.
 *
 * @param options - Query options with required params
 * @returns Query result with player data
 *
 * @example
 * ```typescript
 * // Get players by team and season
 * function TeamPlayers({ teamId, season }: Props) {
 *   const { data, isLoading } = usePlayers({
 *     params: { team: teamId, season },
 *   });
 *   // ...
 * }
 *
 * // Search players
 * function PlayerSearch({ search }: Props) {
 *   const { data } = usePlayers({
 *     params: { search, league: 39, season: 2023 },
 *   });
 *   // ...
 * }
 * ```
 */
export function useFootballPlayers(
  options: UseApiFootballQueryOptionsRequired<
    FootballPlayerResponse,
    FootballPlayersParams
  >,
) {
  const client = useApiFootballClient();
  const { getPlayers, setPlayers, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "players",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.players.list(params),
    queryFn: async () => {
      const response = await client.getPlayers(params);
      setPlayers(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getPlayers(cacheKey);
      if (cached) {
        return {
          get: "players",
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
 * Hook to fetch available player seasons
 *
 * @param options - Query options with optional player param
 * @returns Query result with season years
 *
 * @example
 * ```typescript
 * function PlayerSeasons({ playerId }: Props) {
 *   const { data } = usePlayersSeasons({ params: { player: playerId } });
 *   // data.response = [2020, 2021, 2022, 2023]
 * }
 * ```
 */
export function useFootballPlayersSeasons(
  options?: UseApiFootballQueryOptions<number, FootballPlayersSeasonParams>,
) {
  const client = useApiFootballClient();
  const params = options?.params;

  return useQuery({
    queryKey: apiFootballKeys.players.seasons(params),
    queryFn: () => client.getPlayersSeasons(params),
    staleTime: 24 * 60 * 60 * 1000, // Seasons rarely change, cache for 24h
    ...options,
  });
}

/**
 * Hook to fetch team squads
 *
 * @param options - Query options with team or player param
 * @returns Query result with squad data
 *
 * @example
 * ```typescript
 * // Get team squad
 * function TeamSquad({ teamId }: Props) {
 *   const { data } = useSquads({ params: { team: teamId } });
 *   const players = data?.response[0]?.players;
 *   // ...
 * }
 *
 * // Get player's teams
 * function PlayerTeams({ playerId }: Props) {
 *   const { data } = useSquads({ params: { player: playerId } });
 *   // ...
 * }
 * ```
 */
export function useFootballSquads(
  options: UseApiFootballQueryOptionsRequired<
    FootballSquadResponse,
    FootballSquadsParams
  >,
) {
  const client = useApiFootballClient();
  const { getSquads, setSquads, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "squads",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.squads.list(params),
    queryFn: async () => {
      const response = await client.getSquads(params);
      setSquads(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getSquads(cacheKey);
      if (cached) {
        return {
          get: "players/squads",
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
 * Hook to fetch top scorers
 *
 * @param options - Query options with required league and season params
 * @returns Query result with top scorers data
 *
 * @example
 * ```typescript
 * function TopScorers({ leagueId, season }: Props) {
 *   const { data, isLoading } = useTopScorers({
 *     params: { league: leagueId, season },
 *   });
 *
 *   return (
 *     <List>
 *       {data?.response.map((player, i) => (
 *         <Item key={player.player.id}>
 *           {i + 1}. {player.player.name} - {player.statistics[0].goals.total}
 *         </Item>
 *       ))}
 *     </List>
 *   );
 * }
 * ```
 */
export function useFootballTopScorers(
  options: UseApiFootballQueryOptionsRequired<
    FootballPlayerResponse,
    FootballTopScorersParams
  >,
) {
  const client = useApiFootballClient();
  const { getPlayers, setPlayers, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "top-scorers",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.players.topScorers(params),
    queryFn: async () => {
      const response = await client.getTopScorers(params);
      setPlayers(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getPlayers(cacheKey);
      if (cached) {
        return {
          get: "players/topscorers",
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
 * Hook to fetch top assists
 *
 * @param options - Query options with required league and season params
 * @returns Query result with top assists data
 *
 * @example
 * ```typescript
 * function TopAssists({ leagueId, season }: Props) {
 *   const { data } = useTopAssists({
 *     params: { league: leagueId, season },
 *   });
 *   // ...
 * }
 * ```
 */
export function useFootballTopAssists(
  options: UseApiFootballQueryOptionsRequired<
    FootballPlayerResponse,
    FootballTopAssistsParams
  >,
) {
  const client = useApiFootballClient();
  const { getPlayers, setPlayers, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "top-assists",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.players.topAssists(params),
    queryFn: async () => {
      const response = await client.getTopAssists(params);
      setPlayers(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getPlayers(cacheKey);
      if (cached) {
        return {
          get: "players/topassists",
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
 * Hook to fetch top cards (most carded players)
 *
 * @param options - Query options with required league and season params
 * @returns Query result with most carded players data
 *
 * @example
 * ```typescript
 * function MostCardedPlayers({ leagueId, season }: Props) {
 *   const { data } = useTopCards({
 *     params: { league: leagueId, season },
 *   });
 *   // ...
 * }
 * ```
 */
export function useFootballTopCards(
  options: UseApiFootballQueryOptionsRequired<
    FootballPlayerResponse,
    FootballTopCardsParams
  >,
) {
  const client = useApiFootballClient();
  const { getPlayers, setPlayers, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "top-cards",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.players.topCards(params),
    queryFn: async () => {
      const response = await client.getTopCards(params);
      setPlayers(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getPlayers(cacheKey);
      if (cached) {
        return {
          get: "players/topcards",
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
