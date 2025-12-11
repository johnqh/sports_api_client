/**
 * @module hooks/use-baseball-leagues
 * @description React hook for leagues endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiBaseballClient, useApiBaseballStore } from "./baseball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiBaseballKeys,
  type UseApiBaseballQueryOptions,
} from "./baseball-types";
import type { BaseballLeagueResponse, BaseballLeaguesParams } from "../types";

/**
 * Hook to fetch leagues
 *
 * @param options - Query options including optional params
 * @returns Query result with league data
 */
export function useBaseballLeagues(
  options?: UseApiBaseballQueryOptions<
    BaseballLeagueResponse,
    BaseballLeaguesParams
  >,
) {
  const client = useApiBaseballClient();
  const { getLeagues, setLeagues, cacheTTL } = useApiBaseballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "leagues",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBaseballKeys.leagues.list(params),
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
