/**
 * @module hooks/use-countries
 * @description React hook for countries endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient, useApiFootballStore } from "./context";
import { apiFootballKeys, type UseApiFootballQueryOptions } from "./types";
import type { CountriesParams, Country } from "../types";

/**
 * Hook to fetch countries
 *
 * Caches results in Zustand store for persistence.
 *
 * @param options - Query options including optional filter params
 * @returns Query result with country data
 *
 * @example
 * ```typescript
 * // Get all countries
 * function CountryList() {
 *   const { data, isLoading } = useCountries();
 *   // ...
 * }
 *
 * // Search countries
 * function CountrySearch({ search }: { search: string }) {
 *   const { data } = useCountries({ params: { search } });
 *   // ...
 * }
 * ```
 */
export function useCountries(
  options?: UseApiFootballQueryOptions<Country, CountriesParams>,
) {
  const client = useApiFootballClient();
  const { countries, setCountries, isCacheValid, cacheTTL } =
    useApiFootballStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiFootballKeys.countries.list(params),
    queryFn: async () => {
      const response = await client.getCountries(params);
      // Only cache when no params (full list)
      if (!params || Object.keys(params).length === 0) {
        setCountries(response.response);
      }
      return response;
    },
    initialData: () => {
      // Only use cache for full list
      if (!params || Object.keys(params).length === 0) {
        if (countries && isCacheValid(countries.timestamp)) {
          return {
            get: "countries",
            parameters: {} as Record<string, string>,
            errors: [] as string[],
            results: countries.data.length,
            paging: { current: 1, total: 1 },
            response: countries.data,
          };
        }
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...options,
  });
}
