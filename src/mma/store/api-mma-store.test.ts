/**
 * @module api-mma-store.test
 * @description Tests for API-MMA store
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { createApiMmaStore } from "./api-mma-store";
import type { StorageAdapter } from "../../utils/cache-utils";

describe("ApiMmaStore", () => {
  let store: ReturnType<typeof createApiMmaStore>;
  let mockStorage: StorageAdapter;

  beforeEach(() => {
    mockStorage = {
      getItem: vi.fn().mockResolvedValue(null),
      setItem: vi.fn().mockResolvedValue(undefined),
      removeItem: vi.fn().mockResolvedValue(undefined),
    };

    store = createApiMmaStore(mockStorage);
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
      expect(state.categories.size).toBe(0);
      expect(state.fighters.size).toBe(0);
      expect(state.fights.size).toBe(0);
    });
  });

  describe("setTimezones", () => {
    it("should set timezones cache", () => {
      store.getState().setTimezones(["UTC", "America/Las_Vegas"]);
      expect(store.getState().timezones?.data).toEqual([
        "UTC",
        "America/Las_Vegas",
      ]);
    });
  });

  describe("setLeagues/getLeagues", () => {
    it("should set and get leagues cache", () => {
      const leagues = [
        {
          league: { id: 1, name: "UFC", type: "League", logo: null },
          country: { id: 1, name: "USA", code: "US", flag: null },
          seasons: [],
        },
      ];

      store.getState().setLeagues("all", leagues);
      expect(store.getState().getLeagues("all")).toEqual(leagues);
    });
  });

  describe("setCategories/getCategories", () => {
    it("should set and get categories cache", () => {
      const categories = [{ id: 1, name: "Heavyweight", weight: "265 lbs" }];

      store.getState().setCategories("all", categories);
      expect(store.getState().getCategories("all")).toEqual(categories);
    });
  });

  describe("setFighters/getFighters", () => {
    it("should set and get fighters cache", () => {
      const fighters = [
        {
          id: 1,
          name: "Fighter",
          nickname: null,
          image: null,
          category: { id: 1, name: "Heavyweight", weight: null },
          nationality: null,
          country: null,
          birthdate: null,
          birthplace: null,
          age: null,
          height: null,
          reach: null,
          stance: null,
          wins: null,
          losses: null,
          draws: null,
          no_contests: null,
        },
      ];

      store.getState().setFighters("all", fighters);
      expect(store.getState().getFighters("all")).toEqual(fighters);
    });
  });

  describe("setFights/getFights", () => {
    it("should set and get fights cache", () => {
      const fights = [
        {
          id: 1,
          date: "2023-07-15",
          time: "22:00",
          timestamp: 1689458400,
          timezone: "UTC",
          league: { id: 1, name: "UFC", type: "League", logo: null },
          category: { id: 1, name: "Heavyweight", weight: null },
          slug: "fight-slug",
          status: { long: "Finished", short: "FT" },
          fighters: {
            first: {
              id: 1,
              name: "Fighter 1",
              nickname: null,
              image: null,
              category: { id: 1, name: "Heavyweight", weight: null },
              nationality: null,
              country: null,
              birthdate: null,
              birthplace: null,
              age: null,
              height: null,
              reach: null,
              stance: null,
              wins: null,
              losses: null,
              draws: null,
              no_contests: null,
            },
            second: {
              id: 2,
              name: "Fighter 2",
              nickname: null,
              image: null,
              category: { id: 1, name: "Heavyweight", weight: null },
              nationality: null,
              country: null,
              birthdate: null,
              birthplace: null,
              age: null,
              height: null,
              reach: null,
              stance: null,
              wins: null,
              losses: null,
              draws: null,
              no_contests: null,
            },
          },
          result: { winner: null, method: null, round: null, time: null },
        },
      ];

      store.getState().setFights("2023-07-15", fights);
      expect(store.getState().getFights("2023-07-15")).toEqual(fights);
    });
  });

  describe("isCacheValid", () => {
    it("should return true for recent timestamp", () => {
      expect(store.getState().isCacheValid(Date.now() - 1000)).toBe(true);
    });

    it("should return false for old timestamp", () => {
      expect(
        store.getState().isCacheValid(Date.now() - 1000 * 60 * 60 * 24),
      ).toBe(false);
    });
  });

  describe("clearCache", () => {
    it("should clear all cached data", () => {
      store.getState().setTimezones(["UTC"]);
      store.getState().setLeagues("test", []);

      store.getState().clearCache();

      expect(store.getState().timezones).toBeNull();
      expect(store.getState().leagues.size).toBe(0);
    });
  });

  describe("setCacheTTL", () => {
    it("should update cache TTL", () => {
      store.getState().setCacheTTL(1000 * 60 * 30);
      expect(store.getState().cacheTTL).toBe(1000 * 60 * 30);
    });
  });
});
