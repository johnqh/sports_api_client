/**
 * @module api-f1-store
 * @description Zustand store for API-Formula-1 data caching
 */

import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import type {
  F1Circuit,
  F1Competition,
  F1Driver,
  F1DriverRanking,
  F1PitStop,
  F1Race,
  F1Team,
  F1TeamRanking,
} from "../types";
import {
  CachedData,
  isCacheValid as checkCacheValid,
  createCacheEntry,
  DEFAULT_CACHE_TTL,
  StorageAdapter,
} from "../../utils/cache-utils";

/**
 * API F1 Store State interface
 */
export interface ApiF1State {
  // ============================================================================
  // Cached Data
  // ============================================================================

  /** Cached timezones */
  timezones: CachedData<string[]> | null;

  /** Cached seasons */
  seasons: CachedData<number[]> | null;

  /** Cached circuits by key */
  circuits: Map<string, CachedData<F1Circuit[]>>;

  /** Cached competitions by key */
  competitions: Map<string, CachedData<F1Competition[]>>;

  /** Cached teams by key */
  teams: Map<string, CachedData<F1Team[]>>;

  /** Cached drivers by key */
  drivers: Map<string, CachedData<F1Driver[]>>;

  /** Cached races by key */
  races: Map<string, CachedData<F1Race[]>>;

  /** Cached driver rankings by key */
  driverRankings: Map<string, CachedData<F1DriverRanking[]>>;

  /** Cached team rankings by key */
  teamRankings: Map<string, CachedData<F1TeamRanking[]>>;

  /** Cached pit stops by key */
  pitStops: Map<string, CachedData<F1PitStop[]>>;

  // ============================================================================
  // Cache Settings
  // ============================================================================

  /** Global cache TTL in milliseconds */
  cacheTTL: number;

  // ============================================================================
  // Actions
  // ============================================================================

  // Setters for single-value caches
  setTimezones: (data: string[]) => void;
  setSeasons: (data: number[]) => void;

  // Setters for keyed caches
  setCircuits: (key: string, data: F1Circuit[]) => void;
  setCompetitions: (key: string, data: F1Competition[]) => void;
  setTeams: (key: string, data: F1Team[]) => void;
  setDrivers: (key: string, data: F1Driver[]) => void;
  setRaces: (key: string, data: F1Race[]) => void;
  setDriverRankings: (key: string, data: F1DriverRanking[]) => void;
  setTeamRankings: (key: string, data: F1TeamRanking[]) => void;
  setPitStops: (key: string, data: F1PitStop[]) => void;

  // Getters for keyed caches (returns null if not found or expired)
  getCircuits: (key: string) => F1Circuit[] | null;
  getCompetitions: (key: string) => F1Competition[] | null;
  getTeams: (key: string) => F1Team[] | null;
  getDrivers: (key: string) => F1Driver[] | null;
  getRaces: (key: string) => F1Race[] | null;
  getDriverRankings: (key: string) => F1DriverRanking[] | null;
  getTeamRankings: (key: string) => F1TeamRanking[] | null;
  getPitStops: (key: string) => F1PitStop[] | null;

  // Cache utilities
  isCacheValid: (timestamp: number) => boolean;
  clearCache: () => void;
  setCacheTTL: (ttl: number) => void;
}

/**
 * Create the store state and actions
 */
