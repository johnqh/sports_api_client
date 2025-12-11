/**
 * @module hooks/nfl-types
 * @description Type definitions for API-NFL hooks
 */

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiNflResponse } from "../types";

/**
 * Base options for all API-NFL hooks
 */
export interface UseApiNflQueryOptions<TData, TParams = void> extends Omit<
  UseQueryOptions<ApiNflResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call */
  params?: TParams;
}

/**
 * Options for hooks with required parameters
 */
export interface UseApiNflQueryOptionsRequired<TData, TParams> extends Omit<
  UseQueryOptions<ApiNflResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call (required) */
  params: TParams;
}

// Base key for all API-NFL queries
const NFL_BASE_KEY = ["api-nfl"] as const;

/**
 * Query keys namespace for all API-NFL queries
 */
export const apiNflKeys = {
  all: NFL_BASE_KEY,

  // General
  timezone: () => [...NFL_BASE_KEY, "timezone"] as const,
  countries: {
    all: [...NFL_BASE_KEY, "countries"] as const,
    list: (params?: object) =>
      [...NFL_BASE_KEY, "countries", params ?? {}] as const,
  },
  seasons: {
    all: [...NFL_BASE_KEY, "seasons"] as const,
    list: (params?: object) =>
      [...NFL_BASE_KEY, "seasons", params ?? {}] as const,
  },

  // Leagues
  leagues: {
    all: [...NFL_BASE_KEY, "leagues"] as const,
    list: (params?: object) =>
      [...NFL_BASE_KEY, "leagues", params ?? {}] as const,
  },

  // Teams
  teams: {
    all: [...NFL_BASE_KEY, "teams"] as const,
    list: (params?: object) =>
      [...NFL_BASE_KEY, "teams", params ?? {}] as const,
    statistics: (params: object) =>
      [...NFL_BASE_KEY, "team-statistics", params] as const,
  },

  // Games
  games: {
    all: [...NFL_BASE_KEY, "games"] as const,
    list: (params?: object) =>
      [...NFL_BASE_KEY, "games", params ?? {}] as const,
    headToHead: (params: object) =>
      [...NFL_BASE_KEY, "games-h2h", params] as const,
    statistics: (params: object) =>
      [...NFL_BASE_KEY, "game-statistics", params] as const,
  },

  // Standings
  standings: {
    all: [...NFL_BASE_KEY, "standings"] as const,
    list: (params: object) => [...NFL_BASE_KEY, "standings", params] as const,
  },
} as const;
