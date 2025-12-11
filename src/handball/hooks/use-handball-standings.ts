/**
 * @module handball/hooks/use-handball-standings
 * @description React hook for standings endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHandballClient, useApiHandballStore } from "./handball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiHandballKeys,
  type UseApiHandballQueryOptionsRequired,
} from "./handball-types";
import type {
  HandballStandingsParams,
  HandballStandingsResponse,
} from "../types";

export function useHandballStandings(
  options: UseApiHandballQueryOptionsRequired<
    HandballStandingsResponse,
    HandballStandingsParams
  >,
) {
  const client = useApiHandballClient();
  const { getStandings, setStandings, cacheTTL } = useApiHandballStore();
  const params = options.params;
  const cacheKey = generateCacheKey(
    "standings",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiHandballKeys.standings.list(params),
    queryFn: async () => {
      const response = await client.getStandings(params);
      setStandings(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getStandings(cacheKey);
      if (cached) {
        return {
          get: "standings",
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
