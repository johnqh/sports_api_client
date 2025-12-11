/**
 * @module hooks/use-f1-competitions
 * @description React hook for competitions endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiF1Client, useApiF1Store } from "./f1-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiF1Keys, type UseApiF1QueryOptions } from "./f1-types";
import type { F1Competition, F1CompetitionsParams } from "../types";

/**
 * Hook to fetch competitions (Grand Prix events)
 *
 * @param options - Query options including optional params
 * @returns Query result with competition data
 */
export function useF1Competitions(
  options?: UseApiF1QueryOptions<F1Competition, F1CompetitionsParams>,
) {
  const client = useApiF1Client();
  const { getCompetitions, setCompetitions, cacheTTL } = useApiF1Store();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "competitions",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiF1Keys.competitions.list(params),
    queryFn: async () => {
      const response = await client.getCompetitions(params);
      setCompetitions(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getCompetitions(cacheKey);
      if (cached) {
        return {
          get: "competitions",
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
