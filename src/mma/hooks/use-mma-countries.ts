/**
 * @module hooks/use-mma-countries
 * @description React hook for countries endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiMmaClient, useApiMmaStore } from "./mma-context";
import { apiMmaKeys, type UseApiMmaQueryOptions } from "./mma-types";
import type { MmaCountriesParams, MmaCountry } from "../types";

export function useMmaCountries(
  options?: UseApiMmaQueryOptions<MmaCountry, MmaCountriesParams>,
) {
  const client = useApiMmaClient();
  const { countries, setCountries, cacheTTL } = useApiMmaStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiMmaKeys.countries.list(params),
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
