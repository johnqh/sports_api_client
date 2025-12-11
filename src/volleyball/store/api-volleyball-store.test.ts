/**
 * @module volleyball/store/api-volleyball-store.test
 * @description Tests for ApiVolleyballStore
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { StorageAdapter } from "../../utils/cache-utils";
import { createApiVolleyballStore } from "./api-volleyball-store";

describe("ApiVolleyballStore", () => {
  let mockStorage: StorageAdapter;

  beforeEach(() => {
    mockStorage = {
      getItem: vi.fn().mockResolvedValue(null),
      setItem: vi.fn().mockResolvedValue(undefined),
      removeItem: vi.fn().mockResolvedValue(undefined),
    };
  });

  describe("createApiVolleyballStore", () => {
    it("should create a store with default cacheTTL", () => {
      const useStore = createApiVolleyballStore(mockStorage);
      expect(useStore.getState().cacheTTL).toBe(5 * 60 * 1000);
    });
  });

  describe("countries cache", () => {
    it("should set and get countries", () => {
      const useStore = createApiVolleyballStore(mockStorage);
      const data = [
        { id: 1, name: "Brazil", code: "BR", flag: "https://flag.br" },
      ];

      useStore.getState().setCountries(data);

      const cached = useStore.getState().countries;
      expect(cached).not.toBeNull();
      expect(cached?.data).toEqual(data);
    });
  });

  describe("timezones cache", () => {
    it("should set timezones", () => {
      const useStore = createApiVolleyballStore(mockStorage);
      const data = ["America/Sao_Paulo", "Europe/Rome"];

      useStore.getState().setTimezones(data);

      const cached = useStore.getState().timezones;
      expect(cached).not.toBeNull();
      expect(cached?.data).toEqual(data);
    });
  });

  describe("seasons cache", () => {
    it("should set seasons", () => {
      const useStore = createApiVolleyballStore(mockStorage);
      const data = [2023, 2024];

      useStore.getState().setSeasons(data);

      const cached = useStore.getState().seasons;
      expect(cached).not.toBeNull();
      expect(cached?.data).toEqual(data);
    });
  });

  describe("leagues cache", () => {
    it("should get and set leagues", () => {
      const useStore = createApiVolleyballStore(mockStorage);
      const key = "leagues-it";
      const data = [
        {
          league: { id: 1, name: "Serie A1", type: "League", logo: null },
          country: { id: 1, name: "Italy", code: "IT", flag: null },
          seasons: [{ year: 2024, start: "2024-09-01", end: "2025-05-31" }],
        },
      ];

      useStore.getState().setLeagues(key, data);
      expect(useStore.getState().getLeagues(key)).toEqual(data);
    });

    it("should return null for missing key", () => {
      const useStore = createApiVolleyballStore(mockStorage);
      expect(useStore.getState().getLeagues("missing")).toBeNull();
    });
  });

  describe("teams cache", () => {
    it("should get and set teams", () => {
      const useStore = createApiVolleyballStore(mockStorage);
      const key = "teams-1-2024";
      const data = [
        {
          team: { id: 1, name: "Sir Susa Vim Perugia", logo: null, national: false },
          country: { id: 1, name: "Italy", code: "IT", flag: null },
        },
      ];

      useStore.getState().setTeams(key, data);
      expect(useStore.getState().getTeams(key)).toEqual(data);
    });
  });

  describe("standings cache", () => {
    it("should get and set standings", () => {
      const useStore = createApiVolleyballStore(mockStorage);
      const key = "standings-1-2024";
      const data = [
        {
          league: { id: 1, name: "Serie A1", type: "League", logo: null },
          country: { id: 1, name: "Italy", code: "IT", flag: null },
          season: 2024,
          standings: [],
        },
      ];

      useStore.getState().setStandings(key, data);
      expect(useStore.getState().getStandings(key)).toEqual(data);
    });
  });

  describe("games cache", () => {
    it("should get and set games", () => {
      const useStore = createApiVolleyballStore(mockStorage);
      const key = "games-2024-01-15";
      const data = [
        {
          id: 1,
          date: "2024-01-15",
          time: "20:00",
          timestamp: 1705348800,
          timezone: "UTC",
          week: "Week 15",
          status: { long: "Finished", short: "FT" },
          league: { id: 1, name: "Serie A1", type: "League", logo: null },
          country: { id: 1, name: "Italy", code: "IT", flag: null },
          teams: {
            home: { id: 1, name: "Perugia", logo: null },
            away: { id: 2, name: "Modena", logo: null },
          },
          scores: {
            home: { 1: 25, 2: 23, 3: 25, 4: null, 5: null },
            away: { 1: 20, 2: 25, 3: 20, 4: null, 5: null },
          },
        },
      ];

      useStore.getState().setGames(key, data);
      expect(useStore.getState().getGames(key)).toEqual(data);
    });
  });

  describe("h2h cache", () => {
    it("should get and set h2h", () => {
      const useStore = createApiVolleyballStore(mockStorage);
      const key = "h2h-1-2";
      const data = [
        {
          id: 1,
          date: "2024-01-15",
          time: "20:00",
          timestamp: 1705348800,
          timezone: "UTC",
          week: null,
          status: { long: "Finished", short: "FT" },
          league: { id: 1, name: "Serie A1", type: "League", logo: null },
          country: { id: 1, name: "Italy", code: "IT", flag: null },
          teams: {
            home: { id: 1, name: "Perugia", logo: null },
            away: { id: 2, name: "Modena", logo: null },
          },
          scores: {
            home: { 1: 25, 2: 23, 3: 25, 4: null, 5: null },
            away: { 1: 20, 2: 25, 3: 20, 4: null, 5: null },
          },
        },
      ];

      useStore.getState().setH2H(key, data);
      expect(useStore.getState().getH2H(key)).toEqual(data);
    });
  });

  describe("clearCache", () => {
    it("should clear all cached data", () => {
      const useStore = createApiVolleyballStore(mockStorage);

      useStore.getState().setTimezones(["America/Sao_Paulo"]);
      useStore
        .getState()
        .setCountries([{ id: 1, name: "Brazil", code: "BR", flag: null }]);
      useStore.getState().setSeasons([2024]);

      useStore.getState().clearCache();

      expect(useStore.getState().timezones).toBeNull();
      expect(useStore.getState().countries).toBeNull();
      expect(useStore.getState().seasons).toBeNull();
    });
  });

  describe("cacheTTL", () => {
    it("should update cacheTTL", () => {
      const useStore = createApiVolleyballStore(mockStorage);

      useStore.getState().setCacheTTL(10000);

      expect(useStore.getState().cacheTTL).toBe(10000);
    });
  });
});
