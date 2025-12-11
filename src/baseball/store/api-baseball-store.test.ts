/**
 * @module api-baseball-store.test
 * @description Tests for API-Baseball store
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { createApiBaseballStore, type ApiBaseballState } from "./api-baseball-store";
import type { StorageAdapter } from "../../utils/cache-utils";

describe("ApiBaseballStore", () => {
  let store: ReturnType<typeof createApiBaseballStore>;
  let mockStorage: StorageAdapter;

  beforeEach(() => {
    mockStorage = {
      getItem: vi.fn().mockResolvedValue(null),
      setItem: vi.fn().mockResolvedValue(undefined),
      removeItem: vi.fn().mockResolvedValue(undefined),
    };

    store = createApiBaseballStore(mockStorage);
    store.getState().clearCache();
  });

  describe("initial state", () => {
    it("should have null initial values for simple caches", () => {
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
  });

  describe("setCountries", () => {
    it("should set countries cache", () => {
      const countries = [{ id: 1, name: "USA", code: "US", flag: null }];
      store.getState().setCountries(countries);

      const state = store.getState();
      expect(state.countries).not.toBeNull();
      expect(state.countries?.data).toEqual(countries);
    });
  });

  describe("setTimezones", () => {
    it("should set timezones cache", () => {
      const timezones = ["UTC", "America/New_York"];
      store.getState().setTimezones(timezones);

      const state = store.getState();
      expect(state.timezones).not.toBeNull();
      expect(state.timezones?.data).toEqual(timezones);
    });
  });

  describe("setSeasons", () => {
    it("should set seasons cache", () => {
      const seasons = [2021, 2022, 2023];
      store.getState().setSeasons(seasons);

      const state = store.getState();
      expect(state.seasons).not.toBeNull();
      expect(state.seasons?.data).toEqual(seasons);
    });
  });

  describe("setLeagues/getLeagues", () => {
    it("should set and get leagues cache", () => {
      const leagues = [
        {
          league: { id: 1, name: "MLB", type: "League", logo: null },
          country: { id: 1, name: "USA", code: "US", flag: null },
          seasons: [],
        },
      ];

      store.getState().setLeagues("usa", leagues);
      const result = store.getState().getLeagues("usa");

      expect(result).toEqual(leagues);
    });

    it("should return null for non-existent key", () => {
      const result = store.getState().getLeagues("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("setTeams/getTeams", () => {
    it("should set and get teams cache", () => {
      const teams = [
        {
          team: { id: 1, name: "Yankees", logo: null, national: false },
          country: { id: 1, name: "USA", code: "US", flag: null },
        },
      ];

      store.getState().setTeams("mlb-2023", teams);
      const result = store.getState().getTeams("mlb-2023");

      expect(result).toEqual(teams);
    });
  });

  describe("setGames/getGames", () => {
    it("should set and get games cache", () => {
      const games = [
        {
          id: 1,
          date: "2023-07-15",
          time: "19:00",
          timestamp: 1689447600,
          timezone: "UTC",
          week: null,
          status: { long: "Finished", short: "FT" },
          country: { id: 1, name: "USA", code: "US", flag: null },
          league: { id: 1, name: "MLB", type: "League", logo: null },
          teams: {
            home: { id: 1, name: "Yankees", logo: null, national: false },
            away: { id: 2, name: "Red Sox", logo: null, national: false },
          },
          scores: {
            home: { hits: 10, errors: 1, innings: {}, total: 5 },
            away: { hits: 8, errors: 2, innings: {}, total: 3 },
          },
        },
      ];

      store.getState().setGames("2023-07-15", games);
      const result = store.getState().getGames("2023-07-15");

      expect(result).toEqual(games);
    });
  });

  describe("setStandings/getStandings", () => {
    it("should set and get standings cache", () => {
      const standings = [
        {
          position: 1,
          stage: "Regular Season",
          group: { name: "AL East" },
          team: { id: 1, name: "Yankees", logo: null, national: false },
          league: { id: 1, name: "MLB", type: "League", logo: null },
          country: { id: 1, name: "USA", code: "US", flag: null },
          games: {
            played: 100,
            win: { total: 60, percentage: "0.600" },
            lose: { total: 40, percentage: "0.400" },
          },
          points: { for: 500, against: 400 },
          form: "WWLWW",
          description: null,
        },
      ];

      store.getState().setStandings("mlb-2023", standings);
      const result = store.getState().getStandings("mlb-2023");

      expect(result).toEqual(standings);
    });
  });

  describe("isCacheValid", () => {
    it("should return true for recent timestamp", () => {
      const recentTimestamp = Date.now() - 1000;
      expect(store.getState().isCacheValid(recentTimestamp)).toBe(true);
    });

    it("should return false for old timestamp", () => {
      const oldTimestamp = Date.now() - 1000 * 60 * 60 * 24; // 24 hours ago
      expect(store.getState().isCacheValid(oldTimestamp)).toBe(false);
    });
  });

  describe("clearCache", () => {
    it("should clear all cached data", () => {
      // Set some data
      store.getState().setCountries([{ id: 1, name: "USA", code: "US", flag: null }]);
      store.getState().setTimezones(["UTC"]);
      store.getState().setLeagues("test", []);

      // Clear cache
      store.getState().clearCache();

      const state = store.getState();
      expect(state.countries).toBeNull();
      expect(state.timezones).toBeNull();
      expect(state.leagues.size).toBe(0);
    });
  });

  describe("setCacheTTL", () => {
    it("should update cache TTL", () => {
      store.getState().setCacheTTL(1000 * 60 * 30); // 30 minutes
      expect(store.getState().cacheTTL).toBe(1000 * 60 * 30);
    });
  });
});
