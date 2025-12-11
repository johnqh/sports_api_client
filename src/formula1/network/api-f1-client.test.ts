/**
 * @module api-f1-client.test
 * @description Tests for API-Formula-1 client
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NetworkClient } from "@sudobility/types";
import { ApiF1Client, createApiF1Client } from "./api-f1-client";
import { F1_ENDPOINTS } from "./f1-endpoints";

describe("ApiF1Client", () => {
  let mockNetworkClient: NetworkClient;
  let client: ApiF1Client;

  beforeEach(() => {
    mockNetworkClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    client = new ApiF1Client(mockNetworkClient, {
      apiKey: "test-api-key",
    });
  });

  describe("constructor", () => {
    it("should create client with API Sports headers", () => {
      const newClient = new ApiF1Client(mockNetworkClient, {
        apiKey: "test-key",
      });
      expect(newClient).toBeDefined();
    });

    it("should create client with RapidAPI headers", () => {
      const newClient = new ApiF1Client(mockNetworkClient, {
        apiKey: "test-key",
        useRapidApi: true,
        rapidApiHost: "api-formula-1.p.rapidapi.com",
      });
      expect(newClient).toBeDefined();
    });
  });

  describe("getTimezone", () => {
    it("should fetch timezones", async () => {
      const mockResponse = {
        data: {
          get: "timezone",
          parameters: {},
          errors: [],
          results: 2,
          response: ["UTC", "Europe/Monaco"],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getTimezone();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining(F1_ENDPOINTS.TIMEZONE),
        expect.any(Object),
      );
      expect(result.response).toEqual(["UTC", "Europe/Monaco"]);
    });
  });

  describe("getSeasons", () => {
    it("should fetch seasons", async () => {
      const mockResponse = {
        data: {
          get: "seasons",
          parameters: {},
          errors: [],
          results: 3,
          response: [2021, 2022, 2023],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getSeasons();

      expect(result.response).toEqual([2021, 2022, 2023]);
    });
  });

  describe("getCircuits", () => {
    it("should fetch circuits", async () => {
      const mockResponse = {
        data: {
          get: "circuits",
          parameters: {},
          errors: [],
          results: 1,
          response: [
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
              lap_record: { time: "1:12.909", driver: "Hamilton", year: "2021" },
              capacity: 37000,
              opened: 1929,
              owner: null,
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getCircuits();

      expect(result.results).toBe(1);
    });
  });

  describe("getTeams", () => {
    it("should fetch teams", async () => {
      const mockResponse = {
        data: {
          get: "teams",
          parameters: {},
          errors: [],
          results: 1,
          response: [
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
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getTeams();

      expect(result.results).toBe(1);
    });
  });

  describe("getDrivers", () => {
    it("should fetch drivers", async () => {
      const mockResponse = {
        data: {
          get: "drivers",
          parameters: {},
          errors: [],
          results: 1,
          response: [
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
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getDrivers();

      expect(result.results).toBe(1);
    });
  });

  describe("getRaces", () => {
    it("should fetch races", async () => {
      const mockResponse = {
        data: {
          get: "races",
          parameters: { season: "2023" },
          errors: [],
          results: 1,
          response: [
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
              fastest_lap: { driver: { id: 1 }, time: "1:12.909" },
              distance: "260.286 km",
              timezone: "UTC",
              date: "2023-05-28T13:00:00+00:00",
              weather: "Sunny",
              status: { short: "FT", long: "Finished" },
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getRaces({ season: 2023 });

      expect(result.results).toBe(1);
    });
  });

  describe("getDriverRankings", () => {
    it("should fetch driver rankings", async () => {
      const mockResponse = {
        data: {
          get: "rankings/drivers",
          parameters: { season: "2023" },
          errors: [],
          results: 1,
          response: [
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
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getDriverRankings({ season: 2023 });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining(F1_ENDPOINTS.RANKINGS_DRIVERS),
        expect.any(Object),
      );
      expect(result.results).toBe(1);
    });
  });

  describe("error handling", () => {
    it("should throw error when no data received", async () => {
      vi.mocked(mockNetworkClient.get).mockResolvedValue({ data: null });

      await expect(client.getTimezone()).rejects.toThrow(
        "No data received from API-Formula-1",
      );
    });

    it("should throw error when API returns errors", async () => {
      vi.mocked(mockNetworkClient.get).mockResolvedValue({
        data: {
          get: "timezone",
          parameters: {},
          errors: { token: "Invalid API key" },
          results: 0,
          response: [],
        },
      });

      await expect(client.getTimezone()).rejects.toThrow(
        "API-Formula-1 error",
      );
    });
  });

  describe("createApiF1Client", () => {
    it("should create client using factory function", () => {
      const newClient = createApiF1Client(mockNetworkClient, {
        apiKey: "test-key",
      });
      expect(newClient).toBeInstanceOf(ApiF1Client);
    });
  });
});
