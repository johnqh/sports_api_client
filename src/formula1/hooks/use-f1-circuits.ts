/**
 * @module hooks/use-f1-circuits
 * @description React hook for circuits endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiF1Client, useApiF1Store } from "./f1-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiF1Keys, type UseApiF1QueryOptions } from "./f1-types";
import type { F1Circuit, F1CircuitsParams } from "../types";

/**
 * Hook to fetch circuits
 *
 * @param options - Query options including optional params
 * @returns Query result with circuit data
 */
export function useF1Circuits(
  options?: UseApiF1QueryOptions<F1Circuit, F1CircuitsParams>,
) {
  const client = useApiF1Client();
  const { getCircuits, setCircuits, cacheTTL } = useApiF1Store();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "circuits",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiF1Keys.circuits.list(params),
    queryFn: async () => {
      const response = await client.getCircuits(params);
      setCircuits(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getCircuits(cacheKey);
      if (cached) {
        return {
          get: "circuits",
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
