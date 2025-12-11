/**
 * @module handball/hooks/use-handball-leagues
 * @description React hook for leagues endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHandballClient, useApiHandballStore } from "./handball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiHandballKeys,
  type UseApiHandballQueryOptions,
} from "./handball-types";
import type { HandballLeagueResponse, HandballLeaguesParams } from "../types";

export function useHandballLeagues(
  options?: UseApiHandballQueryOptions<
    HandballLeagueResponse,
    HandballLeaguesParams
  >,
) {
  const client = useApiHandballClient();
  const { getLeagues, setLeagues, cacheTTL } = useApiHandballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "leagues",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiHandballKeys.leagues.list(params),
    queryFn: async () => {
      const response = await client.getLeagues(params);
      setLeagues(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getLeagues(cacheKey);
      if (cached) {
        return {
          get: "leagues",
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
