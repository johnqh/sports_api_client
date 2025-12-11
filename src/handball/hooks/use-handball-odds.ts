/**
 * @module handball/hooks/use-handball-odds
 * @description React hook for odds endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHandballClient, useApiHandballStore } from "./handball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiHandballKeys,
  type UseApiHandballQueryOptionsRequired,
} from "./handball-types";
import type { HandballOdds, HandballOddsParams } from "../types";

export function useHandballOdds(
  options: UseApiHandballQueryOptionsRequired<HandballOdds, HandballOddsParams>,
) {
  const client = useApiHandballClient();
  const { getOdds, setOdds, cacheTTL } = useApiHandballStore();
  const params = options.params;
  const cacheKey = generateCacheKey(
    "odds",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiHandballKeys.odds.list(params),
    queryFn: async () => {
      const response = await client.getOdds(params);
      setOdds(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getOdds(cacheKey);
      if (cached) {
        return {
          get: "odds",
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
