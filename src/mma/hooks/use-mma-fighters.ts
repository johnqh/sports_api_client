/**
 * @module hooks/use-mma-fighters
 * @description React hook for fighters endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiMmaClient, useApiMmaStore } from "./mma-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiMmaKeys, type UseApiMmaQueryOptions } from "./mma-types";
import type { MmaFighter, MmaFightersParams } from "../types";

export function useMmaFighters(
  options?: UseApiMmaQueryOptions<MmaFighter, MmaFightersParams>,
) {
  const client = useApiMmaClient();
  const { getFighters, setFighters, cacheTTL } = useApiMmaStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "fighters",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiMmaKeys.fighters.list(params),
    queryFn: async () => {
      const response = await client.getFighters(params);
      setFighters(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getFighters(cacheKey);
      if (cached) {
        return {
          get: "fighters",
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
