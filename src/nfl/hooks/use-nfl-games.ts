/**
 * @module hooks/use-nfl-games
 * @description React hooks for games endpoints
 */

import { useQuery } from "@tanstack/react-query";
import { useApiNflClient, useApiNflStore } from "./nfl-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiNflKeys,
  type UseApiNflQueryOptions,
  type UseApiNflQueryOptionsRequired,
} from "./nfl-types";
import type { NflGame, NflGamesParams, NflHeadToHeadParams } from "../types";

/**
 * Hook to fetch games
 *
 * @param options - Query options including optional filter params
 * @returns Query result with game data
 */
export function useNflGames(
  options?: UseApiNflQueryOptions<NflGame, NflGamesParams>,
) {
  const client = useApiNflClient();
  const { getGames, setGames, cacheTTL } = useApiNflStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "games",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiNflKeys.games.list(params),
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
export function useNflGamesHeadToHead(
  options: UseApiNflQueryOptionsRequired<NflGame, NflHeadToHeadParams>,
) {
  const client = useApiNflClient();
  const { getGames, setGames, cacheTTL } = useApiNflStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "games-h2h",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiNflKeys.games.headToHead(params),
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