const createStoreSlice: StateCreator<ApiF1State> = (set, get) => ({
  // Initial state
  timezones: null,
  seasons: null,
  circuits: new Map(),
  competitions: new Map(),
  teams: new Map(),
  drivers: new Map(),
  races: new Map(),
  driverRankings: new Map(),
  teamRankings: new Map(),
  pitStops: new Map(),
  cacheTTL: DEFAULT_CACHE_TTL,

  // Single-value setters
  setTimezones: (data) =>
    set({ timezones: createCacheEntry("timezones", data) }),

  setSeasons: (data) => set({ seasons: createCacheEntry("seasons", data) }),

  // Keyed setters
  setCircuits: (key, data) =>
    set((state) => {
      const newCircuits = new Map(state.circuits);
      newCircuits.set(key, createCacheEntry(key, data));
      return { circuits: newCircuits };
    }),

  setCompetitions: (key, data) =>
    set((state) => {
      const newCompetitions = new Map(state.competitions);
      newCompetitions.set(key, createCacheEntry(key, data));
      return { competitions: newCompetitions };
    }),

  setTeams: (key, data) =>
    set((state) => {
      const newTeams = new Map(state.teams);
      newTeams.set(key, createCacheEntry(key, data));
      return { teams: newTeams };
    }),

  setDrivers: (key, data) =>
    set((state) => {
      const newDrivers = new Map(state.drivers);
      newDrivers.set(key, createCacheEntry(key, data));
      return { drivers: newDrivers };
    }),

  setRaces: (key, data) =>
    set((state) => {
      const newRaces = new Map(state.races);
      newRaces.set(key, createCacheEntry(key, data));
      return { races: newRaces };
    }),

  setDriverRankings: (key, data) =>
    set((state) => {
      const newRankings = new Map(state.driverRankings);
      newRankings.set(key, createCacheEntry(key, data));
      return { driverRankings: newRankings };
    }),

  setTeamRankings: (key, data) =>
    set((state) => {
      const newRankings = new Map(state.teamRankings);
      newRankings.set(key, createCacheEntry(key, data));
      return { teamRankings: newRankings };
    }),

  setPitStops: (key, data) =>
    set((state) => {
      const newPitStops = new Map(state.pitStops);
      newPitStops.set(key, createCacheEntry(key, data));
      return { pitStops: newPitStops };
    }),

  // Keyed getters (return null if not found or expired)
  getCircuits: (key) => {
    const cached = get().circuits.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getCompetitions: (key) => {
    const cached = get().competitions.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getTeams: (key) => {
    const cached = get().teams.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getDrivers: (key) => {
    const cached = get().drivers.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getRaces: (key) => {
    const cached = get().races.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getDriverRankings: (key) => {
    const cached = get().driverRankings.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getTeamRankings: (key) => {
    const cached = get().teamRankings.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getPitStops: (key) => {
    const cached = get().pitStops.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  // Cache utilities
  isCacheValid: (timestamp) => checkCacheValid(timestamp, get().cacheTTL),

  clearCache: () =>
    set({
      timezones: null,
      seasons: null,
      circuits: new Map(),
      competitions: new Map(),
      teams: new Map(),
      drivers: new Map(),
      races: new Map(),
      driverRankings: new Map(),
      teamRankings: new Map(),
      pitStops: new Map(),
    }),

  setCacheTTL: (ttl) => set({ cacheTTL: ttl }),
});

/**
 * Persist options type
 */
type ApiF1PersistOptions = PersistOptions<ApiF1State, Partial<ApiF1State>>;

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
        "circuits",
        "competitions",
        "teams",
        "drivers",
        "races",
        "driverRankings",
        "teamRankings",
        "pitStops",
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
 * Create an API F1 store with persistence
 *
 * @param storage - Storage adapter for persistence
 * @returns Zustand store hook with API F1 state
 */
export const createApiF1Store = (storage: StorageAdapter) => {
  const persistOptions: ApiF1PersistOptions = {
    name: "api-f1-cache",
    storage: createCustomStorage(storage),
    partialize: (state) => ({
      timezones: state.timezones,
      seasons: state.seasons,
      circuits: state.circuits,
      competitions: state.competitions,
      teams: state.teams,
      drivers: state.drivers,
      races: state.races,
      driverRankings: state.driverRankings,
      teamRankings: state.teamRankings,
      pitStops: state.pitStops,
      cacheTTL: state.cacheTTL,
    }),
  };

  return create<ApiF1State>()(persist(createStoreSlice, persistOptions));
};

/** Type for the store hook returned by createApiF1Store */
export type ApiF1Store = ReturnType<typeof createApiF1Store>;
