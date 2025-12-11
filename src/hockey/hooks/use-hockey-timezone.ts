/**
 * @module hooks/use-hockey-timezone
 * @description React hook for timezone endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHockeyClient, useApiHockeyStore } from "./hockey-context";
import { apiHockeyKeys, type UseApiHockeyQueryOptions } from "./hockey-types";
import type { HockeyTimezone } from "../types";

/**
 * Hook to fetch available timezones
 *
 * @param options - Query options
 * @returns Query result with timezone data
 */
export function useHockeyTimezone(
  options?: UseApiHockeyQueryOptions<HockeyTimezone>,
) {
  const client = useApiHockeyClient();
  const { timezones, setTimezones, cacheTTL } = useApiHockeyStore();

  return useQuery({
    queryKey: apiHockeyKeys.timezone(),
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
