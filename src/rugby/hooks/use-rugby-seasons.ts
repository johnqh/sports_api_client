/**
 * @module hooks/use-rugby-seasons
 * @description React hook for seasons endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiRugbyClient, useApiRugbyStore } from "./rugby-context";
import { apiRugbyKeys, type UseApiRugbyQueryOptions } from "./rugby-types";
import type { RugbySeasonsParams } from "../types";

/**
 * Hook to fetch available seasons
 *
 * @param options - Query options including optional params
 * @returns Query result with season data
 */
export function useRugbySeasons(
  options?: UseApiRugbyQueryOptions<number, RugbySeasonsParams>,
) {
  const client = useApiRugbyClient();
  const { seasons, setSeasons, cacheTTL } = useApiRugbyStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiRugbyKeys.seasons.list(params),
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
