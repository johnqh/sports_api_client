/**
 * @fileoverview Store module exports.
 *
 * Re-exports the API-Football Zustand store factory and cache utilities.
 * Cache utilities from utils/cache-utils.ts are re-exported here for
 * convenience, as they are the primary way consumers access cache functions.
 */

export {
  createApiFootballStore,
  type ApiFootballState,
  type ApiFootballStore,
} from "./api-football-store";

export {
  DEFAULT_CACHE_TTL,
  createCacheEntry,
  isCacheValid,
  getRemainingTTL,
  generateCacheKey,
  createStorageAdapter,
  type CachedData,
  type StorageAdapter,
} from "../../utils/cache-utils";
