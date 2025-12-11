/**
 * @module handball/hooks/use-handball-h2h
 * @description React hook for head-to-head endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHandballClient, useApiHandballStore } from "./handball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiHandballKeys,
  type UseApiHandballQueryOptionsRequired,
} from "./handball-types";
import type { HandballGame, HandballH2HParams } from "../types";

export function useHandballH2H(
  options: UseApiHandballQueryOptionsRequired<HandballGame, HandballH2HParams>,
) {
  const client = useApiHandballClient();
  const { getH2H, setH2H, cacheTTL } = useApiHandballStore();
  const params = options.params;
  const cacheKey = generateCacheKey(
    "h2h",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiHandballKeys.h2h.list(params),
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
