/**
 * @module api-rugby-store.test
 * @description Tests for API-Rugby store
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { createApiRugbyStore } from "./api-rugby-store";
import type { StorageAdapter } from "../../utils/cache-utils";

describe("ApiRugbyStore", () => {
  let store: ReturnType<typeof createApiRugbyStore>;
  let mockStorage: StorageAdapter;

  beforeEach(() => {
    mockStorage = {
      getItem: vi.fn().mockResolvedValue(null),
      setItem: vi.fn().mockResolvedValue(undefined),
      removeItem: vi.fn().mockResolvedValue(undefined),
    };

    store = createApiRugbyStore(mockStorage);
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
      const countries = [{ id: 1, name: "England", code: "GB", flag: null }];
      store.getState().setCountries(countries);

      const state = store.getState();
      expect(state.countries).not.toBeNull();
      expect(state.countries?.data).toEqual(countries);
    });
  });

  describe("setTimezones", () => {
    it("should set timezones cache", () => {
      const timezones = ["UTC", "Europe/London"];
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
          league: {
            id: 1,
            name: "Premiership Rugby",
            type: "League",
            logo: null,
          },
          country: { id: 1, name: "England", code: "GB", flag: null },
          seasons: [],
        },
      ];

      store.getState().setLeagues("england", leagues);
      const result = store.getState().getLeagues("england");

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
          team: { id: 1, name: "Harlequins", logo: null, national: false },
          country: { id: 1, name: "England", code: "GB", flag: null },
        },
      ];

      store.getState().setTeams("premiership-2023", teams);
      const result = store.getState().getTeams("premiership-2023");

      expect(result).toEqual(teams);
    });
  });

  describe("setGames/getGames", () => {
    it("should set and get games cache", () => {
      const games = [
        {
          id: 1,
          date: "2023-09-15",
          time: "19:45",
          timestamp: 1694803500,
          timezone: "UTC",
          week: "Round 1",
          status: { long: "Finished", short: "FT" },
          country: { id: 1, name: "England", code: "GB", flag: null },
          league: {
            id: 1,
            name: "Premiership Rugby",
            type: "League",
            logo: null,
          },
          teams: {
            home: { id: 1, name: "Harlequins", logo: null, national: false },
            away: { id: 2, name: "Saracens", logo: null, national: false },
          },
          scores: {
            home: { half_1: 14, half_2: 10, extra_time: null, total: 24 },
            away: { half_1: 7, half_2: 14, extra_time: null, total: 21 },
          },
        },
      ];

      store.getState().setGames("2023-09-15", games);
      const result = store.getState().getGames("2023-09-15");

      expect(result).toEqual(games);
    });
  });

  describe("setStandings/getStandings", () => {
    it("should set and get standings cache", () => {
      const standings = [
        {
          position: 1,
          stage: "Regular Season",
          group: { name: "League" },
          team: { id: 1, name: "Saracens", logo: null, national: false },
          league: {
            id: 1,
            name: "Premiership Rugby",
            type: "League",
            logo: null,
          },
          country: { id: 1, name: "England", code: "GB", flag: null },
          games: { played: 22, win: 18, draw: 0, lose: 4 },
          points: { for: 600, against: 350, difference: 250 },
          pts: 78,
          form: "WWWLW",
          description: null,
        },
      ];

      store.getState().setStandings("premiership-2023", standings);
      const result = store.getState().getStandings("premiership-2023");

      expect(result).toEqual(standings);
    });
  });

  describe("isCacheValid", () => {
    it("should return true for recent timestamp", () => {
      const recentTimestamp = Date.now() - 1000;
      expect(store.getState().isCacheValid(recentTimestamp)).toBe(true);
    });

    it("should return false for old timestamp", () => {
      const oldTimestamp = Date.now() - 1000 * 60 * 60 * 24;
      expect(store.getState().isCacheValid(oldTimestamp)).toBe(false);
    });
  });

  describe("clearCache", () => {
    it("should clear all cached data", () => {
      store
        .getState()
        .setCountries([{ id: 1, name: "England", code: "GB", flag: null }]);
      store.getState().setTimezones(["UTC"]);
      store.getState().setLeagues("test", []);

      store.getState().clearCache();

      const state = store.getState();
      expect(state.countries).toBeNull();
      expect(state.timezones).toBeNull();
      expect(state.leagues.size).toBe(0);
    });
  });

  describe("setCacheTTL", () => {
    it("should update cache TTL", () => {
      store.getState().setCacheTTL(1000 * 60 * 30);
      expect(store.getState().cacheTTL).toBe(1000 * 60 * 30);
    });
  });
});
