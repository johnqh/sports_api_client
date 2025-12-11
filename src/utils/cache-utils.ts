/**
 * @module cache-utils
 * @description Cache utility functions for timestamp-based cache invalidation
 *
 * Provides utilities for managing cached API-Football data including:
 * - Cache entry creation with timestamps
 * - TTL-based cache validation
 * - Cache key generation from parameters
 * - Cross-platform storage adapters via DI StorageService
 *
 * @example
 * ```typescript
 * import { isCacheValid, generateCacheKey, DEFAULT_CACHE_TTL } from "@sudobility/sports_api_client";
 *
 * const key = generateCacheKey("leagues", { country: "England" });
 * const isValid = isCacheValid(timestamp, DEFAULT_CACHE_TTL);
 * ```
 */

import type { StorageService } from "@sudobility/di";
import type { Optional } from "@sudobility/types";

/**
 * Query key factory type for consistent cache key generation
 */
export type QueryKeyFactory<TParams = void> = TParams extends void
  ? readonly string[]
  : (params: TParams) => readonly (string | TParams)[];

/**
 * Default cache TTL in milliseconds (5 minutes)
 *
 * @constant {number}
 * @default 300000
 */
export const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Cached data wrapper with timestamp for cache invalidation
 *
 * @template T - The type of data being cached
 *
 * @example
 * ```typescript
 * const cached: CachedData<LeagueResponse[]> = {
 *   data: leagues,
 *   timestamp: Date.now(),
 *   key: "leagues:country=England",
 * };
 * ```
 */
export interface CachedData<T> {
  /** The cached data */
  data: T;
  /** Timestamp when data was cached (Unix milliseconds) */
  timestamp: number;
  /** Cache key for identification */
  key: string;
}

/**
 * Create a cache entry with current timestamp
 *
 * @template T - The type of data being cached
 * @param key - Unique identifier for the cache entry
 * @param data - The data to cache
 * @returns CachedData object with timestamp set to current time
 *
 * @example
 * ```typescript
 * const entry = createCacheEntry("leagues:england", leaguesData);
 * console.log(entry.timestamp); // Current Unix timestamp
 * ```
 */
export const createCacheEntry = <T>(key: string, data: T): CachedData<T> => ({
  data,
  timestamp: Date.now(),
  key,
});

/**
 * Check if cached data is still valid based on TTL
 *
 * @param timestamp - The timestamp when the data was cached
 * @param ttl - Time-to-live in milliseconds (defaults to DEFAULT_CACHE_TTL)
 * @returns True if the cache is still valid, false if expired
 *
 * @example
 * ```typescript
 * const cached = store.leagues.get("england");
 * if (cached && isCacheValid(cached.timestamp)) {
 *   return cached.data; // Use cached data
 * }
 * // Fetch fresh data
 * ```
 */
export const isCacheValid = (
  timestamp: number,
  ttl: number = DEFAULT_CACHE_TTL,
): boolean => {
  const now = Date.now();
  return now - timestamp < ttl;
};

/**
 * Get remaining TTL for a cache entry in milliseconds
 *
 * @param timestamp - The timestamp when the data was cached
 * @param ttl - Time-to-live in milliseconds (defaults to DEFAULT_CACHE_TTL)
 * @returns Remaining time in milliseconds (0 if expired)
 *
 * @example
 * ```typescript
 * const remaining = getRemainingTTL(cached.timestamp);
 * console.log(`Cache expires in ${remaining / 1000} seconds`);
 * ```
 */
export const getRemainingTTL = (
  timestamp: number,
  ttl: number = DEFAULT_CACHE_TTL,
): number => {
  const remaining = ttl - (Date.now() - timestamp);
  return Math.max(0, remaining);
};

/**
 * Generate a cache key from a prefix and optional parameters
 *
 * Creates deterministic cache keys by sorting parameters alphabetically.
 * Undefined and null values are filtered out.
 *
 * @param prefix - The base key prefix (e.g., "leagues", "fixtures")
 * @param params - Optional parameters to include in the key
 * @returns A unique cache key string
 *
 * @example
 * ```typescript
 * generateCacheKey("leagues"); // "leagues"
 * generateCacheKey("leagues", { country: "England" }); // "leagues:country=England"
 * generateCacheKey("fixtures", { team: 33, season: 2023 }); // "fixtures:season=2023&team=33"
 * generateCacheKey("leagues", { country: "England", type: undefined }); // "leagues:country=England"
 * ```
 */
export const generateCacheKey = (
  prefix: string,
  params?: Optional<Record<string, unknown>>,
): string => {
  if (!params || Object.keys(params).length === 0) {
    return prefix;
  }

  const sortedParams = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null)
    .sort()
    .map((key) => `${key}=${String(params[key])}`)
    .join("&");

  return sortedParams ? `${prefix}:${sortedParams}` : prefix;
};

/**
 * Storage adapter interface for cross-platform persistence
 *
 * This interface is compatible with StorageService from @sudobility/di.
 * Use createStorageAdapter() to convert a DI StorageService to this interface.
 *
 * @example
 * ```typescript
 * // Using DI StorageService (recommended)
 * import { StorageService } from "@sudobility/di";
 *
 * const adapter = createStorageAdapter(storageService);
 * const store = createApiFootballStore(adapter);
 * ```
 */
export interface StorageAdapter {
  /** Retrieve an item from storage */
  getItem: (name: string) => Promise<string | null> | string | null;
  /** Store an item in storage */
  setItem: (name: string, value: string) => Promise<void> | void;
  /** Remove an item from storage */
  removeItem: (name: string) => Promise<void> | void;
}

/**
 * Create a StorageAdapter from a DI StorageService
 *
 * Adapts the StorageService interface from @sudobility/di to work with
 * the Zustand persist middleware. This is the recommended way to provide
 * storage for cross-platform React/React Native compatibility.
 *
 * @param storageService - StorageService instance from DI container
 * @returns StorageAdapter compatible with Zustand persist
 *
 * @example
 * ```typescript
 * // In your app setup
 * import { StorageService } from "@sudobility/di";
 *
 * // Get storage service from your DI container
 * const storageService = container.get<StorageService>(ServiceKeys.STORAGE);
 *
 * // Create adapter and store
 * const adapter = createStorageAdapter(storageService);
 * const useStore = createApiFootballStore(adapter);
 * ```
 */
export const createStorageAdapter = (
  storageService: StorageService,
): StorageAdapter => ({
  getItem: async (name: string) => {
    const value = await storageService.getItem(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => storageService.setItem(name, value),
  removeItem: (name: string) => storageService.removeItem(name),
});
