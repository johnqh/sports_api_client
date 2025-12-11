/**
 * @module hooks/baseball-types
 * @description Type definitions for API-Baseball hooks
 */

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiBaseballResponse } from "../types";

/**
 * Base options for all API-Baseball hooks
 */
export interface UseApiBaseballQueryOptions<TData, TParams = void> extends Omit<
  UseQueryOptions<ApiBaseballResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call */
  params?: TParams;
}

/**
 * Options for hooks with required parameters
 */
export interface UseApiBaseballQueryOptionsRequired<
  TData,
  TParams,
> extends Omit<
  UseQueryOptions<ApiBaseballResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call (required) */
  params: TParams;
}

// Base key for all API-Baseball queries
const BASEBALL_BASE_KEY = ["api-baseball"] as const;

/**
 * Query keys namespace for all API-Baseball queries
 */
export const apiBaseballKeys = {
  all: BASEBALL_BASE_KEY,

  // General
  timezone: () => [...BASEBALL_BASE_KEY, "timezone"] as const,
  countries: {
    all: [...BASEBALL_BASE_KEY, "countries"] as const,
    list: (params?: object) =>
      [...BASEBALL_BASE_KEY, "countries", params ?? {}] as const,
  },
  seasons: {
    all: [...BASEBALL_BASE_KEY, "seasons"] as const,
    list: (params?: object) =>
      [...BASEBALL_BASE_KEY, "seasons", params ?? {}] as const,
  },

  // Leagues
  leagues: {
    all: [...BASEBALL_BASE_KEY, "leagues"] as const,
    list: (params?: object) =>
      [...BASEBALL_BASE_KEY, "leagues", params ?? {}] as const,
  },

  // Teams
  teams: {
    all: [...BASEBALL_BASE_KEY, "teams"] as const,
    list: (params?: object) =>
      [...BASEBALL_BASE_KEY, "teams", params ?? {}] as const,
    statistics: (params: object) =>
      [...BASEBALL_BASE_KEY, "team-statistics", params] as const,
  },

  // Games
  games: {
    all: [...BASEBALL_BASE_KEY, "games"] as const,
    list: (params?: object) =>
      [...BASEBALL_BASE_KEY, "games", params ?? {}] as const,
    headToHead: (params: object) =>
      [...BASEBALL_BASE_KEY, "games-h2h", params] as const,
    statistics: (params: object) =>
      [...BASEBALL_BASE_KEY, "game-statistics", params] as const,
  },

  // Standings
  standings: {
    all: [...BASEBALL_BASE_KEY, "standings"] as const,
    list: (params: object) =>
      [...BASEBALL_BASE_KEY, "standings", params] as const,
  },
} as const;
