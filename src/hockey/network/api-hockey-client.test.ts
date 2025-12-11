/**
 * Tests for ApiHockeyClient
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { ApiHockeyClient } from "./api-hockey-client";
import type { NetworkClient } from "@sudobility/types";

describe("ApiHockeyClient", () => {
  let client: ApiHockeyClient;
  let mockNetworkClient: NetworkClient;

  beforeEach(() => {
    mockNetworkClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    client = new ApiHockeyClient(mockNetworkClient, {
      apiKey: "test-api-key",
    });
  });

  describe("constructor", () => {
    it("should create instance with direct API authentication", () => {
      expect(client).toBeDefined();
    });

    it("should create instance with RapidAPI authentication", () => {
      const rapidClient = new ApiHockeyClient(mockNetworkClient, {
        apiKey: "rapid-api-key",
        useRapidApi: true,
        rapidApiHost: "api-hockey.p.rapidapi.com",
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
          response: ["Europe/London", "America/New_York"],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getTimezone();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        "https://v1.hockey.api-sports.io/timezone",
        expect.any(Object),
      );
      expect(result.response).toEqual(["Europe/London", "America/New_York"]);
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
        "https://v1.hockey.api-sports.io/countries",
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
        "https://v1.hockey.api-sports.io/countries?name=USA",
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
              league: { id: 57, name: "NHL", type: "League", logo: null },
              country: { id: 1, name: "USA", code: "US", flag: null },
              seasons: [],
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getLeagues();

      expect(result.response[0].league.name).toBe("NHL");
    });
  });

  describe("getTeams", () => {
    it("should fetch teams with params", async () => {
      const mockResponse = {
        data: {
          get: "teams",
          parameters: { league: "57", season: "2023" },
          errors: [],
          results: 1,
          response: [
            {
              team: { id: 1, name: "Boston Bruins", logo: null, national: false },
              country: { id: 1, name: "USA", code: "US", flag: null },
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getTeams({ league: 57, season: 2023 });

      expect(result.response[0].team.name).toBe("Boston Bruins");
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
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getGames();

      expect(result.response[0].teams.home.name).toBe("Boston Bruins");
    });
  });

  describe("getStandings", () => {
    it("should fetch standings", async () => {
      const mockResponse = {
        data: {
          get: "standings",
          parameters: { league: "57", season: "2023" },
          errors: [],
          results: 1,
          response: [
            {
              position: 1,
              stage: "Regular Season",
              group: { name: "Eastern Conference", points: null },
              team: { id: 1, name: "Boston Bruins", logo: null },
              league: {
                id: 57,
                name: "NHL",
                type: "League",
                season: 2023,
                logo: null,
              },
              country: { id: 1, name: "USA", code: "US", flag: null },
              games: {
                played: 50,
                win: 35,
                win_overtime: 3,
                lose: 12,
                lose_overtime: 0,
              },
              points: { for: 175, against: 120 },
              form: "WWWLW",
              description: null,
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getStandings({
        league: 57,
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
        "API-Hockey error: Invalid API key",
      );
    });

    it("should throw error when no data received", async () => {
      vi.mocked(mockNetworkClient.get).mockResolvedValue({ data: null });

      await expect(client.getLeagues()).rejects.toThrow(
        "No data received from API-Hockey",
      );
    });
  });
});
