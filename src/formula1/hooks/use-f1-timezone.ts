/**
 * @module hooks/use-f1-timezone
 * @description React hook for timezone endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiF1Client, useApiF1Store } from "./f1-context";
import { apiF1Keys, type UseApiF1QueryOptions } from "./f1-types";
import type { F1Timezone } from "../types";

/**
 * Hook to fetch available timezones
 *
 * @param options - Query options
 * @returns Query result with timezone data
 */
export function useF1Timezone(options?: UseApiF1QueryOptions<F1Timezone>) {
  const client = useApiF1Client();
  const { timezones, setTimezones, cacheTTL } = useApiF1Store();

  return useQuery({
    queryKey: apiF1Keys.timezone(),
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
