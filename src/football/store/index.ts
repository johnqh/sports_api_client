/**
 * Store module exports
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
