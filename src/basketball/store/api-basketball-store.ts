/**
 * @module api-basketball-store
 * @description Zustand store for API-Basketball data caching
 *
 * Provides local caching with timestamps for cache invalidation.
 * Supports persistence via zustand/middleware persist with custom
 * serialization for Map data structures.
 *
 * @example
 * ```typescript
 * import {
 *   createApiBasketballStore,
 *   generateCacheKey,
 * } from "@sudobility/sports_api_client";
 *
 * // Create store with custom storage (React Native)
 * import AsyncStorage from "@react-native-async-storage/async-storage";
 * const useStore = createApiBasketballStore({
 *   getItem: AsyncStorage.getItem,
 *   setItem: AsyncStorage.setItem,
 *   removeItem: AsyncStorage.removeItem,
 * });
 *
 * // Use the store
 * const store = useStore.getState();
 * const cacheKey = generateCacheKey("leagues", { country: "USA" });
 * const cached = store.getLeagues(cacheKey);
 * ```
 */

import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import type {
  BasketballCountry,
  BasketballGame,
  BasketballLeagueResponse,
  BasketballStanding,
  BasketballTeamResponse,
  BasketballTeamStatistics,
} from "../types";
import {
  CachedData,
  isCacheValid as checkCacheValid,
  createCacheEntry,
  DEFAULT_CACHE_TTL,
  StorageAdapter,
} from "../../utils/cache-utils";

/**
 * API Basketball Store State interface
 *
 * Defines the complete state shape for the API-Basketball cache store,
 * including all cached data types, setters, getters, and utilities.
 */
export interface ApiBasketballState {
  // ============================================================================
  // Cached Data
  // ============================================================================

  /** Cached countries */
  countries: CachedData<BasketballCountry[]> | null;

  /** Cached timezones */
  timezones: CachedData<string[]> | null;

  /** Cached seasons */
  seasons: CachedData<string[]> | null;

  /** Cached leagues by key */
  leagues: Map<string, CachedData<BasketballLeagueResponse[]>>;

  /** Cached teams by key */
  teams: Map<string, CachedData<BasketballTeamResponse[]>>;

  /** Cached team statistics by key */
  teamStatistics: Map<string, CachedData<BasketballTeamStatistics>>;

  /** Cached games by key */
  games: Map<string, CachedData<BasketballGame[]>>;

  /** Cached standings by key */
  standings: Map<string, CachedData<BasketballStanding[]>>;

  // ============================================================================
  // Cache Settings
  // ============================================================================

  /** Global cache TTL in milliseconds */
  cacheTTL: number;

  // ============================================================================
  // Actions
  // ============================================================================

  // Setters for single-value caches
  setCountries: (data: BasketballCountry[]) => void;
  setTimezones: (data: string[]) => void;
  setSeasons: (data: string[]) => void;

  // Setters for keyed caches
  setLeagues: (key: string, data: BasketballLeagueResponse[]) => void;
  setTeams: (key: string, data: BasketballTeamResponse[]) => void;
  setTeamStatistics: (key: string, data: BasketballTeamStatistics) => void;
  setGames: (key: string, data: BasketballGame[]) => void;
  setStandings: (key: string, data: BasketballStanding[]) => void;

  // Getters for keyed caches (returns null if not found or expired)
  getLeagues: (key: string) => BasketballLeagueResponse[] | null;
  getTeams: (key: string) => BasketballTeamResponse[] | null;
  getTeamStatistics: (key: string) => BasketballTeamStatistics | null;
  getGames: (key: string) => BasketballGame[] | null;
  getStandings: (key: string) => BasketballStanding[] | null;

  // Cache utilities
  isCacheValid: (timestamp: number) => boolean;
  clearCache: () => void;
  setCacheTTL: (ttl: number) => void;
}

/**
 * Create the store state and actions
 */
