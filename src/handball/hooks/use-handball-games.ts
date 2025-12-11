/**
 * @module handball/hooks/use-handball-games
 * @description React hook for games endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHandballClient, useApiHandballStore } from "./handball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiHandballKeys,
  type UseApiHandballQueryOptions,
} from "./handball-types";
import type { HandballGame, HandballGamesParams } from "../types";

export function useHandballGames(
  options?: UseApiHandballQueryOptions<HandballGame, HandballGamesParams>,
) {
  const client = useApiHandballClient();
  const { getGames, setGames, cacheTTL } = useApiHandballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "games",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiHandballKeys.games.list(params),
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
