/**
 * Tests for ApiHockeyStore
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { createApiHockeyStore } from "./api-hockey-store";
import { DEFAULT_CACHE_TTL } from "../../utils/cache-utils";

describe("ApiHockeyStore", () => {
  let store: ReturnType<typeof createApiHockeyStore>;

  beforeEach(() => {
    // Create a fresh store for each test with mock storage
    const mockStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    store = createApiHockeyStore(mockStorage);
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
      expect(state.games.size).toBe(0);
      expect(state.standings.size).toBe(0);
    });

    it("should have default TTL", () => {
      const state = store.getState();
      expect(state.cacheTTL).toBe(DEFAULT_CACHE_TTL);
    });
  });

  describe("setters", () => {
    it("should set countries with timestamp", () => {
      const countries = [
        { id: 1, name: "USA", code: "US", flag: "https://example.com/us.png" },
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

    it("should set seasons with timestamp", () => {
      const seasons = [2023, 2022, 2021];

      store.getState().setSeasons(seasons);
      const state = store.getState();

      expect(state.seasons).not.toBeNull();
      expect(state.seasons?.data).toEqual(seasons);
    });

    it("should set keyed data (leagues)", () => {
      const leagues = [
        {
          league: {
            id: 57,
            name: "NHL",
            type: "League" as const,
            logo: null,
          },
          country: { id: 1, name: "USA", code: "US", flag: null },
          seasons: [],
        },
      ];

      store.getState().setLeagues("usa", leagues);
      const state = store.getState();

      expect(state.leagues.size).toBe(1);
      expect(state.leagues.get("usa")?.data).toEqual(leagues);
    });

    it("should set keyed data (games)", () => {
      const games = [
        {
          id: 1,
          date: "2024-01-15",
          time: "19:00",
          timestamp: 1705344000,
          timezone: "UTC",
          week: null,
          status: { long: "Finished", short: "FT", timer: null },
          league: {
            id: 57,
            name: "NHL",
            type: "League",
            season: 2023,
            logo: null,
          },
          country: { id: 1, name: "USA", code: "US", flag: null },
          teams: {
            home: { id: 1, name: "Boston Bruins", logo: null },
            away: { id: 2, name: "Toronto Maple Leafs", logo: null },
          },
          scores: {
            home: {
              first: 1,
              second: 2,
              third: 1,
              overtime: null,
              penalties: null,
              total: 4,
            },
            away: {
              first: 0,
              second: 1,
              third: 1,
              overtime: null,
              penalties: null,
              total: 2,
            },
          },
          periods: {
            first: "20:00",
            second: "20:00",
            third: "20:00",
            overtime: null,
            penalties: null,
          },
          events: [],
        },
      ];

      store.getState().setGames("nhl-2024", games);
      const state = store.getState();

      expect(state.games.size).toBe(1);
      expect(state.games.get("nhl-2024")?.data).toEqual(games);
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
            id: 57,
            name: "NHL",
            type: "League" as const,
            logo: null,
          },
          country: { id: 1, name: "USA", code: "US", flag: null },
          seasons: [],
        },
      ];

      store.getState().setLeagues("usa", leaguesData);
      const leagues = store.getState().getLeagues("usa");

      expect(leagues).toEqual(leaguesData);
    });

    it("should return null for expired cache", () => {
      const leaguesData = [
        {
          league: {
            id: 57,
            name: "NHL",
            type: "League" as const,
            logo: null,
          },
          country: { id: 1, name: "USA", code: "US", flag: null },
          seasons: [],
        },
      ];

      // Set data
      store.getState().setLeagues("usa", leaguesData);

      // Set TTL to 0 to expire immediately
      store.getState().setCacheTTL(0);

      const leagues = store.getState().getLeagues("usa");
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
      store
        .getState()
        .setCountries([{ id: 1, name: "USA", code: "US", flag: null }]);
      store.getState().setTimezones(["America/New_York"]);
      store.getState().setLeagues("usa", []);
      store.getState().setGames("nhl", []);

      // Clear cache
      store.getState().clearCache();
      const state = store.getState();

      expect(state.countries).toBeNull();
      expect(state.timezones).toBeNull();
      expect(state.leagues.size).toBe(0);
      expect(state.games.size).toBe(0);
    });

    it("should update cache TTL", () => {
      const newTTL = 10 * 60 * 1000; // 10 minutes
      store.getState().setCacheTTL(newTTL);

      expect(store.getState().cacheTTL).toBe(newTTL);
    });
  });
});
