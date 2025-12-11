/**
 * @module hooks/use-baseball-countries
 * @description React hook for countries endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiBaseballClient, useApiBaseballStore } from "./baseball-context";
import {
  apiBaseballKeys,
  type UseApiBaseballQueryOptions,
} from "./baseball-types";
import type { BaseballCountriesParams, BaseballCountry } from "../types";

/**
 * Hook to fetch available countries
 *
 * @param options - Query options including optional params
 * @returns Query result with country data
 */
export function useBaseballCountries(
  options?: UseApiBaseballQueryOptions<
    BaseballCountry,
    BaseballCountriesParams
  >,
) {
  const client = useApiBaseballClient();
  const { countries, setCountries, cacheTTL } = useApiBaseballStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiBaseballKeys.countries.list(params),
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
