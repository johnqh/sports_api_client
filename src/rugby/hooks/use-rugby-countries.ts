/**
 * @module hooks/use-rugby-countries
 * @description React hook for countries endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiRugbyClient, useApiRugbyStore } from "./rugby-context";
import { apiRugbyKeys, type UseApiRugbyQueryOptions } from "./rugby-types";
import type { RugbyCountriesParams, RugbyCountry } from "../types";

/**
 * Hook to fetch available countries
 *
 * @param options - Query options including optional params
 * @returns Query result with country data
 */
export function useRugbyCountries(
  options?: UseApiRugbyQueryOptions<RugbyCountry, RugbyCountriesParams>,
) {
  const client = useApiRugbyClient();
  const { countries, setCountries, cacheTTL } = useApiRugbyStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiRugbyKeys.countries.list(params),
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
