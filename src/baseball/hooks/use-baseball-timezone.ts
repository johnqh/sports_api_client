/**
 * @module hooks/use-baseball-timezone
 * @description React hook for timezone endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiBaseballClient, useApiBaseballStore } from "./baseball-context";
import {
  apiBaseballKeys,
  type UseApiBaseballQueryOptions,
} from "./baseball-types";
import type { BaseballTimezone } from "../types";

/**
 * Hook to fetch available timezones
 *
 * @param options - Query options
 * @returns Query result with timezone data
 */
export function useBaseballTimezone(
  options?: UseApiBaseballQueryOptions<BaseballTimezone>,
) {
  const client = useApiBaseballClient();
  const { timezones, setTimezones, cacheTTL } = useApiBaseballStore();

  return useQuery({
    queryKey: apiBaseballKeys.timezone(),
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
