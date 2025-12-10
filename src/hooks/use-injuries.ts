/**
 * @module hooks/use-injuries
 * @description React hook for injuries endpoint
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient } from "./context";
import {
  apiFootballKeys,
  type UseApiFootballQueryOptionsRequired,
} from "./types";
import type { InjuriesParams, Injury } from "../types";

/**
 * Hook to fetch injuries
 *
 * @param options - Query options with league/season, fixture, team, or player params
 * @returns Query result with injury data
 *
 * @example
 * ```typescript
 * // Get team injuries
 * function TeamInjuries({ teamId, season }: Props) {
 *   const { data } = useInjuries({
 *     params: { team: teamId, season },
 *   });
 *   // ...
 * }
 *
 * // Get fixture injuries
 * function MatchInjuries({ fixtureId }: Props) {
 *   const { data } = useInjuries({ params: { fixture: fixtureId } });
 *   // ...
 * }
 * ```
 */
export function useInjuries(
  options: UseApiFootballQueryOptionsRequired<Injury, InjuriesParams>,
) {
  const client = useApiFootballClient();
  const { params, ...queryOptions } = options;

  return useQuery({
    queryKey: apiFootballKeys.injuries.list(params),
    queryFn: () => client.getInjuries(params),
    staleTime: 60 * 60 * 1000, // Injuries update less frequently, cache for 1h
    ...queryOptions,
  });
}
