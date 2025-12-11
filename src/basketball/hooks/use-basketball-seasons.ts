/**
 * @module hooks/use-basketball-seasons
 * @description React hook for seasons endpoint
 */

import { useQuery } from "@tanstack/react-query";
import {
  useApiBasketballClient,
  useApiBasketballStore,
} from "./basketball-context";
import {
  apiBasketballKeys,
  type UseApiBasketballQueryOptions,
} from "./basketball-types";
import type { BasketballSeasonsParams } from "../types";

/**
 * Hook to fetch available seasons
 *
 * @param options - Query options including optional filter params
 * @returns Query result with season data (array of strings like "2023-2024")
 *
 * @example
 * ```typescript
 * function SeasonSelector() {
 *   const { data, isLoading } = useBasketballSeasons();
 *   const seasons = data?.response ?? [];
 *   // ...
 * }
 * ```
 */
export function useBasketballSeasons(
  options?: UseApiBasketballQueryOptions<string, BasketballSeasonsParams>,
) {
  const client = useApiBasketballClient();
  const { seasons, setSeasons, cacheTTL } = useApiBasketballStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiBasketballKeys.seasons.list(params),
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
