/**
 * @module hooks/use-basketball-games
 * @description React hooks for games endpoints
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
  BasketballGame,
  BasketballGamesParams,
  BasketballGameStatistics,
  BasketballGameStatisticsParams,
  BasketballHeadToHeadParams,
} from "../types";

/**
 * Hook to fetch games
 *
 * @param options - Query options including optional filter params
 * @returns Query result with game data
 *
 * @example
 * ```typescript
 * // Get games by date
 * function TodaysGames() {
 *   const { data, isLoading } = useBasketballGames({
 *     params: { date: "2024-01-15" },
 *   });
 *   // ...
 * }
 *
 * // Get games by league and season
 * function NBAGames() {
 *   const { data } = useBasketballGames({
 *     params: { league: 12, season: "2023-2024" },
 *   });
 *   // ...
 * }
 * ```
 */
export function useBasketballGames(
  options?: UseApiBasketballQueryOptions<BasketballGame, BasketballGamesParams>,
) {
  const client = useApiBasketballClient();
  const { getGames, setGames, cacheTTL } = useApiBasketballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "games",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBasketballKeys.games.list(params),
    queryFn: async () => {
      const response = await client.getGames(params);
      setGames(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getGames(cacheKey);
      if (cached) {
        return {
          get: "games",
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
 * Hook to fetch head to head games between two teams
 *
 * Requires h2h parameter (format: "team1Id-team2Id").
 *
 * @param options - Query options with required params
 * @returns Query result with head to head game data
 *
 * @example
 * ```typescript
 * function HeadToHead({ team1Id, team2Id }: Props) {
 *   const { data, isLoading } = useBasketballGamesHeadToHead({
 *     params: { h2h: `${team1Id}-${team2Id}` },
 *   });
 *   // ...
 * }
 * ```
 */
export function useBasketballGamesHeadToHead(
  options: UseApiBasketballQueryOptionsRequired<
    BasketballGame,
    BasketballHeadToHeadParams
  >,
) {
  const client = useApiBasketballClient();
  const { getGames, setGames, cacheTTL } = useApiBasketballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "games-h2h",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBasketballKeys.games.headToHead(params),
    queryFn: async () => {
      const response = await client.getGamesHeadToHead(params);
      setGames(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getGames(cacheKey);
      if (cached) {
        return {
          get: "games/h2h",
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
 * Hook to fetch game statistics
 *
 * Requires game ID parameter.
 *
 * @param options - Query options with required params
 * @returns Query result with game statistics data
 *
 * @example
 * ```typescript
 * function GameStats({ gameId }: Props) {
 *   const { data, isLoading } = useBasketballGameStatistics({
 *     params: { id: gameId },
 *   });
 *   // ...
 * }
 * ```
 */
export function useBasketballGameStatistics(
  options: UseApiBasketballQueryOptionsRequired<
    BasketballGameStatistics,
    BasketballGameStatisticsParams
  >,
) {
  const client = useApiBasketballClient();
  const { getGameStatistics, setGameStatistics, cacheTTL } =
    useApiBasketballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "game-statistics",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBasketballKeys.games.statistics(params),
    queryFn: async () => {
      const response = await client.getGameStatistics(params);
      setGameStatistics(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getGameStatistics(cacheKey);
      if (cached) {
        return {
          get: "games/statistics",
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
