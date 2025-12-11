/**
 * @module hooks/use-football-standings
 * @description React hooks for standings endpoints
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient, useApiFootballStore } from "./football-context";
import { generateCacheKey } from "../../utils/cache-utils";
import {
  apiFootballKeys,
  type UseApiFootballQueryOptionsRequired,
} from "./football-types";
import type {
  FootballStandingsParams,
  FootballStandingsResponse,
} from "../types";

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
 * function LeagueTable({ leagueId, season }: Props) {
 *   const { data, isLoading } = useStandings({
 *     params: { league: leagueId, season },
 *   });
 *
 *   const standings = data?.response[0]?.league.standings[0];
 *
 *   return (
 *     <Table>
 *       {standings?.map((team) => (
 *         <Row key={team.team.id}>
 *           <Cell>{team.rank}</Cell>
 *           <Cell>{team.team.name}</Cell>
 *           <Cell>{team.points}</Cell>
 *         </Row>
 *       ))}
 *     </Table>
 *   );
 * }
 * ```
 */
export function useFootballStandings(
  options: UseApiFootballQueryOptionsRequired<
    FootballStandingsResponse,
    FootballStandingsParams
  >,
) {
  const client = useApiFootballClient();
  const { getStandings, setStandings, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "standings",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.standings.list(params),
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
