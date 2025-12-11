/**
 * @module api-hockey-store
 * @description Zustand store for API-Hockey data caching
 *
 * Provides local caching with timestamps for cache invalidation.
 * Supports persistence via zustand/middleware persist with custom
 * serialization for Map data structures.
 *
 * @example
 * ```typescript
 * import {
 *   createApiHockeyStore,
 *   generateCacheKey,
 * } from "@sudobility/sports_api_client";
 *
 * const useStore = createApiHockeyStore({
 *   getItem: AsyncStorage.getItem,
 *   setItem: AsyncStorage.setItem,
 *   removeItem: AsyncStorage.removeItem,
 * });
 *
 * const store = useStore.getState();
 * const cacheKey = generateCacheKey("leagues", { country: "USA" });
 * const cached = store.getLeagues(cacheKey);
 * ```
 */

import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import type {
  HockeyCountry,
  HockeyGame,
  HockeyGameStatistics,
  HockeyLeagueResponse,
  HockeyStanding,
  HockeyTeamResponse,
  HockeyTeamStatistics,
} from "../types";
import {
  CachedData,
  isCacheValid as checkCacheValid,
  createCacheEntry,
  DEFAULT_CACHE_TTL,
  StorageAdapter,
} from "../../utils/cache-utils";

/**
 * API Hockey Store State interface
 */
export interface ApiHockeyState {
  // ============================================================================
  // Cached Data
  // ============================================================================

  /** Cached countries */
  countries: CachedData<HockeyCountry[]> | null;

  /** Cached timezones */
  timezones: CachedData<string[]> | null;

  /** Cached seasons */
  seasons: CachedData<number[]> | null;

  /** Cached leagues by key */
  leagues: Map<string, CachedData<HockeyLeagueResponse[]>>;

  /** Cached teams by key */
  teams: Map<string, CachedData<HockeyTeamResponse[]>>;

  /** Cached team statistics by key */
  teamStatistics: Map<string, CachedData<HockeyTeamStatistics>>;

  /** Cached games by key */
  games: Map<string, CachedData<HockeyGame[]>>;

  /** Cached game statistics by key */
  gameStatistics: Map<string, CachedData<HockeyGameStatistics[]>>;

  /** Cached standings by key */
  standings: Map<string, CachedData<HockeyStanding[]>>;

  // ============================================================================
  // Cache Settings
  // ============================================================================

  /** Global cache TTL in milliseconds */
  cacheTTL: number;

  // ============================================================================
  // Actions
  // ============================================================================

  // Setters for single-value caches
  setCountries: (data: HockeyCountry[]) => void;
  setTimezones: (data: string[]) => void;
  setSeasons: (data: number[]) => void;

  // Setters for keyed caches
  setLeagues: (key: string, data: HockeyLeagueResponse[]) => void;
  setTeams: (key: string, data: HockeyTeamResponse[]) => void;
  setTeamStatistics: (key: string, data: HockeyTeamStatistics) => void;
  setGames: (key: string, data: HockeyGame[]) => void;
  setGameStatistics: (key: string, data: HockeyGameStatistics[]) => void;
  setStandings: (key: string, data: HockeyStanding[]) => void;

  // Getters for keyed caches (returns null if not found or expired)
  getLeagues: (key: string) => HockeyLeagueResponse[] | null;
  getTeams: (key: string) => HockeyTeamResponse[] | null;
  getTeamStatistics: (key: string) => HockeyTeamStatistics | null;
  getGames: (key: string) => HockeyGame[] | null;
  getGameStatistics: (key: string) => HockeyGameStatistics[] | null;
  getStandings: (key: string) => HockeyStanding[] | null;

  // Cache utilities
  isCacheValid: (timestamp: number) => boolean;
  clearCache: () => void;
  setCacheTTL: (ttl: number) => void;
}

/**
 * Create the store state and actions
 */
const createStoreSlice: StateCreator<ApiHockeyState> = (set, get) => ({
  // Initial state
  countries: null,
  timezones: null,
  seasons: null,
  leagues: new Map(),
  teams: new Map(),
  teamStatistics: new Map(),
  games: new Map(),
  gameStatistics: new Map(),
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

  setGameStatistics: (key, data) =>
    set((state) => {
      const newStats = new Map(state.gameStatistics);
      newStats.set(key, createCacheEntry(key, data));
      return { gameStatistics: newStats };
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

  getGameStatistics: (key) => {
    const cached = get().gameStatistics.get(key);
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
      gameStatistics: new Map(),
      standings: new Map(),
    }),

  setCacheTTL: (ttl) => set({ cacheTTL: ttl }),
});

/**
 * Persist options type
 */
type ApiHockeyPersistOptions = PersistOptions<
  ApiHockeyState,
  Partial<ApiHockeyState>
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
        "gameStatistics",
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
 * Create an API Hockey store with persistence
 *
 * @param storage - Storage adapter for persistence
 * @returns Zustand store hook with API Hockey state
 */
export const createApiHockeyStore = (storage: StorageAdapter) => {
  const persistOptions: ApiHockeyPersistOptions = {
    name: "api-hockey-cache",
    storage: createCustomStorage(storage),
    partialize: (state) => ({
      countries: state.countries,
      timezones: state.timezones,
      seasons: state.seasons,
      leagues: state.leagues,
      teams: state.teams,
      teamStatistics: state.teamStatistics,
      games: state.games,
      gameStatistics: state.gameStatistics,
      standings: state.standings,
      cacheTTL: state.cacheTTL,
    }),
  };

  return create<ApiHockeyState>()(persist(createStoreSlice, persistOptions));
};

/** Type for the store hook returned by createApiHockeyStore */
export type ApiHockeyStore = ReturnType<typeof createApiHockeyStore>;
