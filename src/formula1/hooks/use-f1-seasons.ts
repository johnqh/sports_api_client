/**
 * @module hooks/use-f1-seasons
 * @description React hook for seasons endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiF1Client, useApiF1Store } from "./f1-context";
import { apiF1Keys, type UseApiF1QueryOptions } from "./f1-types";
import type { F1SeasonsParams } from "../types";

/**
 * Hook to fetch available seasons
 *
 * @param options - Query options including optional params
 * @returns Query result with season data
 */
export function useF1Seasons(
  options?: UseApiF1QueryOptions<number, F1SeasonsParams>,
) {
  const client = useApiF1Client();
  const { seasons, setSeasons, cacheTTL } = useApiF1Store();
  const params = options?.params;

  return useQuery({
    queryKey: apiF1Keys.seasons.list(params),
    queryFn: async () => {
      const response = await client.getSeasons(params);
      if (!params) {
        setSeasons(response.response);
      }
      return response;
    },
    initialData: () => {
      if (!params && seasons?.data) {
        return {
          get: "seasons",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: seasons.data.length,
          response: seasons.data,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...options,
  });
}
