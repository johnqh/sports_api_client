/**
 * @module hooks/use-fixtures
 * @description React hooks for fixtures endpoints
 */

import { useQuery } from "@tanstack/react-query";
import { useApiFootballClient, useApiFootballStore } from "./context";
import { generateCacheKey } from "../store/cache-utils";
import {
  apiFootballKeys,
  type UseApiFootballQueryOptions,
  type UseApiFootballQueryOptionsRequired,
} from "./types";
import type {
  FootballFixtureEvent,
  FootballFixtureEventsParams,
  FootballFixtureLineup,
  FootballFixtureLineupsParams,
  FootballFixturePlayersParams,
  FootballFixturePlayerStats,
  FootballFixtureResponse,
  FootballFixturesParams,
  FootballFixtureStatistics,
  FootballFixtureStatisticsParams,
  FootballHeadToHeadParams,
} from "../types";

/**
 * Hook to fetch fixtures
 *
 * Fetches matches with optional filtering.
 *
 * @param options - Query options with optional filter params
 * @returns Query result with fixture data
 *
 * @example
 * ```typescript
 * // Get live fixtures
 * function LiveMatches() {
 *   const { data, isLoading } = useFixtures({ params: { live: "all" } });
 *   // ...
 * }
 *
 * // Get fixtures by date
 * function TodayMatches() {
 *   const today = new Date().toISOString().split("T")[0];
 *   const { data } = useFixtures({ params: { date: today } });
 *   // ...
 * }
 *
 * // Get next 5 fixtures for a team
 * function UpcomingMatches({ teamId }: Props) {
 *   const { data } = useFixtures({ params: { team: teamId, next: 5 } });
 *   // ...
 * }
 * ```
 */
export function useFixtures(
  options?: UseApiFootballQueryOptions<
    FootballFixtureResponse,
    FootballFixturesParams
  >,
) {
  const client = useApiFootballClient();
  const { getFixtures, setFixtures, cacheTTL } = useApiFootballStore();
  const params = options?.params;
  const cacheKey = generateCacheKey(
    "fixtures",
    params as unknown as Record<string, unknown>,
  );

  // Don't cache live fixtures
  const isLive = params?.live !== undefined;

  return useQuery({
    queryKey: apiFootballKeys.fixtures.list(params),
    queryFn: async () => {
      const response = await client.getFixtures(params);
      if (!isLive) {
        setFixtures(cacheKey, response.response);
      }
      return response;
    },
    initialData: () => {
      if (isLive) return undefined;
      const cached = getFixtures(cacheKey);
      if (cached) {
        return {
          get: "fixtures",
          parameters: {} as Record<string, string>,
          errors: [] as string[],
          results: cached.length,
          paging: { current: 1, total: 1 },
          response: cached,
        };
      }
      return undefined;
    },
    staleTime: isLive ? 0 : cacheTTL,
    refetchInterval: isLive ? 30000 : false, // Refetch live every 30s
    ...options,
  });
}

/**
 * Hook to fetch head-to-head fixtures
 *
 * @param options - Query options with required h2h param (format: "teamId-teamId")
 * @returns Query result with head-to-head fixture data
 *
 * @example
 * ```typescript
 * function HeadToHead({ team1Id, team2Id }: Props) {
 *   const { data } = useFixturesHeadToHead({
 *     params: { h2h: `${team1Id}-${team2Id}` },
 *   });
 *
 *   return (
 *     <div>
 *       <h2>Previous Meetings</h2>
 *       {data?.response.map((match) => (
 *         <MatchCard key={match.fixture.id} match={match} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFixturesHeadToHead(
  options: UseApiFootballQueryOptionsRequired<
    FootballFixtureResponse,
    FootballHeadToHeadParams
  >,
) {
  const client = useApiFootballClient();
  const { getFixtures, setFixtures, cacheTTL } = useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "fixtures-h2h",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.fixtures.headToHead(params),
    queryFn: async () => {
      const response = await client.getFixturesHeadToHead(params);
      setFixtures(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getFixtures(cacheKey);
      if (cached) {
        return {
          get: "fixtures/headtohead",
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

/**
 * Hook to fetch fixture statistics
 *
 * @param options - Query options with required fixture param
 * @returns Query result with fixture statistics
 *
 * @example
 * ```typescript
 * function MatchStats({ fixtureId }: Props) {
 *   const { data } = useFixtureStatistics({
 *     params: { fixture: fixtureId },
 *   });
 *
 *   const [homeStats, awayStats] = data?.response ?? [];
 *   // ...
 * }
 * ```
 */
