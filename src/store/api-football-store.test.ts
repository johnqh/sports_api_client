/**
 * Tests for ApiFootballStore
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createApiFootballStore,
  type ApiFootballState,
} from "./api-football-store";
import {
  isCacheValid,
  generateCacheKey,
  DEFAULT_CACHE_TTL,
} from "./cache-utils";

describe("ApiFootballStore", () => {
  let store: ReturnType<typeof createApiFootballStore>;

  beforeEach(() => {
    // Create a fresh store for each test with mock storage
    const mockStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    store = createApiFootballStore(mockStorage);
    // Clear any existing state
    store.getState().clearCache();
  });

  describe("initial state", () => {
    it("should have null for all cached data initially", () => {
      const state = store.getState();
      expect(state.countries).toBeNull();
      expect(state.timezones).toBeNull();
      expect(state.seasons).toBeNull();
    });

    it("should have empty Maps for keyed caches", () => {
      const state = store.getState();
      expect(state.leagues.size).toBe(0);
      expect(state.teams.size).toBe(0);
      expect(state.fixtures.size).toBe(0);
    });

    it("should have default TTL", () => {
      const state = store.getState();
      expect(state.cacheTTL).toBe(DEFAULT_CACHE_TTL);
    });
  });

  describe("setters", () => {
    it("should set countries with timestamp", () => {
      const countries = [
        { name: "England", code: "GB", flag: "https://example.com/gb.png" },
      ];

      store.getState().setCountries(countries);
      const state = store.getState();

      expect(state.countries).not.toBeNull();
      expect(state.countries?.data).toEqual(countries);
      expect(state.countries?.timestamp).toBeDefined();
      expect(state.countries?.key).toBe("countries");
    });

    it("should set timezones with timestamp", () => {
      const timezones = ["Europe/London", "America/New_York"];

      store.getState().setTimezones(timezones);
      const state = store.getState();

      expect(state.timezones).not.toBeNull();
      expect(state.timezones?.data).toEqual(timezones);
    });

    it("should set keyed data (leagues)", () => {
      const leagues = [
        {
          league: {
            id: 39,
            name: "Premier League",
            type: "League" as const,
            logo: "",
          },
          country: { name: "England", code: "GB", flag: "" },
          seasons: [],
        },
      ];

      store.getState().setLeagues("england", leagues);
      const state = store.getState();

      expect(state.leagues.size).toBe(1);
      expect(state.leagues.get("england")?.data).toEqual(leagues);
    });
  });

  describe("getters", () => {
    it("should return null for non-existent keys", () => {
      const leagues = store.getState().getLeagues("nonexistent");
      expect(leagues).toBeNull();
    });

    it("should return data for valid cache", () => {
      const leaguesData = [
        {
          league: {
            id: 39,
            name: "Premier League",
            type: "League" as const,
            logo: "",
          },
          country: { name: "England", code: "GB", flag: "" },
          seasons: [],
        },
      ];

      store.getState().setLeagues("england", leaguesData);
      const leagues = store.getState().getLeagues("england");

      expect(leagues).toEqual(leaguesData);
    });

    it("should return null for expired cache", () => {
      const leaguesData = [
        {
          league: {
            id: 39,
            name: "Premier League",
            type: "League" as const,
            logo: "",
          },
          country: { name: "England", code: "GB", flag: "" },
          seasons: [],
        },
      ];

      // Set data
      store.getState().setLeagues("england", leaguesData);

      // Set TTL to 0 to expire immediately
      store.getState().setCacheTTL(0);

      const leagues = store.getState().getLeagues("england");
      expect(leagues).toBeNull();
    });
  });

  describe("cache utilities", () => {
    it("should validate cache correctly", () => {
      const now = Date.now();
      const state = store.getState();

      // Recent timestamp should be valid
      expect(state.isCacheValid(now)).toBe(true);

      // Old timestamp should be invalid
      const oldTimestamp = now - DEFAULT_CACHE_TTL - 1000;
      expect(state.isCacheValid(oldTimestamp)).toBe(false);
    });

    it("should clear all cache", () => {
      // Add some data
      store.getState().setCountries([{ name: "England", code: "GB", flag: "" }]);
      store.getState().setTimezones(["Europe/London"]);
      store.getState().setLeagues("england", []);

      // Clear cache
      store.getState().clearCache();
      const state = store.getState();

      expect(state.countries).toBeNull();
      expect(state.timezones).toBeNull();
      expect(state.leagues.size).toBe(0);
    });

    it("should update cache TTL", () => {
      const newTTL = 10 * 60 * 1000; // 10 minutes
      store.getState().setCacheTTL(newTTL);

      expect(store.getState().cacheTTL).toBe(newTTL);
    });
  });
});

describe("cache-utils", () => {
  describe("isCacheValid", () => {
    it("should return true for recent timestamps", () => {
      const now = Date.now();
      expect(isCacheValid(now)).toBe(true);
      expect(isCacheValid(now - 1000)).toBe(true); // 1 second ago
    });

    it("should return false for old timestamps", () => {
      const oldTimestamp = Date.now() - DEFAULT_CACHE_TTL - 1000;
      expect(isCacheValid(oldTimestamp)).toBe(false);
    });

    it("should respect custom TTL", () => {
      const now = Date.now();
      const customTTL = 1000; // 1 second

      expect(isCacheValid(now - 500, customTTL)).toBe(true);
      expect(isCacheValid(now - 2000, customTTL)).toBe(false);
    });
  });

  describe("generateCacheKey", () => {
    it("should return prefix for empty params", () => {
      expect(generateCacheKey("leagues")).toBe("leagues");
      expect(generateCacheKey("leagues", {})).toBe("leagues");
      expect(generateCacheKey("leagues", undefined)).toBe("leagues");
    });

    it("should generate key with sorted params", () => {
      const key = generateCacheKey("leagues", {
        country: "England",
        season: 2023,
      });
      expect(key).toBe("leagues:country=England&season=2023");
    });

    it("should ignore undefined and null values", () => {
      const key = generateCacheKey("leagues", {
        country: "England",
        season: undefined,
        type: null,
      });
      expect(key).toBe("leagues:country=England");
    });
  });
});
