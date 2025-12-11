/**
 * @module hooks/use-nfl-seasons
 * @description React hook for seasons endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiNflClient, useApiNflStore } from "./nfl-context";
import { apiNflKeys, type UseApiNflQueryOptions } from "./nfl-types";
import type { NflSeasonsParams } from "../types";

/**
 * Hook to fetch available seasons
 *
 * @param options - Query options including optional filter params
 * @returns Query result with season data (array of numbers like 2023, 2022)
 */
export function useNflSeasons(
  options?: UseApiNflQueryOptions<number, NflSeasonsParams>,
) {
  const client = useApiNflClient();
  const { seasons, setSeasons, cacheTTL } = useApiNflStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiNflKeys.seasons.list(params),
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
