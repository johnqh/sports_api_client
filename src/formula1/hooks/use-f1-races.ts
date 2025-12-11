/**
 * @module hooks/use-f1-races
 * @description React hook for races endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiF1Client, useApiF1Store } from "./f1-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiF1Keys, type UseApiF1QueryOptions } from "./f1-types";
import type { F1Race, F1RacesParams } from "../types";

/**
 * Hook to fetch races
 *
 * @param options - Query options including optional params
 * @returns Query result with race data
 */
export function useF1Races(
  options?: UseApiF1QueryOptions<F1Race, F1RacesParams>,
) {
  const client = useApiF1Client();
  const { getRaces, setRaces, cacheTTL } = useApiF1Store();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "races",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiF1Keys.races.list(params),
    queryFn: async () => {
      const response = await client.getRaces(params);
      setRaces(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getRaces(cacheKey);
      if (cached) {
        return {
          get: "races",
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
