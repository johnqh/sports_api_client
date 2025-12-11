/**
 * @module hooks/use-mma-fights
 * @description React hook for fights endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiMmaClient, useApiMmaStore } from "./mma-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiMmaKeys, type UseApiMmaQueryOptions } from "./mma-types";
import type { MmaFight, MmaFightsParams } from "../types";

export function useMmaFights(
  options?: UseApiMmaQueryOptions<MmaFight, MmaFightsParams>,
) {
  const client = useApiMmaClient();
  const { getFights, setFights, cacheTTL } = useApiMmaStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "fights",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiMmaKeys.fights.list(params),
    queryFn: async () => {
      const response = await client.getFights(params);
      setFights(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getFights(cacheKey);
      if (cached) {
        return {
          get: "fights",
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
