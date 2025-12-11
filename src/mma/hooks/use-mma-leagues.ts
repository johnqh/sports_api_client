/**
 * @module hooks/use-mma-leagues
 * @description React hook for leagues endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiMmaClient, useApiMmaStore } from "./mma-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiMmaKeys, type UseApiMmaQueryOptions } from "./mma-types";
import type { MmaLeagueResponse, MmaLeaguesParams } from "../types";

export function useMmaLeagues(
  options?: UseApiMmaQueryOptions<MmaLeagueResponse, MmaLeaguesParams>,
) {
  const client = useApiMmaClient();
  const { getLeagues, setLeagues, cacheTTL } = useApiMmaStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "leagues",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiMmaKeys.leagues.list(params),
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
