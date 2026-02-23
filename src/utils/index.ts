/**
 * @fileoverview Utility module exports.
 *
 * Provides shared utility functions for building URL query parameters
 * and cache management utilities for timestamp-based cache invalidation.
 */

export { createQueryParams, buildQueryString } from "./query-params";
export {
  DEFAULT_CACHE_TTL,
  createCacheEntry,
  isCacheValid,
  getRemainingTTL,
  generateCacheKey,
  createStorageAdapter,
  type CachedData,
  type StorageAdapter,
  type QueryKeyFactory,
} from "./cache-utils";
