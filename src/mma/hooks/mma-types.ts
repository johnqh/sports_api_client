/**
 * @module hooks/mma-types
 * @description Type definitions for API-MMA hooks
 */

import type { UseQueryOptions } from "@tanstack/react-query";
import type { ApiMmaResponse } from "../types";

export interface UseApiMmaQueryOptions<TData, TParams = void> extends Omit<
  UseQueryOptions<ApiMmaResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  params?: TParams;
}

export interface UseApiMmaQueryOptionsRequired<TData, TParams> extends Omit<
  UseQueryOptions<ApiMmaResponse<TData>, Error>,
  "queryKey" | "queryFn"
> {
  params: TParams;
}

const MMA_BASE_KEY = ["api-mma"] as const;

export const apiMmaKeys = {
  all: MMA_BASE_KEY,

  timezone: () => [...MMA_BASE_KEY, "timezone"] as const,
  countries: {
    all: [...MMA_BASE_KEY, "countries"] as const,
    list: (params?: object) =>
      [...MMA_BASE_KEY, "countries", params ?? {}] as const,
  },
  seasons: {
    all: [...MMA_BASE_KEY, "seasons"] as const,
    list: (params?: object) =>
      [...MMA_BASE_KEY, "seasons", params ?? {}] as const,
  },

  categories: {
    all: [...MMA_BASE_KEY, "categories"] as const,
    list: (params?: object) =>
      [...MMA_BASE_KEY, "categories", params ?? {}] as const,
  },

  fighters: {
    all: [...MMA_BASE_KEY, "fighters"] as const,
    list: (params?: object) =>
      [...MMA_BASE_KEY, "fighters", params ?? {}] as const,
  },

  fights: {
    all: [...MMA_BASE_KEY, "fights"] as const,
    list: (params?: object) =>
      [...MMA_BASE_KEY, "fights", params ?? {}] as const,
  },
} as const;
