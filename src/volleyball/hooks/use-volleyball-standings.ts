/**
 * @module hooks/use-volleyball-standings
 * @description React hook for standings endpoint
 */

import { useQuery } from "@tanstack/react-query";
import {
  useApiVolleyballClient,
  useApiVolleyballStore,
} from "./volleyball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiVolleyballKeys,
  type UseApiVolleyballQueryOptionsRequired,
} from "./volleyball-types";
import type {
  VolleyballStandingsParams,
  VolleyballStandingsResponse,
} from "../types";

/**
 * Hook to fetch standings
 */
export function useVolleyballStandings(
  options: UseApiVolleyballQueryOptionsRequired<
    VolleyballStandingsResponse,
    VolleyballStandingsParams
  >,
) {
  const client = useApiVolleyballClient();
  const { getStandings, setStandings, cacheTTL } = useApiVolleyballStore();
  const params = options.params;
  const cacheKey = generateCacheKey(
    "standings",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiVolleyballKeys.standings.list(params),
    queryFn: async () => {
      const response = await client.getStandings(params);
      setStandings(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getStandings(cacheKey);
      if (cached) {
        return {
          get: "standings",
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
