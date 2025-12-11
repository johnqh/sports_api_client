/**
 * @module api-rugby-client.test
 * @description Tests for API-Rugby client
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NetworkClient } from "@sudobility/types";
import { ApiRugbyClient, createApiRugbyClient } from "./api-rugby-client";
import { RUGBY_ENDPOINTS } from "./rugby-endpoints";

describe("ApiRugbyClient", () => {
  let mockNetworkClient: NetworkClient;
  let client: ApiRugbyClient;

  beforeEach(() => {
    mockNetworkClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    client = new ApiRugbyClient(mockNetworkClient, {
      apiKey: "test-api-key",
    });
  });

  describe("constructor", () => {
    it("should create client with API Sports headers", () => {
      const newClient = new ApiRugbyClient(mockNetworkClient, {
        apiKey: "test-key",
      });
      expect(newClient).toBeDefined();
    });

    it("should create client with RapidAPI headers", () => {
      const newClient = new ApiRugbyClient(mockNetworkClient, {
        apiKey: "test-key",
        useRapidApi: true,
        rapidApiHost: "api-rugby.p.rapidapi.com",
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
          response: ["UTC", "Europe/London"],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getTimezone();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining(RUGBY_ENDPOINTS.TIMEZONE),
        expect.any(Object),
      );
      expect(result.response).toEqual(["UTC", "Europe/London"]);
    });
  });

  describe("getCountries", () => {
    it("should fetch countries", async () => {
      const mockResponse = {
        data: {
          get: "countries",
          parameters: {},
          errors: [],
          results: 1,
          response: [{ id: 1, name: "England", code: "GB", flag: "flag.png" }],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getCountries();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining(RUGBY_ENDPOINTS.COUNTRIES),
        expect.any(Object),
      );
      expect(result.results).toBe(1);
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

  describe("getLeagues", () => {
    it("should fetch leagues with params", async () => {
      const mockResponse = {
        data: {
          get: "leagues",
          parameters: { country: "England" },
          errors: [],
          results: 1,
          response: [
            {
              league: {
                id: 1,
                name: "Premiership Rugby",
                type: "League",
                logo: null,
              },
              country: { id: 1, name: "England", code: "GB", flag: null },
              seasons: [
                { season: "2023-2024", start: "2023-09-01", end: "2024-06-01" },
              ],
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getLeagues({ country: "England" });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining("country=England"),
        expect.any(Object),
      );
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
              team: { id: 1, name: "Harlequins", logo: null, national: false },
              country: { id: 1, name: "England", code: "GB", flag: null },
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getTeams();

      expect(result.results).toBe(1);
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
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getGames({ date: "2023-09-15" });

      expect(result.results).toBe(1);
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
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getStandings({ league: 1, season: "2023" });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining(RUGBY_ENDPOINTS.STANDINGS),
        expect.any(Object),
      );
      expect(result.results).toBe(1);
    });
  });

  describe("error handling", () => {
    it("should throw error when no data received", async () => {
      vi.mocked(mockNetworkClient.get).mockResolvedValue({ data: null });

      await expect(client.getTimezone()).rejects.toThrow(
        "No data received from API-Rugby",
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

      await expect(client.getTimezone()).rejects.toThrow("API-Rugby error");
    });
  });

  describe("createApiRugbyClient", () => {
    it("should create client using factory function", () => {
      const newClient = createApiRugbyClient(mockNetworkClient, {
        apiKey: "test-key",
      });
      expect(newClient).toBeInstanceOf(ApiRugbyClient);
    });
  });
});
