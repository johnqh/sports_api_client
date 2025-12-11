/**
 * @module hooks/use-volleyball-timezone
 * @description React hook for timezone endpoint
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
import type { VolleyballTimezone } from "../types";

/**
 * Hook to fetch available timezones
 */
export function useVolleyballTimezone(
  options?: UseApiVolleyballQueryOptions<VolleyballTimezone>,
) {
  const client = useApiVolleyballClient();
  const { timezones, setTimezones, cacheTTL } = useApiVolleyballStore();

  return useQuery({
    queryKey: apiVolleyballKeys.timezone(),
    queryFn: async () => {
      const response = await client.getTimezones();
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
