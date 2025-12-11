/**
 * @module hooks/use-volleyball-games
 * @description React hook for games endpoint
 */

import { useQuery } from "@tanstack/react-query";
import {
  useApiVolleyballClient,
  useApiVolleyballStore,
} from "./volleyball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiVolleyballKeys,
  type UseApiVolleyballQueryOptions,
} from "./volleyball-types";
import type { VolleyballGame, VolleyballGamesParams } from "../types";

/**
 * Hook to fetch games
 */
export function useVolleyballGames(
  options?: UseApiVolleyballQueryOptions<VolleyballGame, VolleyballGamesParams>,
) {
  const client = useApiVolleyballClient();
  const { getGames, setGames, cacheTTL } = useApiVolleyballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "games",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiVolleyballKeys.games.list(params),
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
