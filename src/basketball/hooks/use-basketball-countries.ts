/**
 * @module hooks/use-basketball-countries
 * @description React hook for countries endpoint
 */

import { useQuery } from "@tanstack/react-query";
import {
  useApiBasketballClient,
  useApiBasketballStore,
} from "./basketball-context";
import {
  apiBasketballKeys,
  type UseApiBasketballQueryOptions,
} from "./basketball-types";
import type { BasketballCountriesParams, BasketballCountry } from "../types";

/**
 * Hook to fetch countries
 *
 * @param options - Query options including optional filter params
 * @returns Query result with country data
 *
 * @example
 * ```typescript
 * function CountryList() {
 *   const { data, isLoading } = useBasketballCountries();
 *   const countries = data?.response ?? [];
 *   // ...
 * }
 * ```
 */
export function useBasketballCountries(
  options?: UseApiBasketballQueryOptions<
    BasketballCountry,
    BasketballCountriesParams
  >,
) {
  const client = useApiBasketballClient();
  const { countries, setCountries, cacheTTL } = useApiBasketballStore();
  const params = options?.params;

  return useQuery({
    queryKey: apiBasketballKeys.countries.list(params),
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
