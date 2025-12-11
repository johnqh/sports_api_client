/**
 * @module hooks/use-football-trophies
 * @description React hook for trophies endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient, useApiFootballStore } from "./context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiFootballKeys,
  type UseApiFootballQueryOptionsRequired,
} from "./types";
import type { FootballTrophiesParams, FootballTrophy } from "../types";

/**
 * Hook to fetch trophies
 *
 * @param options - Query options with player or coach param
 * @returns Query result with trophy data
 *
 * @example
 * ```typescript
 * function PlayerTrophies({ playerId }: Props) {
 *   const { data } = useTrophies({ params: { player: playerId } });
 *
 *   return (
 *     <List>
 *       {data?.response.map((trophy, i) => (
 *         <Item key={i}>
 *           {trophy.league} - {trophy.season}
 *         </Item>
 *       ))}
 *     </List>
 *   );
 * }
 * ```
 */
export function useFootballTrophies(
  options: UseApiFootballQueryOptionsRequired<
    FootballTrophy,
    FootballTrophiesParams
  >,
) {
  const client = useApiFootballClient();
  const { getTrophies, setTrophies, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "trophies",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.trophies.list(params),
    queryFn: async () => {
      const response = await client.getTrophies(params);
      setTrophies(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getTrophies(cacheKey);
      if (cached) {
        return {
          get: "trophies",
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
