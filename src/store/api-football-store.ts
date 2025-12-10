/**
 * @module api-football-store
 * @description Zustand store for API-Football data caching
 *
 * Provides local caching with timestamps for cache invalidation.
 * Supports persistence via zustand/middleware persist with custom
 * serialization for Map data structures.
 *
 * Features:
 * - Timestamp-based cache invalidation with configurable TTL
 * - Cross-platform storage via StorageAdapter interface
 * - Automatic Map serialization/deserialization for persistence
 * - Type-safe getters and setters for all cached data types
 *
 * @example
 * ```typescript
 * import {
 *   createApiFootballStore,
 *   generateCacheKey,
 * } from "@sudobility/sports_api_client";
 *
 * // Create store with custom storage (React Native)
 * import AsyncStorage from "@react-native-async-storage/async-storage";
 * const useStore = createApiFootballStore({
 *   getItem: AsyncStorage.getItem,
 *   setItem: AsyncStorage.setItem,
 *   removeItem: AsyncStorage.removeItem,
 * });
 *
 * // Use the store
 * const store = useStore.getState();
 * const cacheKey = generateCacheKey("leagues", { country: "England" });
 * const cached = store.getLeagues(cacheKey);
 * ```
 */

import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import type {
  Coach,
  Country,
  FixtureEvent,
  FixtureLineup,
  FixturePlayerStats,
  FixtureResponse,
  FixtureStatistics,
  LeagueResponse,
  PlayerResponse,
  Sidelined,
  SquadResponse,
  StandingsResponse,
  TeamResponse,
  TeamStatistics,
  TransferResponse,
  Trophy,
  Venue,
} from "../types";
import {
  CachedData,
  isCacheValid as checkCacheValid,
  createCacheEntry,
  DEFAULT_CACHE_TTL,
  StorageAdapter,
} from "./cache-utils";

/**
 * API Football Store State interface
 *
 * Defines the complete state shape for the API-Football cache store,
 * including all cached data types, setters, getters, and utilities.
 *
 * @interface ApiFootballState
 *
 * @example
 * ```typescript
 * const store = useApiFootballStore.getState();
 *
 * // Set cached data
 * store.setLeagues("england", leaguesData);
 *
 * // Get cached data (returns null if expired)
 * const leagues = store.getLeagues("england");
 *
 * // Check cache validity
 * const isValid = store.isCacheValid(timestamp);
 *
 * // Clear all cached data
 * store.clearCache();
 * ```
 */
export interface ApiFootballState {
  // ============================================================================
  // Cached Data
  // ============================================================================

  /** Cached countries */
  countries: CachedData<Country[]> | null;

  /** Cached timezones */
  timezones: CachedData<string[]> | null;

  /** Cached seasons */
  seasons: CachedData<number[]> | null;

  /** Cached leagues by key */
  leagues: Map<string, CachedData<LeagueResponse[]>>;

  /** Cached teams by key */
  teams: Map<string, CachedData<TeamResponse[]>>;

  /** Cached team statistics by key */
  teamStatistics: Map<string, CachedData<TeamStatistics>>;

  /** Cached venues by key */
  venues: Map<string, CachedData<Venue[]>>;

  /** Cached fixtures by key */
  fixtures: Map<string, CachedData<FixtureResponse[]>>;

  /** Cached fixture statistics by key */
  fixtureStatistics: Map<string, CachedData<FixtureStatistics[]>>;

  /** Cached fixture events by key */
  fixtureEvents: Map<string, CachedData<FixtureEvent[]>>;

  /** Cached fixture lineups by key */
  fixtureLineups: Map<string, CachedData<FixtureLineup[]>>;

  /** Cached fixture players by key */
  fixturePlayers: Map<string, CachedData<FixturePlayerStats[]>>;

  /** Cached standings by key */
  standings: Map<string, CachedData<StandingsResponse[]>>;

  /** Cached players by key */
  players: Map<string, CachedData<PlayerResponse[]>>;

  /** Cached squads by key */
  squads: Map<string, CachedData<SquadResponse[]>>;

  /** Cached transfers by key */
  transfers: Map<string, CachedData<TransferResponse[]>>;

  /** Cached coaches by key */
  coaches: Map<string, CachedData<Coach[]>>;

  /** Cached trophies by key */
  trophies: Map<string, CachedData<Trophy[]>>;

  /** Cached sidelined by key */
  sidelined: Map<string, CachedData<Sidelined[]>>;

  // ============================================================================
  // Cache Settings
  // ============================================================================

  /** Global cache TTL in milliseconds */
  cacheTTL: number;

  // ============================================================================
  // Actions
  // ============================================================================

  // Setters for single-value caches
  setCountries: (data: Country[]) => void;
  setTimezones: (data: string[]) => void;
  setSeasons: (data: number[]) => void;

