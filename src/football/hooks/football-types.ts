/**
 * @module hooks/types
 * @description Type definitions for API-Football hooks
 */

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiFootballResponse } from "../types";

/**
 * Base options for all API-Football hooks
 *
 * Extends React Query's UseQueryOptions with common defaults.
 */
export interface UseApiFootballQueryOptions<TData, TParams = void> extends Omit<
  UseQueryOptions<ApiFootballResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call */
  params?: TParams;
}

/**
 * Options for hooks with required parameters
 */
export interface UseApiFootballQueryOptionsRequired<
  TData,
  TParams,
> extends Omit<
  UseQueryOptions<ApiFootballResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call (required) */
  params: TParams;
}

// Base key for all API-Football queries
const FOOTBALL_BASE_KEY = ["api-football"] as const;

/**
 * Query keys namespace for all API-Football queries
 *
 * Use these keys for cache invalidation and prefetching.
 *
 * @example
 * ```typescript
 * import { queryClient } from "./your-query-client";
 * import { apiFootballKeys } from "@sudobility/sports_api_client";
 *
 * // Invalidate all leagues queries
 * queryClient.invalidateQueries({ queryKey: apiFootballKeys.leagues.all });
 *
 * // Invalidate specific leagues query
 * queryClient.invalidateQueries({
 *   queryKey: apiFootballKeys.leagues.list({ country: "England" }),
 * });
 * ```
 */
export const apiFootballKeys = {
  all: FOOTBALL_BASE_KEY,

  // General
  timezone: () => [...FOOTBALL_BASE_KEY, "timezone"] as const,
  countries: {
    all: [...FOOTBALL_BASE_KEY, "countries"] as const,
    list: (params?: object) =>
      [...FOOTBALL_BASE_KEY, "countries", params ?? {}] as const,
  },
  seasons: () => [...FOOTBALL_BASE_KEY, "seasons"] as const,

  // Leagues
  leagues: {
    all: [...FOOTBALL_BASE_KEY, "leagues"] as const,
    list: (params?: object) =>
      [...FOOTBALL_BASE_KEY, "leagues", params ?? {}] as const,
  },

  // Teams
  teams: {
    all: [...FOOTBALL_BASE_KEY, "teams"] as const,
    list: (params: object) => [...FOOTBALL_BASE_KEY, "teams", params] as const,
    statistics: (params: object) =>
      [...FOOTBALL_BASE_KEY, "team-statistics", params] as const,
  },
  venues: {
    all: [...FOOTBALL_BASE_KEY, "venues"] as const,
    list: (params?: object) =>
      [...FOOTBALL_BASE_KEY, "venues", params ?? {}] as const,
  },

  // Standings
  standings: {
    all: [...FOOTBALL_BASE_KEY, "standings"] as const,
    list: (params: object) =>
      [...FOOTBALL_BASE_KEY, "standings", params] as const,
  },

  // Fixtures
  fixtures: {
    all: [...FOOTBALL_BASE_KEY, "fixtures"] as const,
    list: (params?: object) =>
      [...FOOTBALL_BASE_KEY, "fixtures", params ?? {}] as const,
    headToHead: (params: object) =>
      [...FOOTBALL_BASE_KEY, "fixtures-h2h", params] as const,
    statistics: (params: object) =>
      [...FOOTBALL_BASE_KEY, "fixture-statistics", params] as const,
    events: (params: object) =>
      [...FOOTBALL_BASE_KEY, "fixture-events", params] as const,
    lineups: (params: object) =>
      [...FOOTBALL_BASE_KEY, "fixture-lineups", params] as const,
    players: (params: object) =>
      [...FOOTBALL_BASE_KEY, "fixture-players", params] as const,
  },

  // Players
  players: {
    all: [...FOOTBALL_BASE_KEY, "players"] as const,
    list: (params: object) =>
      [...FOOTBALL_BASE_KEY, "players", params] as const,
    seasons: (params?: object) =>
      [...FOOTBALL_BASE_KEY, "player-seasons", params ?? {}] as const,
    topScorers: (params: object) =>
      [...FOOTBALL_BASE_KEY, "top-scorers", params] as const,
    topAssists: (params: object) =>
      [...FOOTBALL_BASE_KEY, "top-assists", params] as const,
    topCards: (params: object) =>
      [...FOOTBALL_BASE_KEY, "top-cards", params] as const,
  },
  squads: {
    all: [...FOOTBALL_BASE_KEY, "squads"] as const,
    list: (params: object) => [...FOOTBALL_BASE_KEY, "squads", params] as const,
  },

  // Transfers & Others
  transfers: {
    all: [...FOOTBALL_BASE_KEY, "transfers"] as const,
    list: (params: object) =>
      [...FOOTBALL_BASE_KEY, "transfers", params] as const,
  },
  trophies: {
    all: [...FOOTBALL_BASE_KEY, "trophies"] as const,
    list: (params: object) =>
      [...FOOTBALL_BASE_KEY, "trophies", params] as const,
  },
  sidelined: {
    all: [...FOOTBALL_BASE_KEY, "sidelined"] as const,
    list: (params: object) =>
      [...FOOTBALL_BASE_KEY, "sidelined", params] as const,
  },
  coaches: {
    all: [...FOOTBALL_BASE_KEY, "coaches"] as const,
    list: (params: object) =>
      [...FOOTBALL_BASE_KEY, "coaches", params] as const,
  },
  injuries: {
    all: [...FOOTBALL_BASE_KEY, "injuries"] as const,
    list: (params: object) =>
      [...FOOTBALL_BASE_KEY, "injuries", params] as const,
  },
} as const;
