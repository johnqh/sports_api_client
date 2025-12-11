/**
 * @module hooks/use-mma-timezone
 * @description React hook for timezone endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiMmaClient, useApiMmaStore } from "./mma-context";
import { apiMmaKeys, type UseApiMmaQueryOptions } from "./mma-types";
import type { MmaTimezone } from "../types";

export function useMmaTimezone(options?: UseApiMmaQueryOptions<MmaTimezone>) {
  const client = useApiMmaClient();
  const { timezones, setTimezones, cacheTTL } = useApiMmaStore();

  return useQuery({
    queryKey: apiMmaKeys.timezone(),
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
