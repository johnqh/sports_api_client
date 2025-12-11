/**
 * @module hooks/use-football-seasons
 * @description React hook for seasons endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient, useApiFootballStore } from "./football-context";
import {
  apiFootballKeys,
  type UseApiFootballQueryOptions,
} from "./football-types";

/**
 * Hook to fetch available seasons
 *
 * Caches results in Zustand store for persistence.
 *
 * @param options - React Query options
 * @returns Query result with season years
 *
 * @example
 * ```typescript
 * function SeasonSelector() {
 *   const { data, isLoading } = useSeasons();
 *
 *   const currentSeason = data?.response
 *     ? Math.max(...data.response)
 *     : new Date().getFullYear();
 *
 *   return (
 *     <Select defaultValue={currentSeason}>
 *       {data?.response.map((year) => (
 *         <Option key={year} value={year}>{year}</Option>
 *       ))}
 *     </Select>
 *   );
 * }
 * ```
 */
export function useFootballSeasons(
  options?: UseApiFootballQueryOptions<number, void>,
) {
  const client = useApiFootballClient();
  const { seasons, setSeasons, isCacheValid, cacheTTL } = useApiFootballStore();

  return useQuery({
    queryKey: apiFootballKeys.seasons(),
    queryFn: async () => {
      const response = await client.getSeasons();
      // Cache in Zustand
      setSeasons(response.response);
      return response;
    },
    initialData: () => {
      if (seasons && isCacheValid(seasons.timestamp)) {
        return {
          get: "leagues/seasons",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: seasons.data.length,
          paging: { current: 1, total: 1 },
          response: seasons.data,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...options,
  });
}
