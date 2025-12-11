/**
 * @module hooks/use-volleyball-leagues
 * @description React hook for leagues endpoint
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
import type {
  VolleyballLeagueResponse,
  VolleyballLeaguesParams,
} from "../types";

/**
 * Hook to fetch leagues
 */
export function useVolleyballLeagues(
  options?: UseApiVolleyballQueryOptions<
    VolleyballLeagueResponse,
    VolleyballLeaguesParams
  >,
) {
  const client = useApiVolleyballClient();
  const { getLeagues, setLeagues, cacheTTL } = useApiVolleyballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "leagues",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiVolleyballKeys.leagues.list(params),
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
