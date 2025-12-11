/**
 * @module hooks/use-volleyball-h2h
 * @description React hook for head-to-head endpoint
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
import type { VolleyballGame, VolleyballH2HParams } from "../types";

/**
 * Hook to fetch head-to-head games
 */
export function useVolleyballH2H(
  options: UseApiVolleyballQueryOptionsRequired<
    VolleyballGame,
    VolleyballH2HParams
  >,
) {
  const client = useApiVolleyballClient();
  const { getH2H, setH2H, cacheTTL } = useApiVolleyballStore();
  const params = options.params;
  const cacheKey = generateCacheKey(
    "h2h",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiVolleyballKeys.h2h.list(params),
    queryFn: async () => {
      const response = await client.getH2H(params);
      setH2H(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getH2H(cacheKey);
      if (cached) {
        return {
          get: "h2h",
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
