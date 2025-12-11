/**
 * @module hooks/use-hockey-countries
 * @description React hook for countries endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHockeyClient, useApiHockeyStore } from "./hockey-context";
import { apiHockeyKeys, type UseApiHockeyQueryOptions } from "./hockey-types";
import type { HockeyCountriesParams, HockeyCountry } from "../types";

/**
 * Hook to fetch countries
 *
 * @param options - Query options including optional filter params
 * @returns Query result with country data
 */
export function useHockeyCountries(
  options?: UseApiHockeyQueryOptions<HockeyCountry, HockeyCountriesParams>,
) {
  const client = useApiHockeyClient();
  const { countries, setCountries, cacheTTL } = useApiHockeyStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiHockeyKeys.countries.list(params),
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
