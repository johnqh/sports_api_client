/**
 * Tests for ApiNflClient
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { ApiNflClient } from "./api-nfl-client";
import type { NetworkClient } from "@sudobility/types";

describe("ApiNflClient", () => {
  let client: ApiNflClient;
  let mockNetworkClient: NetworkClient;

  beforeEach(() => {
    mockNetworkClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    client = new ApiNflClient(mockNetworkClient, {
      apiKey: "test-api-key",
    });
  });

  describe("constructor", () => {
    it("should create instance with direct API authentication", () => {
      expect(client).toBeDefined();
    });

    it("should create instance with RapidAPI authentication", () => {
      const rapidClient = new ApiNflClient(mockNetworkClient, {
        apiKey: "rapid-api-key",
        useRapidApi: true,
        rapidApiHost: "api-american-football.p.rapidapi.com",
      });
      expect(rapidClient).toBeDefined();
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
          response: ["America/New_York", "America/Los_Angeles"],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getTimezone();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        "https://v1.american-football.api-sports.io/timezone",
        expect.any(Object),
      );
      expect(result.response).toEqual([
        "America/New_York",
        "America/Los_Angeles",
      ]);
    });
  });

  describe("getCountries", () => {
    it("should fetch countries without params", async () => {
      const mockResponse = {
        data: {
          get: "countries",
          parameters: {},
          errors: [],
          results: 1,
          response: [{ id: 1, name: "USA", code: "US", flag: null }],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getCountries();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        "https://v1.american-football.api-sports.io/countries",
        expect.any(Object),
      );
      expect(result.results).toBe(1);
    });

    it("should fetch countries with params", async () => {
      const mockResponse = {
        data: {
          get: "countries",
          parameters: { name: "USA" },
          errors: [],
          results: 1,
          response: [{ id: 1, name: "USA", code: "US", flag: null }],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      await client.getCountries({ name: "USA" });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        "https://v1.american-football.api-sports.io/countries?name=USA",
        expect.any(Object),
      );
    });
  });

  describe("getLeagues", () => {
    it("should fetch leagues", async () => {
      const mockResponse = {
        data: {
          get: "leagues",
          parameters: {},
          errors: [],
          results: 1,
          response: [
            {
              league: { id: 1, name: "NFL", type: "League", logo: null },
              country: { id: 1, name: "USA", code: "US", flag: null },
              seasons: [],
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getLeagues();

      expect(result.response[0].league.name).toBe("NFL");
    });
  });

  describe("getTeams", () => {
    it("should fetch teams with params", async () => {
      const mockResponse = {
        data: {
          get: "teams",
          parameters: { league: "1", season: "2023" },
          errors: [],
          results: 1,
          response: [
            {
              team: {
                id: 1,
                name: "New England Patriots",
                logo: null,
                city: "New England",
                code: "NE",
                coach: null,
                owner: null,
                stadium: "Gillette Stadium",
                capacity: 65878,
                established: 1959,
                national: false,
              },
              country: { id: 1, name: "USA", code: "US", flag: null },
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getTeams({ league: 1, season: 2023 });

      expect(result.response[0].team.name).toBe("New England Patriots");
    });
  });

  describe("getGames", () => {
    it("should fetch games", async () => {
      const mockResponse = {
        data: {
          get: "games",
          parameters: {},
          errors: [],
          results: 1,
          response: [
            {
              id: 1,
              date: "2024-01-15",
              time: "13:00",
              timestamp: 1705323600,
              timezone: "UTC",
              stage: "Regular Season",
              week: "Week 18",
              status: { long: "Finished", short: "FT", timer: null },
              league: {
                id: 1,
                name: "NFL",
                type: "League",
                season: 2023,
                logo: null,
              },
              country: { id: 1, name: "USA", code: "US", flag: null },
              teams: {
                home: { id: 1, name: "Patriots", logo: null },
                away: { id: 2, name: "Bills", logo: null },
              },
              scores: {
                home: {
                  quarter_1: 7,
                  quarter_2: 10,
                  quarter_3: 3,
                  quarter_4: 7,
                  overtime: null,
                  total: 27,
                },
                away: {
                  quarter_1: 3,
                  quarter_2: 7,
                  quarter_3: 7,
                  quarter_4: 3,
                  overtime: null,
                  total: 20,
                },
              },
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getGames();

      expect(result.response[0].teams.home.name).toBe("Patriots");
    });
  });

  describe("getStandings", () => {
    it("should fetch standings", async () => {
      const mockResponse = {
        data: {
          get: "standings",
          parameters: { league: "1", season: "2023" },
          errors: [],
          results: 1,
          response: [
            {
              position: 1,
              stage: "Regular Season",
              group: { name: "AFC East", points: null },
              team: { id: 2, name: "Buffalo Bills", logo: null },
              league: {
                id: 1,
                name: "NFL",
                type: "League",
                season: 2023,
                logo: null,
              },
              country: { id: 1, name: "USA", code: "US", flag: null },
              games: { played: 17, win: 11, lose: 6, ties: 0 },
              points: { for: 451, against: 311, difference: 140 },
              win_percentage: ".647",
              form: "WWLWW",
              description: "Playoff Berth",
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getStandings({
        league: 1,
        season: 2023,
      });

      expect(result.response[0].position).toBe(1);
    });
  });

  describe("error handling", () => {
    it("should throw error when API returns errors", async () => {
      const mockResponse = {
        data: {
          get: "leagues",
          parameters: {},
          errors: { token: "Invalid API key" },
          results: 0,
          response: [],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      await expect(client.getLeagues()).rejects.toThrow(
        "API-NFL error: Invalid API key",
      );
    });

    it("should throw error when no data received", async () => {
      vi.mocked(mockNetworkClient.get).mockResolvedValue({ data: null });

      await expect(client.getLeagues()).rejects.toThrow(
        "No data received from API-NFL",
      );
    });
  });
});
