/**
 * @module hooks/use-basketball-leagues
 * @description React hook for leagues endpoint
 */

import { useQuery } from "@tanstack/react-query";
import {
  useApiBasketballClient,
  useApiBasketballStore,
} from "./basketball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiBasketballKeys,
  type UseApiBasketballQueryOptions,
} from "./basketball-types";
import type {
  BasketballLeagueResponse,
  BasketballLeaguesParams,
} from "../types";

/**
 * Hook to fetch leagues
 *
 * @param options - Query options including optional filter params
 * @returns Query result with league data
 *
 * @example
 * ```typescript
 * // Get all leagues
 * function AllLeagues() {
 *   const { data, isLoading } = useBasketballLeagues();
 *   // ...
 * }
 *
 * // Get leagues by country
 * function USALeagues() {
 *   const { data } = useBasketballLeagues({ params: { country: "USA" } });
 *   // ...
 * }
 *
 * // Get specific league (NBA)
 * function NBALeague() {
 *   const { data } = useBasketballLeagues({ params: { id: 12 } });
 *   const league = data?.response[0];
 *   // ...
 * }
 * ```
 */
export function useBasketballLeagues(
  options?: UseApiBasketballQueryOptions<
    BasketballLeagueResponse,
    BasketballLeaguesParams
  >,
) {
  const client = useApiBasketballClient();
  const { getLeagues, setLeagues, cacheTTL } = useApiBasketballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "leagues",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBasketballKeys.leagues.list(params),
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
