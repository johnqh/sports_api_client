/**
 * @module hooks/use-f1-pitstops
 * @description React hook for pit stops endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiF1Client, useApiF1Store } from "./f1-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiF1Keys, type UseApiF1QueryOptionsRequired } from "./f1-types";
import type { F1PitStop, F1PitStopsParams } from "../types";

/**
 * Hook to fetch pit stops for a race
 *
 * @param options - Query options with required params (race)
 * @returns Query result with pit stop data
 */
export function useF1PitStops(
  options: UseApiF1QueryOptionsRequired<F1PitStop, F1PitStopsParams>,
) {
  const client = useApiF1Client();
  const { getPitStops, setPitStops, cacheTTL } = useApiF1Store();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "pitstops",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiF1Keys.pitStops.list(params),
    queryFn: async () => {
      const response = await client.getPitStops(params);
      setPitStops(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getPitStops(cacheKey);
      if (cached) {
        return {
          get: "pitstops",
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