const createStoreSlice: StateCreator<ApiBasketballState> = (set, get) => ({
  // Initial state
  countries: null,
  timezones: null,
  seasons: null,
  leagues: new Map(),
  teams: new Map(),
  teamStatistics: new Map(),
  games: new Map(),
  standings: new Map(),
  cacheTTL: DEFAULT_CACHE_TTL,

  // Single-value setters
  setCountries: (data) =>
    set({ countries: createCacheEntry("countries", data) }),

  setTimezones: (data) =>
    set({ timezones: createCacheEntry("timezones", data) }),

  setSeasons: (data) => set({ seasons: createCacheEntry("seasons", data) }),

  // Keyed setters
  setLeagues: (key, data) =>
    set((state) => {
      const newLeagues = new Map(state.leagues);
      newLeagues.set(key, createCacheEntry(key, data));
      return { leagues: newLeagues };
    }),

  setTeams: (key, data) =>
    set((state) => {
      const newTeams = new Map(state.teams);
      newTeams.set(key, createCacheEntry(key, data));
      return { teams: newTeams };
    }),

  setTeamStatistics: (key, data) =>
    set((state) => {
      const newStats = new Map(state.teamStatistics);
      newStats.set(key, createCacheEntry(key, data));
      return { teamStatistics: newStats };
    }),

  setGames: (key, data) =>
    set((state) => {
      const newGames = new Map(state.games);
      newGames.set(key, createCacheEntry(key, data));
      return { games: newGames };
    }),

  setStandings: (key, data) =>
    set((state) => {
      const newStandings = new Map(state.standings);
      newStandings.set(key, createCacheEntry(key, data));
      return { standings: newStandings };
    }),

  // Keyed getters (return null if not found or expired)
  getLeagues: (key) => {
    const cached = get().leagues.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getTeams: (key) => {
    const cached = get().teams.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getTeamStatistics: (key) => {
    const cached = get().teamStatistics.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getGames: (key) => {
    const cached = get().games.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getStandings: (key) => {
    const cached = get().standings.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  // Cache utilities
  isCacheValid: (timestamp) => checkCacheValid(timestamp, get().cacheTTL),

  clearCache: () =>
    set({
      countries: null,
      timezones: null,
      seasons: null,
      leagues: new Map(),
      teams: new Map(),
      teamStatistics: new Map(),
      games: new Map(),
      standings: new Map(),
    }),

  setCacheTTL: (ttl) => set({ cacheTTL: ttl }),
});

/**
 * Persist options type
 */
type ApiBasketballPersistOptions = PersistOptions<
  ApiBasketballState,
  Partial<ApiBasketballState>
>;

/**
 * Custom storage that handles Map serialization
 */
const createCustomStorage = (storage: StorageAdapter) => ({
  getItem: async (name: string) => {
    const value = await storage.getItem(name);
    if (!value) return null;

    try {
      const parsed = JSON.parse(value);

      // Restore Maps from arrays
      const mapFields = [
        "leagues",
        "teams",
        "teamStatistics",
        "games",
        "standings",
      ];

      for (const field of mapFields) {
        if (parsed.state && Array.isArray(parsed.state[field])) {
          parsed.state[field] = new Map(parsed.state[field]);
        }
      }

      return parsed;
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: unknown) => {
    const serialized = JSON.stringify(value, (_, val) => {
      // Convert Maps to arrays for JSON serialization
      if (val instanceof Map) {
        return Array.from(val.entries());
      }
      return val;
    });
    await storage.setItem(name, serialized);
  },
  removeItem: async (name: string) => {
    await storage.removeItem(name);
  },
});

/**
 * Create an API Basketball store with persistence
 *
 * Factory function that creates a new Zustand store instance with persistence.
 * The store automatically handles Map serialization for JSON storage.
 *
 * @param storage - Storage adapter for persistence
 * @returns Zustand store hook with API Basketball state
 *
 * @example
 * ```typescript
 * import { createApiBasketballStore, createStorageAdapter } from "@sudobility/sports_api_client";
 *
 * const storageService = container.get<StorageService>(ServiceKeys.STORAGE);
 * const useStore = createApiBasketballStore(createStorageAdapter(storageService));
 *
 * function MyComponent() {
 *   const leagues = useStore((state) => state.getLeagues("nba"));
 *   const setLeagues = useStore((state) => state.setLeagues);
 * }
 * ```
 */
export const createApiBasketballStore = (storage: StorageAdapter) => {
  const persistOptions: ApiBasketballPersistOptions = {
    name: "api-basketball-cache",
    storage: createCustomStorage(storage),
    partialize: (state) => ({
      countries: state.countries,
      timezones: state.timezones,
      seasons: state.seasons,
      leagues: state.leagues,
      teams: state.teams,
      teamStatistics: state.teamStatistics,
      games: state.games,
      standings: state.standings,
      cacheTTL: state.cacheTTL,
    }),
  };

  return create<ApiBasketballState>()(
    persist(createStoreSlice, persistOptions),
  );
};

/** Type for the store hook returned by createApiBasketballStore */
export type ApiBasketballStore = ReturnType<typeof createApiBasketballStore>;
