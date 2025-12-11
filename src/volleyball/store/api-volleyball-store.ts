/**
 * @module api-volleyball-store
 * @description Zustand store for API-Volleyball data caching
 */

import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import type {
  VolleyballCountry,
  VolleyballGame,
  VolleyballLeagueResponse,
  VolleyballStandingsResponse,
  VolleyballTeamResponse,
} from "../types";
import {
  CachedData,
  isCacheValid as checkCacheValid,
  createCacheEntry,
  DEFAULT_CACHE_TTL,
  StorageAdapter,
} from "../../utils/cache-utils";

/**
 * API Volleyball Store State interface
 */
export interface ApiVolleyballState {
  /** Cached countries */
  countries: CachedData<VolleyballCountry[]> | null;

  /** Cached timezones */
  timezones: CachedData<string[]> | null;

  /** Cached seasons */
  seasons: CachedData<number[]> | null;

  /** Cached leagues by key */
  leagues: Map<string, CachedData<VolleyballLeagueResponse[]>>;

  /** Cached teams by key */
  teams: Map<string, CachedData<VolleyballTeamResponse[]>>;

  /** Cached standings by key */
  standings: Map<string, CachedData<VolleyballStandingsResponse[]>>;

  /** Cached games by key */
  games: Map<string, CachedData<VolleyballGame[]>>;

  /** Cached h2h by key */
  h2h: Map<string, CachedData<VolleyballGame[]>>;

  /** Global cache TTL in milliseconds */
  cacheTTL: number;

  // Single-value setters
  setCountries: (data: VolleyballCountry[]) => void;
  setTimezones: (data: string[]) => void;
  setSeasons: (data: number[]) => void;

  // Keyed setters
  setLeagues: (key: string, data: VolleyballLeagueResponse[]) => void;
  setTeams: (key: string, data: VolleyballTeamResponse[]) => void;
  setStandings: (key: string, data: VolleyballStandingsResponse[]) => void;
  setGames: (key: string, data: VolleyballGame[]) => void;
  setH2H: (key: string, data: VolleyballGame[]) => void;

  // Keyed getters (returns null if not found or expired)
  getLeagues: (key: string) => VolleyballLeagueResponse[] | null;
  getTeams: (key: string) => VolleyballTeamResponse[] | null;
  getStandings: (key: string) => VolleyballStandingsResponse[] | null;
  getGames: (key: string) => VolleyballGame[] | null;
  getH2H: (key: string) => VolleyballGame[] | null;

  // Cache utilities
  isCacheValid: (timestamp: number) => boolean;
  clearCache: () => void;
  setCacheTTL: (ttl: number) => void;
}

/**
 * Create the store state and actions
 */
const createStoreSlice: StateCreator<ApiVolleyballState> = (set, get) => ({
  // Initial state
  countries: null,
  timezones: null,
  seasons: null,
  leagues: new Map(),
  teams: new Map(),
  standings: new Map(),
  games: new Map(),
  h2h: new Map(),
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

  setStandings: (key, data) =>
    set((state) => {
      const newStandings = new Map(state.standings);
      newStandings.set(key, createCacheEntry(key, data));
      return { standings: newStandings };
    }),

  setGames: (key, data) =>
    set((state) => {
      const newGames = new Map(state.games);
      newGames.set(key, createCacheEntry(key, data));
      return { games: newGames };
    }),

  setH2H: (key, data) =>
    set((state) => {
      const newH2H = new Map(state.h2h);
      newH2H.set(key, createCacheEntry(key, data));
      return { h2h: newH2H };
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

  getStandings: (key) => {
    const cached = get().standings.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getGames: (key) => {
    const cached = get().games.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getH2H: (key) => {
    const cached = get().h2h.get(key);
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
      standings: new Map(),
      games: new Map(),
      h2h: new Map(),
    }),

  setCacheTTL: (ttl) => set({ cacheTTL: ttl }),
});

/**
 * Persist options type
 */
type ApiVolleyballPersistOptions = PersistOptions<
  ApiVolleyballState,
  Partial<ApiVolleyballState>
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
      const mapFields = ["leagues", "teams", "standings", "games", "h2h"];

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
 * Create an API Volleyball store with persistence
 */
export const createApiVolleyballStore = (storage: StorageAdapter) => {
  const persistOptions: ApiVolleyballPersistOptions = {
    name: "api-volleyball-cache",
    storage: createCustomStorage(storage),
    partialize: (state) => ({
      countries: state.countries,
      timezones: state.timezones,
      seasons: state.seasons,
      leagues: state.leagues,
      teams: state.teams,
      standings: state.standings,
      games: state.games,
      h2h: state.h2h,
      cacheTTL: state.cacheTTL,
    }),
  };

  return create<ApiVolleyballState>()(
    persist(createStoreSlice, persistOptions),
  );
};

/** Type for the store hook returned by createApiVolleyballStore */
export type ApiVolleyballStore = ReturnType<typeof createApiVolleyballStore>;
