/**
 * @module hooks/use-volleyball-countries
 * @description React hook for countries endpoint
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
import type { VolleyballCountriesParams, VolleyballCountry } from "../types";

/**
 * Hook to fetch available countries
 */
export function useVolleyballCountries(
  options?: UseApiVolleyballQueryOptions<
    VolleyballCountry,
    VolleyballCountriesParams
  >,
) {
  const client = useApiVolleyballClient();
  const { countries, setCountries, cacheTTL } = useApiVolleyballStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiVolleyballKeys.countries.list(params),
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
