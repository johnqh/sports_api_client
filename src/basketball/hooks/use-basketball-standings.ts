/**
 * @module hooks/use-basketball-standings
 * @description React hook for standings endpoint
 */

import { useQuery } from "@tanstack/react-query";
import {
  useApiBasketballClient,
  useApiBasketballStore,
} from "./basketball-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiBasketballKeys,
  type UseApiBasketballQueryOptionsRequired,
} from "./basketball-types";
import type { BasketballStanding, BasketballStandingsParams } from "../types";

/**
 * Hook to fetch league standings
 *
 * Requires league and season parameters.
 *
 * @param options - Query options with required params
 * @returns Query result with standings data
 *
 * @example
 * ```typescript
 * function LeagueStandings({ leagueId, season }: Props) {
 *   const { data, isLoading } = useBasketballStandings({
 *     params: { league: leagueId, season },
 *   });
 *
 *   const standings = data?.response ?? [];
 *
 *   return (
 *     <Table>
 *       {standings.map((standing) => (
 *         <Row key={standing.team.id}>
 *           <Cell>{standing.position}</Cell>
 *           <Cell>{standing.team.name}</Cell>
 *           <Cell>{standing.games.win}</Cell>
 *           <Cell>{standing.games.lose}</Cell>
 *         </Row>
 *       ))}
 *     </Table>
 *   );
 * }
 * ```
 */
export function useBasketballStandings(
  options: UseApiBasketballQueryOptionsRequired<
    BasketballStanding,
    BasketballStandingsParams
  >,
) {
  const client = useApiBasketballClient();
  const { getStandings, setStandings, cacheTTL } = useApiBasketballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "standings",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiBasketballKeys.standings.list(params),
    queryFn: async () => {
      const response = await client.getStandings(params);
      setStandings(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getStandings(cacheKey);
      if (cached) {
        return {
          get: "standings",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: cached.length,
          response: cached,
        };
      }
      return undefined;
    },
    staleTime: cacheTTL,
    ...queryOptions,
  });
}
