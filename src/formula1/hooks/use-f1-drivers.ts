/**
 * @module hooks/use-f1-drivers
 * @description React hook for drivers endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiF1Client, useApiF1Store } from "./f1-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiF1Keys, type UseApiF1QueryOptions } from "./f1-types";
import type { F1Driver, F1DriversParams } from "../types";

/**
 * Hook to fetch drivers
 *
 * @param options - Query options including optional params
 * @returns Query result with driver data
 */
export function useF1Drivers(
  options?: UseApiF1QueryOptions<F1Driver, F1DriversParams>,
) {
  const client = useApiF1Client();
  const { getDrivers, setDrivers, cacheTTL } = useApiF1Store();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "drivers",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiF1Keys.drivers.list(params),
    queryFn: async () => {
      const response = await client.getDrivers(params);
      setDrivers(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getDrivers(cacheKey);
      if (cached) {
        return {
          get: "drivers",
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
