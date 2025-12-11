/**
 * @module hooks/use-hockey-seasons
 * @description React hook for seasons endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHockeyClient, useApiHockeyStore } from "./hockey-context";
import { apiHockeyKeys, type UseApiHockeyQueryOptions } from "./hockey-types";
import type { HockeySeasonsParams } from "../types";

/**
 * Hook to fetch available seasons
 *
 * @param options - Query options including optional filter params
 * @returns Query result with season data (array of numbers like 2023, 2022)
 */
export function useHockeySeasons(
  options?: UseApiHockeyQueryOptions<number, HockeySeasonsParams>,
) {
  const client = useApiHockeyClient();
  const { seasons, setSeasons, cacheTTL } = useApiHockeyStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiHockeyKeys.seasons.list(params),
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
