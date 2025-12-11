/**
 * @module hooks/use-basketball-timezone
 * @description React hook for timezone endpoint
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
import type { BasketballTimezone } from "../types";

/**
 * Hook to fetch available timezones
 *
 * @param options - Query options
 * @returns Query result with timezone data
 *
 * @example
 * ```typescript
 * function TimezoneSelector() {
 *   const { data, isLoading } = useBasketballTimezone();
 *   const timezones = data?.response ?? [];
 *   // ...
 * }
 * ```
 */
export function useBasketballTimezone(
  options?: UseApiBasketballQueryOptions<BasketballTimezone>,
) {
  const client = useApiBasketballClient();
  const { timezones, setTimezones, cacheTTL } = useApiBasketballStore();

  return useQuery({
    queryKey: apiBasketballKeys.timezone(),
    queryFn: async () => {
      const response = await client.getTimezone();
      setTimezones(response.response);
      return response;
    },
    initialData: () => {
      if (timezones?.data) {
        return {
          get: "timezone",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: timezones.data.length,
          response: timezones.data,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...options,
  });
}
