/**
 * @module hooks/use-nfl-countries
 * @description React hook for countries endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiNflClient, useApiNflStore } from "./nfl-context";
import { apiNflKeys, type UseApiNflQueryOptions } from "./nfl-types";
import type { NflCountriesParams, NflCountry } from "../types";

/**
 * Hook to fetch countries
 *
 * @param options - Query options including optional filter params
 * @returns Query result with country data
 */
export function useNflCountries(
  options?: UseApiNflQueryOptions<NflCountry, NflCountriesParams>,
) {
  const client = useApiNflClient();
  const { countries, setCountries, cacheTTL } = useApiNflStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiNflKeys.countries.list(params),
    queryFn: async () => {
      const response = await client.getCountries(params);
      if (!params) {
        setCountries(response.response);
      }
      return response;
    },
    initialData: () => {
      if (!params && countries?.data) {
        return {
          get: "countries",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: countries.data.length,
          response: countries.data,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...options,
  });
}
