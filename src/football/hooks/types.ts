/**
 * @module hooks/types
 * @description Type definitions for API-Football hooks
 */

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiFootballResponse } from "../types";

/**
 * Query key factory type for consistent cache key generation
 */
export type QueryKeyFactory<TParams = void> = TParams extends void
  ? readonly string[]
  : (params: TParams) => readonly (string | TParams)[];

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
const BASE_KEY = ["api-football"] as const;

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
  all: BASE_KEY,

  // General
  timezone: () => [...BASE_KEY, "timezone"] as const,
  countries: {
    all: [...BASE_KEY, "countries"] as const,
    list: (params?: object) =>
      [...BASE_KEY, "countries", params ?? {}] as const,
  },
  seasons: () => [...BASE_KEY, "seasons"] as const,

  // Leagues
  leagues: {
    all: [...BASE_KEY, "leagues"] as const,
    list: (params?: object) => [...BASE_KEY, "leagues", params ?? {}] as const,
  },

  // Teams
  teams: {
    all: [...BASE_KEY, "teams"] as const,
    list: (params: object) => [...BASE_KEY, "teams", params] as const,
    statistics: (params: object) =>
      [...BASE_KEY, "team-statistics", params] as const,
  },
  venues: {
    all: [...BASE_KEY, "venues"] as const,
    list: (params?: object) => [...BASE_KEY, "venues", params ?? {}] as const,
  },

  // Standings
  standings: {
    all: [...BASE_KEY, "standings"] as const,
    list: (params: object) => [...BASE_KEY, "standings", params] as const,
  },

  // Fixtures
  fixtures: {
    all: [...BASE_KEY, "fixtures"] as const,
    list: (params?: object) => [...BASE_KEY, "fixtures", params ?? {}] as const,
    headToHead: (params: object) =>
      [...BASE_KEY, "fixtures-h2h", params] as const,
    statistics: (params: object) =>
      [...BASE_KEY, "fixture-statistics", params] as const,
    events: (params: object) =>
      [...BASE_KEY, "fixture-events", params] as const,
    lineups: (params: object) =>
      [...BASE_KEY, "fixture-lineups", params] as const,
    players: (params: object) =>
      [...BASE_KEY, "fixture-players", params] as const,
  },

  // Players
  players: {
    all: [...BASE_KEY, "players"] as const,
    list: (params: object) => [...BASE_KEY, "players", params] as const,
    seasons: (params?: object) =>
      [...BASE_KEY, "player-seasons", params ?? {}] as const,
    topScorers: (params: object) =>
      [...BASE_KEY, "top-scorers", params] as const,
    topAssists: (params: object) =>
      [...BASE_KEY, "top-assists", params] as const,
    topCards: (params: object) => [...BASE_KEY, "top-cards", params] as const,
  },
  squads: {
    all: [...BASE_KEY, "squads"] as const,
    list: (params: object) => [...BASE_KEY, "squads", params] as const,
  },

  // Transfers & Others
  transfers: {
    all: [...BASE_KEY, "transfers"] as const,
    list: (params: object) => [...BASE_KEY, "transfers", params] as const,
  },
  trophies: {
    all: [...BASE_KEY, "trophies"] as const,
    list: (params: object) => [...BASE_KEY, "trophies", params] as const,
  },
  sidelined: {
    all: [...BASE_KEY, "sidelined"] as const,
    list: (params: object) => [...BASE_KEY, "sidelined", params] as const,
  },
  coaches: {
    all: [...BASE_KEY, "coaches"] as const,
    list: (params: object) => [...BASE_KEY, "coaches", params] as const,
  },
  injuries: {
    all: [...BASE_KEY, "injuries"] as const,
    list: (params: object) => [...BASE_KEY, "injuries", params] as const,
  },
} as const;
