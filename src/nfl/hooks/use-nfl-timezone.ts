/**
 * @module hooks/use-nfl-timezone
 * @description React hook for timezone endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiNflClient, useApiNflStore } from "./nfl-context";
import { apiNflKeys, type UseApiNflQueryOptions } from "./nfl-types";
import type { NflTimezone } from "../types";

/**
 * Hook to fetch available timezones
 *
 * @param options - Query options
 * @returns Query result with timezone data
 */
export function useNflTimezone(options?: UseApiNflQueryOptions<NflTimezone>) {
  const client = useApiNflClient();
  const { timezones, setTimezones, cacheTTL } = useApiNflStore();

  return useQuery({
    queryKey: apiNflKeys.timezone(),
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