  // Setters for keyed caches
  setLeagues: (key: string, data: LeagueResponse[]) => void;
  setTeams: (key: string, data: TeamResponse[]) => void;
  setTeamStatistics: (key: string, data: TeamStatistics) => void;
  setVenues: (key: string, data: Venue[]) => void;
  setFixtures: (key: string, data: FixtureResponse[]) => void;
  setFixtureStatistics: (key: string, data: FixtureStatistics[]) => void;
  setFixtureEvents: (key: string, data: FixtureEvent[]) => void;
  setFixtureLineups: (key: string, data: FixtureLineup[]) => void;
  setFixturePlayers: (key: string, data: FixturePlayerStats[]) => void;
  setStandings: (key: string, data: StandingsResponse[]) => void;
  setPlayers: (key: string, data: PlayerResponse[]) => void;
  setSquads: (key: string, data: SquadResponse[]) => void;
  setTransfers: (key: string, data: TransferResponse[]) => void;
  setCoaches: (key: string, data: Coach[]) => void;
  setTrophies: (key: string, data: Trophy[]) => void;
  setSidelined: (key: string, data: Sidelined[]) => void;

  // Getters for keyed caches (returns null if not found or expired)
  getLeagues: (key: string) => LeagueResponse[] | null;
  getTeams: (key: string) => TeamResponse[] | null;
  getTeamStatistics: (key: string) => TeamStatistics | null;
  getVenues: (key: string) => Venue[] | null;
  getFixtures: (key: string) => FixtureResponse[] | null;
  getFixtureStatistics: (key: string) => FixtureStatistics[] | null;
  getFixtureEvents: (key: string) => FixtureEvent[] | null;
  getFixtureLineups: (key: string) => FixtureLineup[] | null;
  getFixturePlayers: (key: string) => FixturePlayerStats[] | null;
  getStandings: (key: string) => StandingsResponse[] | null;
  getPlayers: (key: string) => PlayerResponse[] | null;
  getSquads: (key: string) => SquadResponse[] | null;
  getTransfers: (key: string) => TransferResponse[] | null;
  getCoaches: (key: string) => Coach[] | null;
  getTrophies: (key: string) => Trophy[] | null;
  getSidelined: (key: string) => Sidelined[] | null;

  // Cache utilities
  isCacheValid: (timestamp: number) => boolean;
  clearCache: () => void;
  setCacheTTL: (ttl: number) => void;
}

/**
 * Create the store state and actions
 */
