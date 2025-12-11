/**
 * @module api-handball-store
 * @description Zustand store for API-Handball data caching
 */

import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import type {
  HandballCountry,
  HandballGame,
  HandballLeagueResponse,
  HandballOdds,
  HandballStandingsResponse,
  HandballTeamResponse,
} from "../types";
import {
  CachedData,
  isCacheValid as checkCacheValid,
  createCacheEntry,
  DEFAULT_CACHE_TTL,
  StorageAdapter,
} from "../../utils/cache-utils";

/**
 * API Handball Store State interface
 */
export interface ApiHandballState {
  /** Cached countries */
  countries: CachedData<HandballCountry[]> | null;

  /** Cached timezones */
  timezones: CachedData<string[]> | null;

  /** Cached seasons */
  seasons: CachedData<number[]> | null;

  /** Cached leagues by key */
  leagues: Map<string, CachedData<HandballLeagueResponse[]>>;

  /** Cached teams by key */
  teams: Map<string, CachedData<HandballTeamResponse[]>>;

  /** Cached standings by key */
  standings: Map<string, CachedData<HandballStandingsResponse[]>>;

  /** Cached games by key */
  games: Map<string, CachedData<HandballGame[]>>;

  /** Cached h2h by key */
  h2h: Map<string, CachedData<HandballGame[]>>;

  /** Cached odds by key */
  odds: Map<string, CachedData<HandballOdds[]>>;

  /** Global cache TTL in milliseconds */
  cacheTTL: number;

  // Single-value setters
  setCountries: (data: HandballCountry[]) => void;
  setTimezones: (data: string[]) => void;
  setSeasons: (data: number[]) => void;

  // Keyed setters
  setLeagues: (key: string, data: HandballLeagueResponse[]) => void;
  setTeams: (key: string, data: HandballTeamResponse[]) => void;
  setStandings: (key: string, data: HandballStandingsResponse[]) => void;
  setGames: (key: string, data: HandballGame[]) => void;
  setH2H: (key: string, data: HandballGame[]) => void;
  setOdds: (key: string, data: HandballOdds[]) => void;

  // Keyed getters (returns null if not found or expired)
  getLeagues: (key: string) => HandballLeagueResponse[] | null;
  getTeams: (key: string) => HandballTeamResponse[] | null;
  getStandings: (key: string) => HandballStandingsResponse[] | null;
  getGames: (key: string) => HandballGame[] | null;
  getH2H: (key: string) => HandballGame[] | null;
  getOdds: (key: string) => HandballOdds[] | null;

  // Cache utilities
  isCacheValid: (timestamp: number) => boolean;
  clearCache: () => void;
  setCacheTTL: (ttl: number) => void;
}

/**
 * Create the store state and actions
 */
const createStoreSlice: StateCreator<ApiHandballState> = (set, get) => ({
  // Initial state
  countries: null,
  timezones: null,
  seasons: null,
  leagues: new Map(),
  teams: new Map(),
  standings: new Map(),
  games: new Map(),
  h2h: new Map(),
  odds: new Map(),
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

  setOdds: (key, data) =>
    set((state) => {
      const newOdds = new Map(state.odds);
      newOdds.set(key, createCacheEntry(key, data));
      return { odds: newOdds };
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

  getOdds: (key) => {
    const cached = get().odds.get(key);
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
      odds: new Map(),
    }),

  setCacheTTL: (ttl) => set({ cacheTTL: ttl }),
});

/**
 * Persist options type
 */
type ApiHandballPersistOptions = PersistOptions<
  ApiHandballState,
  Partial<ApiHandballState>
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
        "standings",
        "games",
        "h2h",
        "odds",
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
 * Create an API Handball store with persistence
 */
export const createApiHandballStore = (storage: StorageAdapter) => {
  const persistOptions: ApiHandballPersistOptions = {
    name: "api-handball-cache",
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
      odds: state.odds,
      cacheTTL: state.cacheTTL,
    }),
  };

  return create<ApiHandballState>()(persist(createStoreSlice, persistOptions));
};

/** Type for the store hook returned by createApiHandballStore */
export type ApiHandballStore = ReturnType<typeof createApiHandballStore>;
