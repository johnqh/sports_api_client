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
