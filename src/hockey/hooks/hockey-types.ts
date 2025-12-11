/**
 * @module hooks/hockey-types
 * @description Type definitions for API-Hockey hooks
 */

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiHockeyResponse } from "../types";

/**
 * Base options for all API-Hockey hooks
 */
export interface UseApiHockeyQueryOptions<TData, TParams = void> extends Omit<
  UseQueryOptions<ApiHockeyResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call */
  params?: TParams;
}

/**
 * Options for hooks with required parameters
 */
export interface UseApiHockeyQueryOptionsRequired<TData, TParams> extends Omit<
  UseQueryOptions<ApiHockeyResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call (required) */
  params: TParams;
}

// Base key for all API-Hockey queries
const HOCKEY_BASE_KEY = ["api-hockey"] as const;

/**
 * Query keys namespace for all API-Hockey queries
 */
export const apiHockeyKeys = {
  all: HOCKEY_BASE_KEY,

  // General
  timezone: () => [...HOCKEY_BASE_KEY, "timezone"] as const,
  countries: {
    all: [...HOCKEY_BASE_KEY, "countries"] as const,
    list: (params?: object) =>
      [...HOCKEY_BASE_KEY, "countries", params ?? {}] as const,
  },
  seasons: {
    all: [...HOCKEY_BASE_KEY, "seasons"] as const,
    list: (params?: object) =>
      [...HOCKEY_BASE_KEY, "seasons", params ?? {}] as const,
  },

  // Leagues
  leagues: {
    all: [...HOCKEY_BASE_KEY, "leagues"] as const,
    list: (params?: object) =>
      [...HOCKEY_BASE_KEY, "leagues", params ?? {}] as const,
  },

  // Teams
  teams: {
    all: [...HOCKEY_BASE_KEY, "teams"] as const,
    list: (params?: object) =>
      [...HOCKEY_BASE_KEY, "teams", params ?? {}] as const,
    statistics: (params: object) =>
      [...HOCKEY_BASE_KEY, "team-statistics", params] as const,
  },

  // Games
  games: {
    all: [...HOCKEY_BASE_KEY, "games"] as const,
    list: (params?: object) =>
      [...HOCKEY_BASE_KEY, "games", params ?? {}] as const,
    headToHead: (params: object) =>
      [...HOCKEY_BASE_KEY, "games-h2h", params] as const,
    statistics: (params: object) =>
      [...HOCKEY_BASE_KEY, "game-statistics", params] as const,
  },

  // Standings
  standings: {
    all: [...HOCKEY_BASE_KEY, "standings"] as const,
    list: (params: object) =>
      [...HOCKEY_BASE_KEY, "standings", params] as const,
  },
} as const;
