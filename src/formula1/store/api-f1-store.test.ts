/**
 * @module api-f1-store.test
 * @description Tests for API-Formula-1 store
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { createApiF1Store } from "./api-f1-store";
import type { StorageAdapter } from "../../utils/cache-utils";

describe("ApiF1Store", () => {
  let store: ReturnType<typeof createApiF1Store>;
  let mockStorage: StorageAdapter;

  beforeEach(() => {
    mockStorage = {
      getItem: vi.fn().mockResolvedValue(null),
      setItem: vi.fn().mockResolvedValue(undefined),
      removeItem: vi.fn().mockResolvedValue(undefined),
    };

    store = createApiF1Store(mockStorage);
    store.getState().clearCache();
  });

  describe("initial state", () => {
    it("should have null initial values for simple caches", () => {
      const state = store.getState();
      expect(state.timezones).toBeNull();
      expect(state.seasons).toBeNull();
    });

    it("should have empty Maps for keyed caches", () => {
      const state = store.getState();
      expect(state.circuits.size).toBe(0);
      expect(state.teams.size).toBe(0);
      expect(state.drivers.size).toBe(0);
      expect(state.races.size).toBe(0);
    });
  });

  describe("setTimezones", () => {
    it("should set timezones cache", () => {
      const timezones = ["UTC", "Europe/Monaco"];
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

  describe("setCircuits/getCircuits", () => {
    it("should set and get circuits cache", () => {
      const circuits = [
        {
          id: 1,
          name: "Circuit de Monaco",
          image: null,
          competition: {
            id: 1,
            name: "Monaco Grand Prix",
            location: { country: "Monaco", city: "Monte Carlo" },
          },
          first_grand_prix: 1950,
          laps: 78,
          length: "3.337 km",
          race_distance: "260.286 km",
          lap_record: null,
          capacity: 37000,
          opened: 1929,
          owner: null,
        },
      ];

      store.getState().setCircuits("all", circuits);
      const result = store.getState().getCircuits("all");

      expect(result).toEqual(circuits);
    });

    it("should return null for non-existent key", () => {
      const result = store.getState().getCircuits("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("setTeams/getTeams", () => {
    it("should set and get teams cache", () => {
      const teams = [
        {
          id: 1,
          name: "Red Bull Racing",
          logo: null,
          base: "Milton Keynes, UK",
          first_team_entry: 2005,
          world_championships: 6,
          highest_race_finish: { position: 1, number: 100 },
          pole_positions: 90,
          fastest_laps: 85,
          president: null,
          director: "Christian Horner",
          technical_manager: null,
          chassis: "RB19",
          engine: "Honda RBPT",
          tyres: "Pirelli",
        },
      ];

      store.getState().setTeams("all", teams);
      const result = store.getState().getTeams("all");

      expect(result).toEqual(teams);
    });
  });

  describe("setDrivers/getDrivers", () => {
    it("should set and get drivers cache", () => {
      const drivers = [
        {
          id: 1,
          name: "Max Verstappen",
          abbr: "VER",
          number: 1,
          image: null,
          nationality: "Dutch",
          country: { name: "Netherlands", code: "NL" },
          birthdate: "1997-09-30",
          birthplace: "Hasselt, Belgium",
          grands_prix_entered: 180,
          world_championships: 3,
          podiums: 98,
          highest_race_finish: { position: 1, number: 54 },
          highest_grid_position: 1,
          career_points: "2586.5",
          teams: [],
        },
      ];

      store.getState().setDrivers("all", drivers);
      const result = store.getState().getDrivers("all");

      expect(result).toEqual(drivers);
    });
  });

  describe("setRaces/getRaces", () => {
    it("should set and get races cache", () => {
      const races = [
        {
          id: 1,
          competition: {
            id: 1,
            name: "Monaco Grand Prix",
            location: { country: "Monaco", city: "Monte Carlo" },
          },
          circuit: {
            id: 1,
            name: "Circuit de Monaco",
            image: null,
            competition: {
              id: 1,
              name: "Monaco Grand Prix",
              location: { country: "Monaco", city: "Monte Carlo" },
            },
            first_grand_prix: 1950,
            laps: 78,
            length: "3.337 km",
            race_distance: "260.286 km",
            lap_record: null,
            capacity: 37000,
            opened: 1929,
            owner: null,
          },
          season: 2023,
          type: "Race",
          laps: { current: 78, total: 78 },
          fastest_lap: null,
          distance: "260.286 km",
          timezone: "UTC",
          date: "2023-05-28T13:00:00+00:00",
          weather: "Sunny",
          status: { short: "FT", long: "Finished" },
        },
      ];

      store.getState().setRaces("2023", races);
      const result = store.getState().getRaces("2023");

      expect(result).toEqual(races);
    });
  });

  describe("setDriverRankings/getDriverRankings", () => {
    it("should set and get driver rankings cache", () => {
      const rankings = [
        {
          position: 1,
          driver: {
            id: 1,
            name: "Max Verstappen",
            abbr: "VER",
            number: 1,
            image: null,
            nationality: "Dutch",
            country: null,
            birthdate: null,
            birthplace: null,
            grands_prix_entered: null,
            world_championships: null,
            podiums: null,
            highest_race_finish: null,
            highest_grid_position: null,
            career_points: null,
            teams: [],
          },
          team: {
            id: 1,
            name: "Red Bull Racing",
            logo: null,
            base: null,
            first_team_entry: null,
            world_championships: null,
            highest_race_finish: null,
            pole_positions: null,
            fastest_laps: null,
            president: null,
            director: null,
            technical_manager: null,
            chassis: null,
            engine: null,
            tyres: null,
          },
          points: 575,
          wins: 19,
          behind: null,
          season: 2023,
        },
      ];

      store.getState().setDriverRankings("2023", rankings);
      const result = store.getState().getDriverRankings("2023");

      expect(result).toEqual(rankings);
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
      store.getState().setTimezones(["UTC"]);
      store.getState().setSeasons([2023]);
      store.getState().setCircuits("test", []);

      store.getState().clearCache();

      const state = store.getState();
      expect(state.timezones).toBeNull();
      expect(state.seasons).toBeNull();
      expect(state.circuits.size).toBe(0);
    });
  });

  describe("setCacheTTL", () => {
    it("should update cache TTL", () => {
      store.getState().setCacheTTL(1000 * 60 * 30);
      expect(store.getState().cacheTTL).toBe(1000 * 60 * 30);
    });
  });
});
