/**
 * @module api-baseball-client.test
 * @description Tests for API-Baseball client
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NetworkClient } from "@sudobility/types";
import { ApiBaseballClient, createApiBaseballClient } from "./api-baseball-client";
import { BASEBALL_ENDPOINTS } from "./baseball-endpoints";

describe("ApiBaseballClient", () => {
  let mockNetworkClient: NetworkClient;
  let client: ApiBaseballClient;

  beforeEach(() => {
    mockNetworkClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    client = new ApiBaseballClient(mockNetworkClient, {
      apiKey: "test-api-key",
    });
  });

  describe("constructor", () => {
    it("should create client with API Sports headers", () => {
      const newClient = new ApiBaseballClient(mockNetworkClient, {
        apiKey: "test-key",
      });
      expect(newClient).toBeDefined();
    });

    it("should create client with RapidAPI headers", () => {
      const newClient = new ApiBaseballClient(mockNetworkClient, {
        apiKey: "test-key",
        useRapidApi: true,
        rapidApiHost: "api-baseball.p.rapidapi.com",
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
          response: ["UTC", "America/New_York"],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getTimezone();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining(BASEBALL_ENDPOINTS.TIMEZONE),
        expect.any(Object),
      );
      expect(result.response).toEqual(["UTC", "America/New_York"]);
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
          response: [{ id: 1, name: "USA", code: "US", flag: "flag.png" }],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getCountries();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining(BASEBALL_ENDPOINTS.COUNTRIES),
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
          parameters: { country: "USA" },
          errors: [],
          results: 1,
          response: [
            {
              league: { id: 1, name: "MLB", type: "League", logo: null },
              country: { id: 1, name: "USA", code: "US", flag: null },
              seasons: [{ season: 2023, start: "2023-03-30", end: "2023-10-01" }],
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getLeagues({ country: "USA" });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining("country=USA"),
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
              team: { id: 1, name: "Yankees", logo: null, national: false },
              country: { id: 1, name: "USA", code: "US", flag: null },
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
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getGames({ date: "2023-07-15" });

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
              group: { name: "American League East" },
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
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getStandings({ league: 1, season: 2023 });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining(BASEBALL_ENDPOINTS.STANDINGS),
        expect.any(Object),
      );
      expect(result.results).toBe(1);
    });
  });

  describe("error handling", () => {
    it("should throw error when no data received", async () => {
      vi.mocked(mockNetworkClient.get).mockResolvedValue({ data: null });

      await expect(client.getTimezone()).rejects.toThrow(
        "No data received from API-Baseball",
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

      await expect(client.getTimezone()).rejects.toThrow("API-Baseball error");
    });
  });

  describe("createApiBaseballClient", () => {
    it("should create client using factory function", () => {
      const newClient = createApiBaseballClient(mockNetworkClient, {
        apiKey: "test-key",
      });
      expect(newClient).toBeInstanceOf(ApiBaseballClient);
    });
  });
});
