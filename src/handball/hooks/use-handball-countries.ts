/**
 * @module hooks/use-handball-countries
 * @description React hook for countries endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHandballClient, useApiHandballStore } from "./handball-context";
import {
  apiHandballKeys,
  type UseApiHandballQueryOptions,
} from "./handball-types";
import type { HandballCountriesParams, HandballCountry } from "../types";

/**
 * Hook to fetch available countries
 */
export function useHandballCountries(
  options?: UseApiHandballQueryOptions<
    HandballCountry,
    HandballCountriesParams
  >,
) {
  const client = useApiHandballClient();
  const { countries, setCountries, cacheTTL } = useApiHandballStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiHandballKeys.countries.list(params),
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
