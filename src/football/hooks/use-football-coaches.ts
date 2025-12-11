/**
 * @module hooks/use-football-coaches
 * @description React hook for coaches endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient, useApiFootballStore } from "./context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiFootballKeys,
  type UseApiFootballQueryOptionsRequired,
} from "./types";
import type { FootballCoach, FootballCoachsParams } from "../types";

/**
 * Hook to fetch coach information
 *
 * @param options - Query options with id, team, or search param
 * @returns Query result with coach data
 *
 * @example
 * ```typescript
 * // Get team's coach
 * function TeamCoach({ teamId }: Props) {
 *   const { data } = useCoaches({ params: { team: teamId } });
 *   const coach = data?.response[0];
 *   // ...
 * }
 *
 * // Search coaches
 * function CoachSearch({ search }: Props) {
 *   const { data } = useCoaches({ params: { search } });
 *   // ...
 * }
 * ```
 */
export function useFootballCoaches(
  options: UseApiFootballQueryOptionsRequired<
    FootballCoach,
    FootballCoachsParams
  >,
) {
  const client = useApiFootballClient();
  const { getCoaches, setCoaches, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "coaches",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.coaches.list(params),
    queryFn: async () => {
      const response = await client.getCoachs(params);
      setCoaches(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getCoaches(cacheKey);
      if (cached) {
        return {
          get: "coachs",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: cached.length,
          paging: { current: 1, total: 1 },
          response: cached,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...queryOptions,
  });
}
