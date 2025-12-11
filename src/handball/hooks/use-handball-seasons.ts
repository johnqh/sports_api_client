/**
 * @module hooks/use-handball-seasons
 * @description React hook for seasons endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHandballClient, useApiHandballStore } from "./handball-context";
import {
  apiHandballKeys,
  type UseApiHandballQueryOptions,
} from "./handball-types";
import type { HandballSeason, HandballSeasonsParams } from "../types";

/**
 * Hook to fetch available seasons
 */
export function useHandballSeasons(
  options?: UseApiHandballQueryOptions<HandballSeason, HandballSeasonsParams>,
) {
  const client = useApiHandballClient();
  const { seasons, setSeasons, cacheTTL } = useApiHandballStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiHandballKeys.seasons.list(params),
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
