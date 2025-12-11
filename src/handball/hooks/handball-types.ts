/**
 * @module handball/hooks/handball-types
 * @description Query key factory and hook types for API-Handball
 */

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiHandballResponse } from "../types";

/**
 * Query key factory for API-Handball
 */
export const apiHandballKeys = {
  all: ["api-handball"] as const,
  timezone: () => [...apiHandballKeys.all, "timezone"] as const,
  countries: {
    all: () => [...apiHandballKeys.all, "countries"] as const,
    list: (params?: unknown) =>
      [...apiHandballKeys.countries.all(), "list", params] as const,
  },
  seasons: {
    all: () => [...apiHandballKeys.all, "seasons"] as const,
    list: (params?: unknown) =>
      [...apiHandballKeys.seasons.all(), "list", params] as const,
  },
  leagues: {
    all: () => [...apiHandballKeys.all, "leagues"] as const,
    list: (params?: unknown) =>
      [...apiHandballKeys.leagues.all(), "list", params] as const,
  },
  teams: {
    all: () => [...apiHandballKeys.all, "teams"] as const,
    list: (params?: unknown) =>
      [...apiHandballKeys.teams.all(), "list", params] as const,
  },
  standings: {
    all: () => [...apiHandballKeys.all, "standings"] as const,
    list: (params?: unknown) =>
      [...apiHandballKeys.standings.all(), "list", params] as const,
  },
  games: {
    all: () => [...apiHandballKeys.all, "games"] as const,
    list: (params?: unknown) =>
      [...apiHandballKeys.games.all(), "list", params] as const,
  },
  h2h: {
    all: () => [...apiHandballKeys.all, "h2h"] as const,
    list: (params?: unknown) =>
      [...apiHandballKeys.h2h.all(), "list", params] as const,
  },
  odds: {
    all: () => [...apiHandballKeys.all, "odds"] as const,
    list: (params?: unknown) =>
      [...apiHandballKeys.odds.all(), "list", params] as const,
  },
};

/**
 * Base query options for API-Handball hooks
 */
export type UseApiHandballQueryOptions<TData, TParams = void> = Omit<
  UseQueryOptions<ApiHandballResponse<TData>>,
  "queryKey" | "queryFn"
> & {
  params?: TParams;
};

/**
 * Query options with required params
 */
export type UseApiHandballQueryOptionsRequired<TData, TParams> = Omit<
  UseQueryOptions<ApiHandballResponse<TData>>,
  "queryKey" | "queryFn"
> & {
  params: TParams;
};