export function useFixtureStatistics(
  options: UseApiFootballQueryOptionsRequired<
    FootballFixtureStatistics,
    FootballFixtureStatisticsParams
  >,
) {
  const client = useApiFootballClient();
  const { getFixtureStatistics, setFixtureStatistics, cacheTTL } =
    useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "fixture-statistics",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.fixtures.statistics(params),
    queryFn: async () => {
      const response = await client.getFixtureStatistics(params);
      setFixtureStatistics(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getFixtureStatistics(cacheKey);
      if (cached) {
        return {
          get: "fixtures/statistics",
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

/**
 * Hook to fetch fixture events
 *
 * @param options - Query options with required fixture param
 * @returns Query result with fixture events (goals, cards, subs, VAR)
 *
 * @example
 * ```typescript
 * function MatchTimeline({ fixtureId }: Props) {
 *   const { data } = useFixtureEvents({
 *     params: { fixture: fixtureId },
 *   });
 *
 *   return (
 *     <Timeline>
 *       {data?.response.map((event, i) => (
 *         <Event key={i} type={event.type} time={event.time.elapsed} />
 *       ))}
 *     </Timeline>
 *   );
 * }
 * ```
 */
export function useFixtureEvents(
  options: UseApiFootballQueryOptionsRequired<
    FootballFixtureEvent,
    FootballFixtureEventsParams
  >,
) {
  const client = useApiFootballClient();
  const { getFixtureEvents, setFixtureEvents, cacheTTL } =
    useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "fixture-events",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.fixtures.events(params),
    queryFn: async () => {
      const response = await client.getFixtureEvents(params);
      setFixtureEvents(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getFixtureEvents(cacheKey);
      if (cached) {
        return {
          get: "fixtures/events",
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

/**
 * Hook to fetch fixture lineups
 *
 * @param options - Query options with required fixture param
 * @returns Query result with fixture lineups
 *
 * @example
 * ```typescript
 * function MatchLineups({ fixtureId }: Props) {
 *   const { data } = useFixtureLineups({
 *     params: { fixture: fixtureId },
 *   });
 *
 *   const [homeLineup, awayLineup] = data?.response ?? [];
 *   // ...
 * }
 * ```
 */
export function useFixtureLineups(
  options: UseApiFootballQueryOptionsRequired<
    FootballFixtureLineup,
    FootballFixtureLineupsParams
  >,
) {
  const client = useApiFootballClient();
  const { getFixtureLineups, setFixtureLineups, cacheTTL } =
    useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "fixture-lineups",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.fixtures.lineups(params),
    queryFn: async () => {
      const response = await client.getFixtureLineups(params);
      setFixtureLineups(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getFixtureLineups(cacheKey);
      if (cached) {
        return {
          get: "fixtures/lineups",
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

/**
 * Hook to fetch player statistics for a fixture
 *
 * @param options - Query options with required fixture param
 * @returns Query result with player statistics per team
 *
 * @example
 * ```typescript
 * function MatchPlayerStats({ fixtureId }: Props) {
 *   const { data } = useFixturePlayers({
 *     params: { fixture: fixtureId },
 *   });
 *
 *   return data?.response.map((team) => (
 *     <TeamStats key={team.team.id} team={team} />
 *   ));
 * }
 * ```
 */
export function useFixturePlayers(
  options: UseApiFootballQueryOptionsRequired<
    FootballFixturePlayerStats,
    FootballFixturePlayersParams
  >,
) {
  const client = useApiFootballClient();
  const { getFixturePlayers, setFixturePlayers, cacheTTL } =
    useApiFootballStore();
  const { params, ...queryOptions } = options;
  const cacheKey = generateCacheKey(
    "fixture-players",
    params as unknown as Record<string, unknown>,
  );

  return useQuery({
    queryKey: apiFootballKeys.fixtures.players(params),
    queryFn: async () => {
      const response = await client.getFixturePlayers(params);
      setFixturePlayers(cacheKey, response.response);
      return response;
    },
    initialData: () => {
      const cached = getFixturePlayers(cacheKey);
      if (cached) {
        return {
          get: "fixtures/players",
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
