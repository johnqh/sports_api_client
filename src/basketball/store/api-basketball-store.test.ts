/**
 * Tests for ApiBasketballStore
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { createApiBasketballStore } from "./api-basketball-store";
import { DEFAULT_CACHE_TTL } from "../../utils/cache-utils";

describe("ApiBasketballStore", () => {
  let store: ReturnType<typeof createApiBasketballStore>;

  beforeEach(() => {
    // Create a fresh store for each test with mock storage
    const mockStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    store = createApiBasketballStore(mockStorage);
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
      const seasons = ["2023-2024", "2022-2023"];

      store.getState().setSeasons(seasons);
      const state = store.getState();

      expect(state.seasons).not.toBeNull();
      expect(state.seasons?.data).toEqual(seasons);
    });

    it("should set keyed data (leagues)", () => {
      const leagues = [
        {
          league: {
            id: 12,
            name: "NBA",
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
          time: "19:30",
          timestamp: 1705344600,
          timezone: "UTC",
          stage: null,
          week: null,
          status: { long: "Finished", short: "FT", timer: null },
          league: {
            id: 12,
            name: "NBA",
            type: "League",
            season: "2023-2024",
            logo: null,
          },
          country: { id: 1, name: "USA", code: "US", flag: null },
          teams: {
            home: { id: 1, name: "Lakers", logo: null },
            away: { id: 2, name: "Celtics", logo: null },
          },
          scores: {
            home: {
              quarter_1: 28,
              quarter_2: 30,
              quarter_3: 25,
              quarter_4: 27,
              over_time: null,
              total: 110,
            },
            away: {
              quarter_1: 25,
              quarter_2: 28,
              quarter_3: 30,
              quarter_4: 22,
              over_time: null,
              total: 105,
            },
          },
        },
      ];

      store.getState().setGames("nba-2024", games);
      const state = store.getState();

      expect(state.games.size).toBe(1);
      expect(state.games.get("nba-2024")?.data).toEqual(games);
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
            id: 12,
            name: "NBA",
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
            id: 12,
            name: "NBA",
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
      store.getState().setGames("nba", []);

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
