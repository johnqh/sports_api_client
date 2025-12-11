/**
 * @module hooks/basketball-types
 * @description Type definitions for API-Basketball hooks
 */

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiBasketballResponse } from "../types";

/**
 * Base options for all API-Basketball hooks
 *
 * Extends React Query's UseQueryOptions with common defaults.
 */
export interface UseApiBasketballQueryOptions<
  TData,
  TParams = void,
> extends Omit<
  UseQueryOptions<ApiBasketballResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call */
  params?: TParams;
}

/**
 * Options for hooks with required parameters
 */
export interface UseApiBasketballQueryOptionsRequired<
  TData,
  TParams,
> extends Omit<
  UseQueryOptions<ApiBasketballResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call (required) */
  params: TParams;
}

// Base key for all API-Basketball queries
const BASKETBALL_BASE_KEY = ["api-basketball"] as const;

/**
 * Query keys namespace for all API-Basketball queries
 *
 * Use these keys for cache invalidation and prefetching.
 *
 * @example
 * ```typescript
 * import { queryClient } from "./your-query-client";
 * import { apiBasketballKeys } from "@sudobility/sports_api_client";
 *
 * // Invalidate all leagues queries
 * queryClient.invalidateQueries({ queryKey: apiBasketballKeys.leagues.all });
 *
 * // Invalidate specific games query
 * queryClient.invalidateQueries({
 *   queryKey: apiBasketballKeys.games.list({ league: 12 }),
 * });
 * ```
 */
export const apiBasketballKeys = {
  all: BASKETBALL_BASE_KEY,

  // General
  timezone: () => [...BASKETBALL_BASE_KEY, "timezone"] as const,
  countries: {
    all: [...BASKETBALL_BASE_KEY, "countries"] as const,
    list: (params?: object) =>
      [...BASKETBALL_BASE_KEY, "countries", params ?? {}] as const,
  },
  seasons: {
    all: [...BASKETBALL_BASE_KEY, "seasons"] as const,
    list: (params?: object) =>
      [...BASKETBALL_BASE_KEY, "seasons", params ?? {}] as const,
  },

  // Leagues
  leagues: {
    all: [...BASKETBALL_BASE_KEY, "leagues"] as const,
    list: (params?: object) =>
      [...BASKETBALL_BASE_KEY, "leagues", params ?? {}] as const,
  },

  // Teams
  teams: {
    all: [...BASKETBALL_BASE_KEY, "teams"] as const,
    list: (params?: object) =>
      [...BASKETBALL_BASE_KEY, "teams", params ?? {}] as const,
    statistics: (params: object) =>
      [...BASKETBALL_BASE_KEY, "team-statistics", params] as const,
  },

  // Games
  games: {
    all: [...BASKETBALL_BASE_KEY, "games"] as const,
    list: (params?: object) =>
      [...BASKETBALL_BASE_KEY, "games", params ?? {}] as const,
    headToHead: (params: object) =>
      [...BASKETBALL_BASE_KEY, "games-h2h", params] as const,
    statistics: (params: object) =>
      [...BASKETBALL_BASE_KEY, "game-statistics", params] as const,
  },

  // Standings
  standings: {
    all: [...BASKETBALL_BASE_KEY, "standings"] as const,
    list: (params: object) =>
      [...BASKETBALL_BASE_KEY, "standings", params] as const,
  },
} as const;
