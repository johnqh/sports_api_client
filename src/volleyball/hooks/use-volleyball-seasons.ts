/**
 * @module hooks/use-volleyball-seasons
 * @description React hook for seasons endpoint
 */

import { useQuery } from "@tanstack/react-query";
import {
  useApiVolleyballClient,
  useApiVolleyballStore,
} from "./volleyball-context";
import {
  apiVolleyballKeys,
  type UseApiVolleyballQueryOptions,
} from "./volleyball-types";
import type { VolleyballSeason, VolleyballSeasonsParams } from "../types";

/**
 * Hook to fetch available seasons
 */
export function useVolleyballSeasons(
  options?: UseApiVolleyballQueryOptions<
    VolleyballSeason,
    VolleyballSeasonsParams
  >,
) {
  const client = useApiVolleyballClient();
  const { seasons, setSeasons, cacheTTL } = useApiVolleyballStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiVolleyballKeys.seasons.list(params),
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
