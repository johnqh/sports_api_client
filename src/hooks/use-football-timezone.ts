/**
 * @module hooks/use-football-timezone
 * @description React hook for timezone endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient, useApiFootballStore } from "./context";
import { apiFootballKeys, type UseApiFootballQueryOptions } from "./types";
import type { FootballTimezone } from "../types";

/**
 * Hook to fetch available timezones
 *
 * Caches results in Zustand store for persistence.
 *
 * @param options - React Query options
 * @returns Query result with timezone data
 *
 * @example
 * ```typescript
 * function TimezoneSelector() {
 *   const { data, isLoading, error } = useTimezone();
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <Error message={error.message} />;
 *
 *   return (
 *     <Select>
 *       {data?.response.map((tz) => (
 *         <Option key={tz} value={tz}>{tz}</Option>
 *       ))}
 *     </Select>
 *   );
 * }
 * ```
 */
export function useFootballTimezone(
  options?: UseApiFootballQueryOptions<FootballTimezone, void>,
) {
  const client = useApiFootballClient();
  const { timezones, setTimezones, isCacheValid, cacheTTL } =
    useApiFootballStore();

  return useQuery({
    queryKey: apiFootballKeys.timezone(),
    queryFn: async () => {
      const response = await client.getTimezone();
      // Cache in Zustand
      setTimezones(response.response);
      return response;
    },
    initialData: () => {
      // Check Zustand cache first
      if (timezones && isCacheValid(timezones.timestamp)) {
        return {
          get: "timezone",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: timezones.data.length,
          paging: { current: 1, total: 1 },
          response: timezones.data,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...options,
  });
}
