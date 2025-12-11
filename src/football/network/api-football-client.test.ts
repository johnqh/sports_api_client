/**
 * Tests for ApiFootballClient
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiFootballClient } from "./api-football-client";
import type { NetworkClient, NetworkResponse } from "@sudobility/types";

// Mock NetworkClient
const createMockNetworkClient = (): NetworkClient => ({
  request: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
});

// Helper to create mock response
const createMockResponse = <T>(data: T): NetworkResponse<T> => ({
  ok: true,
  status: 200,
  statusText: "OK",
  headers: {},
  data,
});

describe("ApiFootballClient", () => {
  let client: ApiFootballClient;
  let mockNetworkClient: NetworkClient;

  beforeEach(() => {
    mockNetworkClient = createMockNetworkClient();
    client = new ApiFootballClient(mockNetworkClient, {
      apiKey: "test-api-key",
    });
  });

  describe("constructor", () => {
    it("should create client with default base URL", () => {
      expect(client).toBeInstanceOf(ApiFootballClient);
    });

    it("should create client with custom base URL", () => {
      const customClient = new ApiFootballClient(mockNetworkClient, {
        apiKey: "test-api-key",
        baseUrl: "https://custom.api.com",
      });
      expect(customClient).toBeInstanceOf(ApiFootballClient);
    });

    it("should create client with RapidAPI configuration", () => {
      const rapidApiClient = new ApiFootballClient(mockNetworkClient, {
        apiKey: "test-rapidapi-key",
        useRapidApi: true,
        rapidApiHost: "api-football-v1.p.rapidapi.com",
      });
      expect(rapidApiClient).toBeInstanceOf(ApiFootballClient);
    });
  });

  describe("getTimezone", () => {
    it("should fetch timezones", async () => {
      const mockResponse = {
        get: "timezone",
        parameters: {},
        errors: [],
        results: 2,
        paging: { current: 1, total: 1 },
        response: ["Europe/London", "America/New_York"],
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(
        createMockResponse(mockResponse),
      );

      const result = await client.getTimezone();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        "https://v3.football.api-sports.io/timezone",
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-apisports-key": "test-api-key",
          }),
        }),
      );
      expect(result.response).toEqual(["Europe/London", "America/New_York"]);
    });
  });

  describe("getCountries", () => {
    it("should fetch all countries", async () => {
      const mockResponse = {
        get: "countries",
        parameters: {},
        errors: [],
        results: 2,
        paging: { current: 1, total: 1 },
        response: [
          { name: "England", code: "GB", flag: "https://example.com/gb.png" },
          { name: "Spain", code: "ES", flag: "https://example.com/es.png" },
        ],
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(
        createMockResponse(mockResponse),
      );

      const result = await client.getCountries();

      expect(result.response).toHaveLength(2);
      expect(result.response[0]?.name).toBe("England");
    });

    it("should fetch countries with search parameter", async () => {
      const mockResponse = {
        get: "countries",
        parameters: { search: "eng" },
        errors: [],
        results: 1,
        paging: { current: 1, total: 1 },
        response: [
          { name: "England", code: "GB", flag: "https://example.com/gb.png" },
        ],
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(
        createMockResponse(mockResponse),
      );

      const result = await client.getCountries({ search: "eng" });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining("search=eng"),
        expect.any(Object),
      );
      expect(result.response).toHaveLength(1);
    });
  });

  describe("getLeagues", () => {
    it("should fetch leagues with parameters", async () => {
      const mockResponse = {
        get: "leagues",
        parameters: { country: "England" },
        errors: [],
        results: 1,
        paging: { current: 1, total: 1 },
        response: [
          {
            league: {
              id: 39,
              name: "Premier League",
              type: "League",
              logo: "https://example.com/pl.png",
            },
            country: {
              name: "England",
              code: "GB",
              flag: "https://example.com/gb.png",
            },
            seasons: [],
          },
        ],
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(
        createMockResponse(mockResponse),
      );

      const result = await client.getLeagues({ country: "England" });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining("country=England"),
        expect.any(Object),
      );
      expect(result.response[0]?.league.name).toBe("Premier League");
    });
  });

  describe("error handling", () => {
    it("should throw error when no data received", async () => {
      vi.mocked(mockNetworkClient.get).mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: {},
        data: undefined,
      });

      await expect(client.getTimezone()).rejects.toThrow(
        "No data received from API-Football",
      );
    });

    it("should throw error when API returns errors", async () => {
      const mockResponse = {
        get: "timezone",
        parameters: {},
        errors: { token: "Invalid API key" },
        results: 0,
        paging: { current: 1, total: 1 },
        response: [],
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(
        createMockResponse(mockResponse),
      );

      await expect(client.getTimezone()).rejects.toThrow(
        "API-Football error: Invalid API key",
      );
    });
  });
});
