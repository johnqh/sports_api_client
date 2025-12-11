/**
 * @module api-mma-store
 * @description Zustand store for API-MMA data caching
 */

import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import type {
  MmaCategory,
  MmaCountry,
  MmaFight,
  MmaFighter,
  MmaLeagueResponse,
} from "../types";
import {
  CachedData,
  isCacheValid as checkCacheValid,
  createCacheEntry,
  DEFAULT_CACHE_TTL,
  StorageAdapter,
} from "../../utils/cache-utils";

export interface ApiMmaState {
  countries: CachedData<MmaCountry[]> | null;
  timezones: CachedData<string[]> | null;
  seasons: CachedData<number[]> | null;
  leagues: Map<string, CachedData<MmaLeagueResponse[]>>;
  categories: Map<string, CachedData<MmaCategory[]>>;
  fighters: Map<string, CachedData<MmaFighter[]>>;
  fights: Map<string, CachedData<MmaFight[]>>;
  cacheTTL: number;

  setCountries: (data: MmaCountry[]) => void;
  setTimezones: (data: string[]) => void;
  setSeasons: (data: number[]) => void;
  setLeagues: (key: string, data: MmaLeagueResponse[]) => void;
  setCategories: (key: string, data: MmaCategory[]) => void;
  setFighters: (key: string, data: MmaFighter[]) => void;
  setFights: (key: string, data: MmaFight[]) => void;

  getLeagues: (key: string) => MmaLeagueResponse[] | null;
  getCategories: (key: string) => MmaCategory[] | null;
  getFighters: (key: string) => MmaFighter[] | null;
  getFights: (key: string) => MmaFight[] | null;

  isCacheValid: (timestamp: number) => boolean;
  clearCache: () => void;
  setCacheTTL: (ttl: number) => void;
}

const createStoreSlice: StateCreator<ApiMmaState> = (set, get) => ({
  countries: null,
  timezones: null,
  seasons: null,
  leagues: new Map(),
  categories: new Map(),
  fighters: new Map(),
  fights: new Map(),
  cacheTTL: DEFAULT_CACHE_TTL,

  setCountries: (data) =>
    set({ countries: createCacheEntry("countries", data) }),
  setTimezones: (data) =>
    set({ timezones: createCacheEntry("timezones", data) }),
  setSeasons: (data) => set({ seasons: createCacheEntry("seasons", data) }),

  setLeagues: (key, data) =>
    set((state) => {
      const newLeagues = new Map(state.leagues);
      newLeagues.set(key, createCacheEntry(key, data));
      return { leagues: newLeagues };
    }),

  setCategories: (key, data) =>
    set((state) => {
      const newCategories = new Map(state.categories);
      newCategories.set(key, createCacheEntry(key, data));
      return { categories: newCategories };
    }),

  setFighters: (key, data) =>
    set((state) => {
      const newFighters = new Map(state.fighters);
      newFighters.set(key, createCacheEntry(key, data));
      return { fighters: newFighters };
    }),

  setFights: (key, data) =>
    set((state) => {
      const newFights = new Map(state.fights);
      newFights.set(key, createCacheEntry(key, data));
      return { fights: newFights };
    }),

  getLeagues: (key) => {
    const cached = get().leagues.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getCategories: (key) => {
    const cached = get().categories.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getFighters: (key) => {
    const cached = get().fighters.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  getFights: (key) => {
    const cached = get().fights.get(key);
    if (!cached || !get().isCacheValid(cached.timestamp)) return null;
    return cached.data;
  },

  isCacheValid: (timestamp) => checkCacheValid(timestamp, get().cacheTTL),

  clearCache: () =>
    set({
      countries: null,
      timezones: null,
      seasons: null,
      leagues: new Map(),
      categories: new Map(),
      fighters: new Map(),
      fights: new Map(),
    }),

  setCacheTTL: (ttl) => set({ cacheTTL: ttl }),
});

type ApiMmaPersistOptions = PersistOptions<ApiMmaState, Partial<ApiMmaState>>;

const createCustomStorage = (storage: StorageAdapter) => ({
  getItem: async (name: string) => {
    const value = await storage.getItem(name);
    if (!value) return null;

    try {
      const parsed = JSON.parse(value);
      const mapFields = ["leagues", "categories", "fighters", "fights"];

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

export const createApiMmaStore = (storage: StorageAdapter) => {
  const persistOptions: ApiMmaPersistOptions = {
    name: "api-mma-cache",
    storage: createCustomStorage(storage),
    partialize: (state) => ({
      countries: state.countries,
      timezones: state.timezones,
      seasons: state.seasons,
      leagues: state.leagues,
      categories: state.categories,
      fighters: state.fighters,
      fights: state.fights,
      cacheTTL: state.cacheTTL,
    }),
  };

  return create<ApiMmaState>()(persist(createStoreSlice, persistOptions));
};

export type ApiMmaStore = ReturnType<typeof createApiMmaStore>;
