/**
 * @module volleyball/hooks/volleyball-types
 * @description Query key factory and hook types for API-Volleyball
 */

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiVolleyballResponse } from "../types";

/**
 * Query key factory for API-Volleyball
 */
export const apiVolleyballKeys = {
  all: ["api-volleyball"] as const,
  timezone: () => [...apiVolleyballKeys.all, "timezone"] as const,
  countries: {
    all: () => [...apiVolleyballKeys.all, "countries"] as const,
    list: (params?: unknown) =>
      [...apiVolleyballKeys.countries.all(), "list", params] as const,
  },
  seasons: {
    all: () => [...apiVolleyballKeys.all, "seasons"] as const,
    list: (params?: unknown) =>
      [...apiVolleyballKeys.seasons.all(), "list", params] as const,
  },
  leagues: {
    all: () => [...apiVolleyballKeys.all, "leagues"] as const,
    list: (params?: unknown) =>
      [...apiVolleyballKeys.leagues.all(), "list", params] as const,
  },
  teams: {
    all: () => [...apiVolleyballKeys.all, "teams"] as const,
    list: (params?: unknown) =>
      [...apiVolleyballKeys.teams.all(), "list", params] as const,
  },
  standings: {
    all: () => [...apiVolleyballKeys.all, "standings"] as const,
    list: (params?: unknown) =>
      [...apiVolleyballKeys.standings.all(), "list", params] as const,
  },
  games: {
    all: () => [...apiVolleyballKeys.all, "games"] as const,
    list: (params?: unknown) =>
      [...apiVolleyballKeys.games.all(), "list", params] as const,
  },
  h2h: {
    all: () => [...apiVolleyballKeys.all, "h2h"] as const,
    list: (params?: unknown) =>
      [...apiVolleyballKeys.h2h.all(), "list", params] as const,
  },
};

/**
 * Base query options for API-Volleyball hooks
 */
export type UseApiVolleyballQueryOptions<TData, TParams = void> = Omit<
  UseQueryOptions<ApiVolleyballResponse<TData>>,
  "queryKey" | "queryFn"
> & {
  params?: TParams;
};

/**
 * Query options with required params
 */
export type UseApiVolleyballQueryOptionsRequired<TData, TParams> = Omit<
  UseQueryOptions<ApiVolleyballResponse<TData>>,
  "queryKey" | "queryFn"
> & {
  params: TParams;
};
