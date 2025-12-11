/**
 * @module api-mma-client.test
 * @description Tests for API-MMA client
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NetworkClient } from "@sudobility/types";
import { ApiMmaClient, createApiMmaClient } from "./api-mma-client";
import { MMA_ENDPOINTS } from "./mma-endpoints";

describe("ApiMmaClient", () => {
  let mockNetworkClient: NetworkClient;
  let client: ApiMmaClient;

  beforeEach(() => {
    mockNetworkClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    client = new ApiMmaClient(mockNetworkClient, {
      apiKey: "test-api-key",
    });
  });

  describe("constructor", () => {
    it("should create client with API Sports headers", () => {
      const newClient = new ApiMmaClient(mockNetworkClient, {
        apiKey: "test-key",
      });
      expect(newClient).toBeDefined();
    });

    it("should create client with RapidAPI headers", () => {
      const newClient = new ApiMmaClient(mockNetworkClient, {
        apiKey: "test-key",
        useRapidApi: true,
        rapidApiHost: "api-mma.p.rapidapi.com",
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
          response: ["UTC", "America/Las_Vegas"],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);

      const result = await client.getTimezone();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        expect.stringContaining(MMA_ENDPOINTS.TIMEZONE),
        expect.any(Object),
      );
      expect(result.response).toEqual(["UTC", "America/Las_Vegas"]);
    });
  });

  // Note: MMA API does not have a /leagues endpoint

  describe("getCategories", () => {
    it("should fetch categories", async () => {
      const mockResponse = {
        data: {
          get: "categories",
          parameters: {},
          errors: [],
          results: 1,
          response: [{ id: 1, name: "Heavyweight", weight: "265 lbs" }],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);
      const result = await client.getCategories();
      expect(result.results).toBe(1);
    });
  });

  describe("getFighters", () => {
    it("should fetch fighters", async () => {
      const mockResponse = {
        data: {
          get: "fighters",
          parameters: {},
          errors: [],
          results: 1,
          response: [
            {
              id: 1,
              name: "Fighter Name",
              nickname: "Nickname",
              image: null,
              category: { id: 1, name: "Heavyweight", weight: "265 lbs" },
              nationality: "USA",
              country: null,
              birthdate: null,
              birthplace: null,
              age: 30,
              height: "6'2\"",
              reach: "76\"",
              stance: "Orthodox",
              wins: { total: 20, knockouts: 10, submissions: 5, decisions: 5 },
              losses: { total: 5, knockouts: 2, submissions: 1, decisions: 2 },
              draws: 0,
              no_contests: 0,
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);
      const result = await client.getFighters();
      expect(result.results).toBe(1);
    });
  });

  describe("getFights", () => {
    it("should fetch fights", async () => {
      const mockResponse = {
        data: {
          get: "fights",
          parameters: {},
          errors: [],
          results: 1,
          response: [
            {
              id: 1,
              date: "2023-07-15",
              time: "22:00",
              timestamp: 1689458400,
              timezone: "UTC",
              league: { id: 1, name: "UFC", type: "League", logo: null },
              category: { id: 1, name: "Heavyweight", weight: "265 lbs" },
              slug: "fighter1-vs-fighter2",
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
              result: {
                winner: { id: 1, name: "Fighter 1" },
                method: "KO/TKO",
                round: 2,
                time: "3:45",
              },
            },
          ],
        },
      };

      vi.mocked(mockNetworkClient.get).mockResolvedValue(mockResponse);
      const result = await client.getFights({ date: "2023-07-15" });
      expect(result.results).toBe(1);
    });
  });

  describe("error handling", () => {
    it("should throw error when no data received", async () => {
      vi.mocked(mockNetworkClient.get).mockResolvedValue({ data: null });

      await expect(client.getTimezone()).rejects.toThrow(
        "No data received from API-MMA",
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

      await expect(client.getTimezone()).rejects.toThrow("API-MMA error");
    });
  });

  describe("createApiMmaClient", () => {
    it("should create client using factory function", () => {
      const newClient = createApiMmaClient(mockNetworkClient, {
        apiKey: "test-key",
      });
      expect(newClient).toBeInstanceOf(ApiMmaClient);
    });
  });
});
