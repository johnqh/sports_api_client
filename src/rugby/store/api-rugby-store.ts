/**
 * @module api-rugby-store
 * @description Zustand store for API-Rugby data caching
 */

import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import type {
  RugbyCountry,
  RugbyGame,
  RugbyLeagueResponse,
  RugbyStanding,
  RugbyTeamResponse,
  RugbyTeamStatistics,
} from "../types";
import {
  CachedData,
  isCacheValid as checkCacheValid,
  createCacheEntry,
  DEFAULT_CACHE_TTL,
  StorageAdapter,
} from "../../utils/cache-utils";

/**
 * API Rugby Store State interface
 */
export interface ApiRugbyState {
  // ============================================================================
  // Cached Data
  // ============================================================================

  /** Cached countries */
  countries: CachedData<RugbyCountry[]> | null;

  /** Cached timezones */
  timezones: CachedData<string[]> | null;

  /** Cached seasons */
  seasons: CachedData<number[]> | null;

  /** Cached leagues by key */
  leagues: Map<string, CachedData<RugbyLeagueResponse[]>>;

  /** Cached teams by key */
  teams: Map<string, CachedData<RugbyTeamResponse[]>>;

  /** Cached team statistics by key */
  teamStatistics: Map<string, CachedData<RugbyTeamStatistics>>;

  /** Cached games by key */
  games: Map<string, CachedData<RugbyGame[]>>;

  /** Cached standings by key */
  standings: Map<string, CachedData<RugbyStanding[]>>;

  // ============================================================================
  // Cache Settings
  // ============================================================================

  /** Global cache TTL in milliseconds */
  cacheTTL: number;

  // ============================================================================
  // Actions
  // ============================================================================

  // Setters for single-value caches
  setCountries: (data: RugbyCountry[]) => void;
  setTimezones: (data: string[]) => void;
  setSeasons: (data: number[]) => void;

  // Setters for keyed caches
  setLeagues: (key: string, data: RugbyLeagueResponse[]) => void;
  setTeams: (key: string, data: RugbyTeamResponse[]) => void;
  setTeamStatistics: (key: string, data: RugbyTeamStatistics) => void;
  setGames: (key: string, data: RugbyGame[]) => void;
  setStandings: (key: string, data: RugbyStanding[]) => void;

  // Getters for keyed caches (returns null if not found or expired)
  getLeagues: (key: string) => RugbyLeagueResponse[] | null;
  getTeams: (key: string) => RugbyTeamResponse[] | null;
  getTeamStatistics: (key: string) => RugbyTeamStatistics | null;
  getGames: (key: string) => RugbyGame[] | null;
  getStandings: (key: string) => RugbyStanding[] | null;

  // Cache utilities
  isCacheValid: (timestamp: number) => boolean;
  clearCache: () => void;
  setCacheTTL: (ttl: number) => void;
}

/**
 * Create the store state and actions
 */
const createStoreSlice: StateCreator<ApiRugbyState> = (set, get) => ({
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
type ApiRugbyPersistOptions = PersistOptions<
  ApiRugbyState,
  Partial<ApiRugbyState>
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
 * Create an API Rugby store with persistence
 *
 * @param storage - Storage adapter for persistence
 * @returns Zustand store hook with API Rugby state
 */
export const createApiRugbyStore = (storage: StorageAdapter) => {
  const persistOptions: ApiRugbyPersistOptions = {
    name: "api-rugby-cache",
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

  return create<ApiRugbyState>()(persist(createStoreSlice, persistOptions));
};

/** Type for the store hook returned by createApiRugbyStore */
export type ApiRugbyStore = ReturnType<typeof createApiRugbyStore>;
