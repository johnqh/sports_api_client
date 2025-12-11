/**
 * @module hooks/use-rugby-timezone
 * @description React hook for timezone endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiRugbyClient, useApiRugbyStore } from "./rugby-context";
import { apiRugbyKeys, type UseApiRugbyQueryOptions } from "./rugby-types";
import type { RugbyTimezone } from "../types";

/**
 * Hook to fetch available timezones
 *
 * @param options - Query options
 * @returns Query result with timezone data
 */
export function useRugbyTimezone(
  options?: UseApiRugbyQueryOptions<RugbyTimezone>,
) {
  const client = useApiRugbyClient();
  const { timezones, setTimezones, cacheTTL } = useApiRugbyStore();

  return useQuery({
    queryKey: apiRugbyKeys.timezone(),
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
