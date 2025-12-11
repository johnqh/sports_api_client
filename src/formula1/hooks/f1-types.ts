/**
 * @module hooks/f1-types
 * @description Type definitions for API-Formula-1 hooks
 */

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiF1Response } from "../types";

/**
 * Base options for all API-Formula-1 hooks
 */
export interface UseApiF1QueryOptions<TData, TParams = void> extends Omit<
  UseQueryOptions<ApiF1Response<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call */
  params?: TParams;
}

/**
 * Options for hooks with required parameters
 */
export interface UseApiF1QueryOptionsRequired<TData, TParams> extends Omit<
  UseQueryOptions<ApiF1Response<TData>, Error>,
  "queryKey" | "queryFn"
> {
  /** Parameters for the API call (required) */
  params: TParams;
}

// Base key for all API-Formula-1 queries
const F1_BASE_KEY = ["api-f1"] as const;

/**
 * Query keys namespace for all API-Formula-1 queries
 */
export const apiF1Keys = {
  all: F1_BASE_KEY,

  // General
  timezone: () => [...F1_BASE_KEY, "timezone"] as const,
  seasons: {
    all: [...F1_BASE_KEY, "seasons"] as const,
    list: (params?: object) =>
      [...F1_BASE_KEY, "seasons", params ?? {}] as const,
  },

  // Circuits
  circuits: {
    all: [...F1_BASE_KEY, "circuits"] as const,
    list: (params?: object) =>
      [...F1_BASE_KEY, "circuits", params ?? {}] as const,
  },

  // Competitions
  competitions: {
    all: [...F1_BASE_KEY, "competitions"] as const,
    list: (params?: object) =>
      [...F1_BASE_KEY, "competitions", params ?? {}] as const,
  },

  // Teams
  teams: {
    all: [...F1_BASE_KEY, "teams"] as const,
    list: (params?: object) => [...F1_BASE_KEY, "teams", params ?? {}] as const,
  },

  // Drivers
  drivers: {
    all: [...F1_BASE_KEY, "drivers"] as const,
    list: (params?: object) =>
      [...F1_BASE_KEY, "drivers", params ?? {}] as const,
  },

  // Races
  races: {
    all: [...F1_BASE_KEY, "races"] as const,
    list: (params?: object) => [...F1_BASE_KEY, "races", params ?? {}] as const,
  },

  // Rankings
  rankings: {
    drivers: (params: object) =>
      [...F1_BASE_KEY, "rankings-drivers", params] as const,
    teams: (params: object) =>
      [...F1_BASE_KEY, "rankings-teams", params] as const,
  },

  // Pit Stops
  pitStops: {
    all: [...F1_BASE_KEY, "pitstops"] as const,
    list: (params: object) => [...F1_BASE_KEY, "pitstops", params] as const,
  },
} as const;