const createStoreSlice: StateCreator<ApiFootballState> = (set, get) => ({
  // Initial state
  countries: null,
  timezones: null,
  seasons: null,
  leagues: new Map(),
  teams: new Map(),
  teamStatistics: new Map(),
  venues: new Map(),
  fixtures: new Map(),
  fixtureStatistics: new Map(),
  fixtureEvents: new Map(),
  fixtureLineups: new Map(),
  fixturePlayers: new Map(),
  standings: new Map(),
  players: new Map(),
  squads: new Map(),
  transfers: new Map(),
  coaches: new Map(),
  trophies: new Map(),
  sidelined: new Map(),
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

  setVenues: (key, data) =>
    set((state) => {
      const newVenues = new Map(state.venues);
      newVenues.set(key, createCacheEntry(key, data));
      return { venues: newVenues };
    }),

  setFixtures: (key, data) =>
    set((state) => {
      const newFixtures = new Map(state.fixtures);
      newFixtures.set(key, createCacheEntry(key, data));
      return { fixtures: newFixtures };
    }),

  setFixtureStatistics: (key, data) =>
    set((state) => {
      const newStats = new Map(state.fixtureStatistics);
      newStats.set(key, createCacheEntry(key, data));
      return { fixtureStatistics: newStats };
    }),

  setFixtureEvents: (key, data) =>
    set((state) => {
      const newEvents = new Map(state.fixtureEvents);
      newEvents.set(key, createCacheEntry(key, data));
      return { fixtureEvents: newEvents };
    }),

  setFixtureLineups: (key, data) =>
    set((state) => {
      const newLineups = new Map(state.fixtureLineups);
      newLineups.set(key, createCacheEntry(key, data));
      return { fixtureLineups: newLineups };
    }),

  setFixturePlayers: (key, data) =>
    set((state) => {
      const newPlayers = new Map(state.fixturePlayers);
      newPlayers.set(key, createCacheEntry(key, data));
      return { fixturePlayers: newPlayers };
    }),

  setStandings: (key, data) =>
    set((state) => {
      const newStandings = new Map(state.standings);
      newStandings.set(key, createCacheEntry(key, data));
      return { standings: newStandings };
    }),

  setPlayers: (key, data) =>
    set((state) => {
      const newPlayers = new Map(state.players);
      newPlayers.set(key, createCacheEntry(key, data));
      return { players: newPlayers };
    }),

  setSquads: (key, data) =>
    set((state) => {
      const newSquads = new Map(state.squads);
      newSquads.set(key, createCacheEntry(key, data));
      return { squads: newSquads };
    }),

  setTransfers: (key, data) =>
    set((state) => {
      const newTransfers = new Map(state.transfers);
      newTransfers.set(key, createCacheEntry(key, data));
      return { transfers: newTransfers };
    }),

  setCoaches: (key, data) =>
    set((state) => {
      const newCoaches = new Map(state.coaches);
      newCoaches.set(key, createCacheEntry(key, data));
      return { coaches: newCoaches };
    }),

  setTrophies: (key, data) =>
    set((state) => {
      const newTrophies = new Map(state.trophies);
      newTrophies.set(key, createCacheEntry(key, data));
      return { trophies: newTrophies };
    }),

  setSidelined: (key, data) =>
    set((state) => {
      const newSidelined = new Map(state.sidelined);
      newSidelined.set(key, createCacheEntry(key, data));
      return { sidelined: newSidelined };
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

  getVenues: (key) => {
    const cached = get().venues.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getFixtures: (key) => {
    const cached = get().fixtures.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getFixtureStatistics: (key) => {
    const cached = get().fixtureStatistics.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getFixtureEvents: (key) => {
    const cached = get().fixtureEvents.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getFixtureLineups: (key) => {
    const cached = get().fixtureLineups.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getFixturePlayers: (key) => {
    const cached = get().fixturePlayers.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getStandings: (key) => {
    const cached = get().standings.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getPlayers: (key) => {
    const cached = get().players.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getSquads: (key) => {
    const cached = get().squads.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getTransfers: (key) => {
    const cached = get().transfers.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getCoaches: (key) => {
    const cached = get().coaches.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getTrophies: (key) => {
    const cached = get().trophies.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getSidelined: (key) => {
    const cached = get().sidelined.get(key);
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
      venues: new Map(),
      fixtures: new Map(),
      fixtureStatistics: new Map(),
      fixtureEvents: new Map(),
      fixtureLineups: new Map(),
      fixturePlayers: new Map(),
      standings: new Map(),
      players: new Map(),
      squads: new Map(),
      transfers: new Map(),
      coaches: new Map(),
      trophies: new Map(),
      sidelined: new Map(),
    }),

  setCacheTTL: (ttl) => set({ cacheTTL: ttl }),
});

/**
 * Persist options type
 */
type ApiFootballPersistOptions = PersistOptions<
  ApiFootballState,
  Partial<ApiFootballState>
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
        "venues",
        "fixtures",
        "fixtureStatistics",
        "fixtureEvents",
        "fixtureLineups",
        "fixturePlayers",
        "standings",
        "players",
        "squads",
        "transfers",
        "coaches",
        "trophies",
        "sidelined",
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
 * Create an API Football store with persistence
 *
 * Factory function that creates a new Zustand store instance with persistence.
 * The store automatically handles Map serialization for JSON storage.
 *
 * Requires a StorageAdapter for cross-platform compatibility. Use createStorageAdapter()
 * to convert a DI StorageService to the required format.
 *
 * @param storage - Storage adapter for persistence (required for React Native compatibility)
 * @returns Zustand store hook with API Football state
 *
 * @example
 * ```typescript
 * import { createApiFootballStore, createStorageAdapter } from "@sudobility/sports_api_client";
 * import type { StorageService } from "@sudobility/di";
 *
 * // Get storage service from your DI container
 * const storageService = container.get<StorageService>(ServiceKeys.STORAGE);
 *
 * // Create store with DI storage service
 * const useStore = createApiFootballStore(createStorageAdapter(storageService));
 *
 * // Usage in React component
 * function MyComponent() {
 *   const leagues = useStore((state) => state.getLeagues("england"));
 *   const setLeagues = useStore((state) => state.setLeagues);
 *   // ...
 * }
 * ```
 */
export const createApiFootballStore = (storage: StorageAdapter) => {
  const persistOptions: ApiFootballPersistOptions = {
    name: "api-football-cache",
    storage: createCustomStorage(storage),
    partialize: (state) => ({
      countries: state.countries,
      timezones: state.timezones,
      seasons: state.seasons,
      leagues: state.leagues,
      teams: state.teams,
      teamStatistics: state.teamStatistics,
      venues: state.venues,
      fixtures: state.fixtures,
      fixtureStatistics: state.fixtureStatistics,
      fixtureEvents: state.fixtureEvents,
      fixtureLineups: state.fixtureLineups,
      fixturePlayers: state.fixturePlayers,
      standings: state.standings,
      players: state.players,
      squads: state.squads,
      transfers: state.transfers,
      coaches: state.coaches,
      trophies: state.trophies,
      sidelined: state.sidelined,
      cacheTTL: state.cacheTTL,
    }),
  };

  return create<ApiFootballState>()(persist(createStoreSlice, persistOptions));
};

/** Type for the store hook returned by createApiFootballStore */
export type ApiFootballStore = ReturnType<typeof createApiFootballStore>;
