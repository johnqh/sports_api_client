/**
 * @module hooks/use-football-sidelined
 * @description React hook for sidelined endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient, useApiFootballStore } from "./context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiFootballKeys,
  type UseApiFootballQueryOptionsRequired,
} from "./types";
import type { FootballSidelined, FootballSidelinedParams } from "../types";

/**
 * Hook to fetch sidelined players (injured/suspended)
 *
 * @param options - Query options with player or coach param
 * @returns Query result with sidelined data
 *
 * @example
 * ```typescript
 * function PlayerInjuryHistory({ playerId }: Props) {
 *   const { data } = useSidelined({ params: { player: playerId } });
 *   // ...
 * }
 * ```
 */
export function useFootballSidelined(
  options: UseApiFootballQueryOptionsRequired<
    FootballSidelined,
    FootballSidelinedParams
  >,
) {
  const client = useApiFootballClient();
  const { getSidelined, setSidelined, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "sidelined",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.sidelined.list(params),
    queryFn: async () => {
      const response = await client.getSidelined(params);
      setSidelined(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getSidelined(cacheKey);
      if (cached) {
        return {
          get: "sidelined",
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
