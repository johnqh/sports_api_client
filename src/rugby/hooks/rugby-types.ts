/**
 * @module hooks/rugby-types
 * @description Type definitions for API-Rugby hooks
 */

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiRugbyResponse } from "../types";

/**
 * Base options for all API-Rugby hooks
 */
export interface UseApiRugbyQueryOptions<TData, TParams = void> extends Omit<
  UseQueryOptions<ApiRugbyResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call */
  params?: TParams;
}

/**
 * Options for hooks with required parameters
 */
export interface UseApiRugbyQueryOptionsRequired<TData, TParams> extends Omit<
  UseQueryOptions<ApiRugbyResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call (required) */
  params: TParams;
}

// Base key for all API-Rugby queries
const RUGBY_BASE_KEY = ["api-rugby"] as const;

/**
 * Query keys namespace for all API-Rugby queries
 */
export const apiRugbyKeys = {
  all: RUGBY_BASE_KEY,

  // General
  timezone: () => [...RUGBY_BASE_KEY, "timezone"] as const,
  countries: {
    all: [...RUGBY_BASE_KEY, "countries"] as const,
    list: (params?: object) =>
      [...RUGBY_BASE_KEY, "countries", params ?? {}] as const,
  },
  seasons: {
    all: [...RUGBY_BASE_KEY, "seasons"] as const,
    list: (params?: object) =>
      [...RUGBY_BASE_KEY, "seasons", params ?? {}] as const,
  },

  // Leagues
  leagues: {
    all: [...RUGBY_BASE_KEY, "leagues"] as const,
    list: (params?: object) =>
      [...RUGBY_BASE_KEY, "leagues", params ?? {}] as const,
  },

  // Teams
  teams: {
    all: [...RUGBY_BASE_KEY, "teams"] as const,
    list: (params?: object) =>
      [...RUGBY_BASE_KEY, "teams", params ?? {}] as const,
    statistics: (params: object) =>
      [...RUGBY_BASE_KEY, "team-statistics", params] as const,
  },

  // Games
  games: {
    all: [...RUGBY_BASE_KEY, "games"] as const,
    list: (params?: object) =>
      [...RUGBY_BASE_KEY, "games", params ?? {}] as const,
    headToHead: (params: object) =>
      [...RUGBY_BASE_KEY, "games-h2h", params] as const,
    statistics: (params: object) =>
      [...RUGBY_BASE_KEY, "game-statistics", params] as const,
  },

  // Standings
  standings: {
    all: [...RUGBY_BASE_KEY, "standings"] as const,
    list: (params: object) => [...RUGBY_BASE_KEY, "standings", params] as const,
  },
} as const;
