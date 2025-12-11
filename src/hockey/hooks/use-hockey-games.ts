/**
 * @module hooks/use-hockey-games
 * @description React hooks for games endpoints
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHockeyClient, useApiHockeyStore } from "./hockey-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiHockeyKeys,
  type UseApiHockeyQueryOptions,
  type UseApiHockeyQueryOptionsRequired,
} from "./hockey-types";
import type {
  HockeyGame,
  HockeyGamesParams,
  HockeyHeadToHeadParams,
} from "../types";

/**
 * Hook to fetch games
 *
 * @param options - Query options including optional filter params
 * @returns Query result with game data
 */
export function useHockeyGames(
  options?: UseApiHockeyQueryOptions<HockeyGame, HockeyGamesParams>,
) {
  const client = useApiHockeyClient();
  const { getGames, setGames, cacheTTL } = useApiHockeyStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "games",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiHockeyKeys.games.list(params),
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
 */
export function useHockeyGamesHeadToHead(
  options: UseApiHockeyQueryOptionsRequired<HockeyGame, HockeyHeadToHeadParams>,
) {
  const client = useApiHockeyClient();
  const { getGames, setGames, cacheTTL } = useApiHockeyStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "games-h2h",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiHockeyKeys.games.headToHead(params),
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
