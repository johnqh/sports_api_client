/**
 * @module hooks/use-handball-timezone
 * @description React hook for timezone endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiHandballClient, useApiHandballStore } from "./handball-context";
import {
  apiHandballKeys,
  type UseApiHandballQueryOptions,
} from "./handball-types";
import type { HandballTimezone } from "../types";

/**
 * Hook to fetch available timezones
 */
export function useHandballTimezone(
  options?: UseApiHandballQueryOptions<HandballTimezone>,
) {
  const client = useApiHandballClient();
  const { timezones, setTimezones, cacheTTL } = useApiHandballStore();

  return useQuery({
    queryKey: apiHandballKeys.timezone(),
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
