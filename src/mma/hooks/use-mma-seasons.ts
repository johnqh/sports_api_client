/**
 * @module hooks/use-mma-seasons
 * @description React hook for seasons endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiMmaClient, useApiMmaStore } from "./mma-context";
import { apiMmaKeys, type UseApiMmaQueryOptions } from "./mma-types";
import type { MmaSeasonsParams } from "../types";

export function useMmaSeasons(
  options?: UseApiMmaQueryOptions<number, MmaSeasonsParams>,
) {
  const client = useApiMmaClient();
  const { seasons, setSeasons, cacheTTL } = useApiMmaStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiMmaKeys.seasons.list(params),
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
