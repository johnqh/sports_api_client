/**
 * @module hooks/use-mma-categories
 * @description React hook for categories endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiMmaClient, useApiMmaStore } from "./mma-context";
import { generateCacheKey } from "../../utils/cache-utils";
import { apiMmaKeys, type UseApiMmaQueryOptions } from "./mma-types";
import type { MmaCategoriesParams, MmaCategory } from "../types";

export function useMmaCategories(
  options?: UseApiMmaQueryOptions<MmaCategory, MmaCategoriesParams>,
) {
  const client = useApiMmaClient();
  const { getCategories, setCategories, cacheTTL } = useApiMmaStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "categories",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiMmaKeys.categories.list(params),
    queryFn: async () => {
      const response = await client.getCategories(params);
      setCategories(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getCategories(cacheKey);
      if (cached) {
        return {
          get: "categories",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: cached.length,
          response: cached,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...options,
  });
}
