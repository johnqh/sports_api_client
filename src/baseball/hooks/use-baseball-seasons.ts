/**
 * @module hooks/use-baseball-seasons
 * @description React hook for seasons endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiBaseballClient, useApiBaseballStore } from "./baseball-context";
import {
  apiBaseballKeys,
  type UseApiBaseballQueryOptions,
} from "./baseball-types";
import type { BaseballSeasonsParams } from "../types";

/**
 * Hook to fetch available seasons
 *
 * @param options - Query options including optional params
 * @returns Query result with season data
 */
export function useBaseballSeasons(
  options?: UseApiBaseballQueryOptions<number, BaseballSeasonsParams>,
) {
  const client = useApiBaseballClient();
  const { seasons, setSeasons, cacheTTL } = useApiBaseballStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiBaseballKeys.seasons.list(params),
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
