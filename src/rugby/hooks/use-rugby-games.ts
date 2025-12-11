/**
 * @module hooks/use-rugby-games
 * @description React hooks for games endpoints
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
  RugbyGame,
  RugbyGamesParams,
  RugbyHeadToHeadParams,
} from "../types";

/**
 * Hook to fetch games
 *
 * @param options - Query options including optional params
 * @returns Query result with game data
 */
export function useRugbyGames(
  options?: UseApiRugbyQueryOptions<RugbyGame, RugbyGamesParams>,
) {
  const client = useApiRugbyClient();
  const { getGames, setGames, cacheTTL } = useApiRugbyStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "games",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiRugbyKeys.games.list(params),
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
export function useRugbyGamesHeadToHead(
  options: UseApiRugbyQueryOptionsRequired<RugbyGame, RugbyHeadToHeadParams>,
) {
  const client = useApiRugbyClient();
  const { getGames, setGames, cacheTTL } = useApiRugbyStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "games-h2h",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiRugbyKeys.games.headToHead(params),
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
