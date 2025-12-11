/**
 * @module volleyball/network/api-volleyball-client.test
 * @description Tests for ApiVolleyballClient
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NetworkClient } from "@sudobility/types";
import { ApiVolleyballClient } from "./api-volleyball-client";
import {
  VOLLEYBALL_API_BASE_URL,
  VOLLEYBALL_ENDPOINTS,
} from "./volleyball-endpoints";

describe("ApiVolleyballClient", () => {
  let mockNetworkClient: NetworkClient;
  let client: ApiVolleyballClient;

  beforeEach(() => {
    mockNetworkClient = {
      get: vi.fn().mockResolvedValue({
        data: {
          get: "test",
          parameters: {},
          errors: [],
          results: 0,
          response: [],
        },
      }),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    client = new ApiVolleyballClient(mockNetworkClient, {
      apiKey: "test-api-key",
    });
  });

  describe("getTimezones", () => {
    it("should call the timezone endpoint", async () => {
      await client.getTimezones();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        `${VOLLEYBALL_API_BASE_URL}${VOLLEYBALL_ENDPOINTS.TIMEZONE}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-apisports-key": "test-api-key",
          }),
        }),
      );
    });
  });

  describe("getCountries", () => {
    it("should call the countries endpoint with params", async () => {
      await client.getCountries({ name: "Brazil" });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        `${VOLLEYBALL_API_BASE_URL}${VOLLEYBALL_ENDPOINTS.COUNTRIES}?name=Brazil`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-apisports-key": "test-api-key",
          }),
        }),
      );
    });
  });

  describe("getSeasons", () => {
    it("should call the seasons endpoint", async () => {
      await client.getSeasons();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        `${VOLLEYBALL_API_BASE_URL}${VOLLEYBALL_ENDPOINTS.SEASONS}`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-apisports-key": "test-api-key",
          }),
        }),
      );
    });
  });

  describe("getLeagues", () => {
    it("should call the leagues endpoint with params", async () => {
      await client.getLeagues({ country: "Italy", season: 2024 });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        `${VOLLEYBALL_API_BASE_URL}${VOLLEYBALL_ENDPOINTS.LEAGUES}?country=Italy&season=2024`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-apisports-key": "test-api-key",
          }),
        }),
      );
    });
  });

  describe("getTeams", () => {
    it("should call the teams endpoint with params", async () => {
      await client.getTeams({ league: 1, season: 2024 });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        `${VOLLEYBALL_API_BASE_URL}${VOLLEYBALL_ENDPOINTS.TEAMS}?league=1&season=2024`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-apisports-key": "test-api-key",
          }),
        }),
      );
    });
  });

  describe("getStandings", () => {
    it("should call the standings endpoint with required params", async () => {
      await client.getStandings({ league: 1, season: 2024 });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        `${VOLLEYBALL_API_BASE_URL}${VOLLEYBALL_ENDPOINTS.STANDINGS}?league=1&season=2024`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-apisports-key": "test-api-key",
          }),
        }),
      );
    });
  });

  describe("getGames", () => {
    it("should call the games endpoint with params", async () => {
      await client.getGames({ league: 1, season: 2024, date: "2024-01-15" });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        `${VOLLEYBALL_API_BASE_URL}${VOLLEYBALL_ENDPOINTS.GAMES}?league=1&season=2024&date=2024-01-15`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-apisports-key": "test-api-key",
          }),
        }),
      );
    });
  });

  describe("getH2H", () => {
    it("should call the h2h endpoint with params", async () => {
      await client.getH2H({ h2h: "1-2" });

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        `${VOLLEYBALL_API_BASE_URL}${VOLLEYBALL_ENDPOINTS.H2H}?h2h=1-2`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-apisports-key": "test-api-key",
          }),
        }),
      );
    });
  });

  describe("custom baseUrl", () => {
    it("should use custom baseUrl when provided", async () => {
      const customClient = new ApiVolleyballClient(mockNetworkClient, {
        apiKey: "test-api-key",
        baseUrl: "https://custom.api.com",
      });

      await customClient.getTimezones();

      expect(mockNetworkClient.get).toHaveBeenCalledWith(
        `https://custom.api.com${VOLLEYBALL_ENDPOINTS.TIMEZONE}`,
        expect.any(Object),
      );
    });
  });
});
