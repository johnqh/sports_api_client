/**
 * @module hooks/use-baseball-games
 * @description React hooks for games endpoints
 */

import { useQuery } from "@tanstack/react-query";
import { useApiBaseballClient, useApiBaseballStore } from "./baseball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiBaseballKeys,
  type UseApiBaseballQueryOptions,
  type UseApiBaseballQueryOptionsRequired,
} from "./baseball-types";
import type {
  BaseballGame,
  BaseballGamesParams,
  BaseballGameStatistics,
  BaseballGameStatisticsParams,
  BaseballHeadToHeadParams,
} from "../types";

/**
 * Hook to fetch games
 *
 * @param options - Query options including optional params
 * @returns Query result with game data
 */
export function useBaseballGames(
  options?: UseApiBaseballQueryOptions<BaseballGame, BaseballGamesParams>,
) {
  const client = useApiBaseballClient();
  const { getGames, setGames, cacheTTL } = useApiBaseballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "games",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBaseballKeys.games.list(params),
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
 * Hook to fetch head-to-head games between two teams
 *
 * @param options - Query options with required h2h param
 * @returns Query result with head-to-head game data
 */
export function useBaseballGamesHeadToHead(
  options: UseApiBaseballQueryOptionsRequired<
    BaseballGame,
    BaseballHeadToHeadParams
  >,
) {
  const client = useApiBaseballClient();
  const { getGames, setGames, cacheTTL } = useApiBaseballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "games-h2h",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBaseballKeys.games.headToHead(params),
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
 * @param options - Query options with required game id param
 * @returns Query result with game statistics data
 */
export function useBaseballGameStatistics(
  options: UseApiBaseballQueryOptionsRequired<
    BaseballGameStatistics,
    BaseballGameStatisticsParams
  >,
) {
  const client = useApiBaseballClient();
  const { getGameStatistics, setGameStatistics, cacheTTL } =
    useApiBaseballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "game-statistics",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBaseballKeys.games.statistics(params),
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
