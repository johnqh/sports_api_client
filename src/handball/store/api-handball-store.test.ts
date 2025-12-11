/**
 * @module handball/store/api-handball-store.test
 * @description Tests for ApiHandballStore
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { StorageAdapter } from "../../utils/cache-utils";
import { createApiHandballStore } from "./api-handball-store";

describe("ApiHandballStore", () => {
  let mockStorage: StorageAdapter;

  beforeEach(() => {
    mockStorage = {
      getItem: vi.fn().mockResolvedValue(null),
      setItem: vi.fn().mockResolvedValue(undefined),
      removeItem: vi.fn().mockResolvedValue(undefined),
    };
  });

  describe("createApiHandballStore", () => {
    it("should create a store with default cacheTTL", () => {
      const useStore = createApiHandballStore(mockStorage);
      expect(useStore.getState().cacheTTL).toBe(5 * 60 * 1000);
    });
  });

  describe("countries cache", () => {
    it("should set and get countries", () => {
      const useStore = createApiHandballStore(mockStorage);
      const data = [
        { id: 1, name: "France", code: "FR", flag: "https://flag.fr" },
      ];

      useStore.getState().setCountries(data);

      const cached = useStore.getState().countries;
      expect(cached).not.toBeNull();
      expect(cached?.data).toEqual(data);
    });
  });

  describe("timezones cache", () => {
    it("should set timezones", () => {
      const useStore = createApiHandballStore(mockStorage);
      const data = ["Europe/Paris", "America/New_York"];

      useStore.getState().setTimezones(data);

      const cached = useStore.getState().timezones;
      expect(cached).not.toBeNull();
      expect(cached?.data).toEqual(data);
    });
  });

  describe("seasons cache", () => {
    it("should set seasons", () => {
      const useStore = createApiHandballStore(mockStorage);
      const data = [2023, 2024];

      useStore.getState().setSeasons(data);

      const cached = useStore.getState().seasons;
      expect(cached).not.toBeNull();
      expect(cached?.data).toEqual(data);
    });
  });

  describe("leagues cache", () => {
    it("should get and set leagues", () => {
      const useStore = createApiHandballStore(mockStorage);
      const key = "leagues-fr";
      const data = [
        {
          league: { id: 1, name: "Lidl Starligue", type: "League", logo: null },
          country: { id: 1, name: "France", code: "FR", flag: null },
          seasons: [{ year: 2024, start: "2024-09-01", end: "2025-05-31" }],
        },
      ];

      useStore.getState().setLeagues(key, data);
      expect(useStore.getState().getLeagues(key)).toEqual(data);
    });

    it("should return null for missing key", () => {
      const useStore = createApiHandballStore(mockStorage);
      expect(useStore.getState().getLeagues("missing")).toBeNull();
    });
  });

  describe("teams cache", () => {
    it("should get and set teams", () => {
      const useStore = createApiHandballStore(mockStorage);
      const key = "teams-1-2024";
      const data = [
        {
          team: { id: 1, name: "PSG Handball", logo: null, national: false },
          country: { id: 1, name: "France", code: "FR", flag: null },
        },
      ];

      useStore.getState().setTeams(key, data);
      expect(useStore.getState().getTeams(key)).toEqual(data);
    });
  });

  describe("standings cache", () => {
    it("should get and set standings", () => {
      const useStore = createApiHandballStore(mockStorage);
      const key = "standings-1-2024";
      const data = [
        {
          league: { id: 1, name: "Lidl Starligue", type: "League", logo: null },
          country: { id: 1, name: "France", code: "FR", flag: null },
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
      const useStore = createApiHandballStore(mockStorage);
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
          league: { id: 1, name: "Lidl Starligue", type: "League", logo: null },
          country: { id: 1, name: "France", code: "FR", flag: null },
          teams: {
            home: { id: 1, name: "PSG Handball", logo: null },
            away: { id: 2, name: "Montpellier", logo: null },
          },
          scores: {
            home: { first: 15, second: 18, overtime: null },
            away: { first: 14, second: 16, overtime: null },
          },
        },
      ];

      useStore.getState().setGames(key, data);
      expect(useStore.getState().getGames(key)).toEqual(data);
    });
  });

  describe("h2h cache", () => {
    it("should get and set h2h", () => {
      const useStore = createApiHandballStore(mockStorage);
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
          league: { id: 1, name: "Lidl Starligue", type: "League", logo: null },
          country: { id: 1, name: "France", code: "FR", flag: null },
          teams: {
            home: { id: 1, name: "PSG Handball", logo: null },
            away: { id: 2, name: "Montpellier", logo: null },
          },
          scores: {
            home: { first: 15, second: 18, overtime: null },
            away: { first: 14, second: 16, overtime: null },
          },
        },
      ];

      useStore.getState().setH2H(key, data);
      expect(useStore.getState().getH2H(key)).toEqual(data);
    });
  });

  describe("odds cache", () => {
    it("should get and set odds", () => {
      const useStore = createApiHandballStore(mockStorage);
      const key = "odds-12345";
      const data = [
        {
          league: {
            id: 1,
            name: "Lidl Starligue",
            country: "France",
            logo: null,
            flag: null,
            season: 2024,
          },
          game: { id: 12345 },
          update: "2024-01-15T12:00:00Z",
          bookmakers: [
            {
              id: 1,
              name: "Bet365",
              bets: [
                {
                  id: 1,
                  name: "Match Winner",
                  values: [
                    { value: "Home", odd: "1.50" },
                    { value: "Away", odd: "2.50" },
                  ],
                },
              ],
            },
          ],
        },
      ];

      useStore.getState().setOdds(key, data);
      expect(useStore.getState().getOdds(key)).toEqual(data);
    });
  });

  describe("clearCache", () => {
    it("should clear all cached data", () => {
      const useStore = createApiHandballStore(mockStorage);

      useStore.getState().setTimezones(["Europe/Paris"]);
      useStore
        .getState()
        .setCountries([{ id: 1, name: "France", code: "FR", flag: null }]);
      useStore.getState().setSeasons([2024]);

      useStore.getState().clearCache();

      expect(useStore.getState().timezones).toBeNull();
      expect(useStore.getState().countries).toBeNull();
      expect(useStore.getState().seasons).toBeNull();
    });
  });

  describe("cacheTTL", () => {
    it("should update cacheTTL", () => {
      const useStore = createApiHandballStore(mockStorage);

      useStore.getState().setCacheTTL(10000);

      expect(useStore.getState().cacheTTL).toBe(10000);
    });
  });
});
