/**
 * @module api-f1-client
 * @description API-Formula-1 Client Library
 *
 * A TypeScript client for the API-Formula-1 API that provides type-safe
 * access to F1 data including races, drivers, teams, circuits, and more.
 *
 * @example
 * ```typescript
 * import { ApiF1Client } from "@sudobility/sports_api_client";
 *
 * const client = new ApiF1Client(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const races = await client.getRaces({ season: 2023 });
 * ```
 */

import type { NetworkClient } from "@sudobility/types";
import type {
  ApiF1Config,
  ApiF1Response,
  F1Circuit,
  F1CircuitsParams,
  F1Competition,
  F1CompetitionsParams,
  F1Driver,
  F1DriverRanking,
  F1DriverRankingsParams,
  F1DriversParams,
  F1PitStop,
  F1PitStopsParams,
  F1Race,
  F1RacesParams,
  F1SeasonsParams,
  F1Team,
  F1TeamRanking,
  F1TeamRankingsParams,
  F1TeamsParams,
  F1Timezone,
} from "../types";
import { buildQueryString } from "../../utils/query-params";
import {
  F1_API_BASE_URL,
  F1_DEFAULT_HEADERS,
  F1_ENDPOINTS,
  F1_RAPIDAPI_HOST,
} from "./f1-endpoints";

/**
 * API-Formula-1 Client class
 *
 * Provides type-safe methods for all API-Formula-1 endpoints.
 */
export class ApiF1Client {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

  /**
   * Create a new ApiF1Client instance
   *
   * @param networkClient - NetworkClient instance for making HTTP requests
   * @param config - API configuration including API key
   */
  constructor(networkClient: NetworkClient, config: ApiF1Config) {
    this.networkClient = networkClient;
    this.baseUrl = config.baseUrl || F1_API_BASE_URL;

    // Set up authentication headers
    if (config.useRapidApi && config.rapidApiHost) {
      this.headers = {
        ...F1_DEFAULT_HEADERS,
        "x-rapidapi-host": config.rapidApiHost || F1_RAPIDAPI_HOST,
        "x-rapidapi-key": config.apiKey,
      };
    } else {
      this.headers = {
        ...F1_DEFAULT_HEADERS,
        "x-apisports-key": config.apiKey,
      };
    }
  }

  /**
   * Make a GET request to the API
   */
  private async request<T>(endpoint: string): Promise<ApiF1Response<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiF1Response<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new Error("No data received from API-Formula-1");
    }

    // Check for API errors
    const data = response.data as ApiF1Response<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new Error(`API-Formula-1 error: ${errorMsg}`);
    }

    return data;
  }

  // ============================================================================
  // General Endpoints
  // ============================================================================

  /**
   * Get all available timezones
   */
  async getTimezone(): Promise<ApiF1Response<F1Timezone>> {
    return this.request<F1Timezone>(F1_ENDPOINTS.TIMEZONE);
  }

  /**
   * Get all available seasons
   */
  async getSeasons(params?: F1SeasonsParams): Promise<ApiF1Response<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(`${F1_ENDPOINTS.SEASONS}${query}`);
  }

  // ============================================================================
  // Circuits Endpoints
  // ============================================================================

  /**
   * Get circuits with optional filtering
   */
  async getCircuits(
    params?: F1CircuitsParams,
  ): Promise<ApiF1Response<F1Circuit>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<F1Circuit>(`${F1_ENDPOINTS.CIRCUITS}${query}`);
  }

  // ============================================================================
  // Competitions Endpoints
  // ============================================================================

  /**
   * Get competitions (Grand Prix events)
   */
  async getCompetitions(
    params?: F1CompetitionsParams,
  ): Promise<ApiF1Response<F1Competition>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<F1Competition>(`${F1_ENDPOINTS.COMPETITIONS}${query}`);
  }

  // ============================================================================
  // Teams Endpoints
  // ============================================================================

  /**
   * Get teams (constructors)
   */
  async getTeams(params?: F1TeamsParams): Promise<ApiF1Response<F1Team>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<F1Team>(`${F1_ENDPOINTS.TEAMS}${query}`);
  }

  // ============================================================================
  // Drivers Endpoints
  // ============================================================================

  /**
   * Get drivers
   */
  async getDrivers(params?: F1DriversParams): Promise<ApiF1Response<F1Driver>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<F1Driver>(`${F1_ENDPOINTS.DRIVERS}${query}`);
  }

  // ============================================================================
  // Races Endpoints
  // ============================================================================

  /**
   * Get races with optional filtering
   */
  async getRaces(params?: F1RacesParams): Promise<ApiF1Response<F1Race>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<F1Race>(`${F1_ENDPOINTS.RACES}${query}`);
  }

  // ============================================================================
  // Rankings Endpoints
  // ============================================================================

  /**
   * Get driver rankings
   */
  async getDriverRankings(
    params: F1DriverRankingsParams,
  ): Promise<ApiF1Response<F1DriverRanking>> {
    const query = buildQueryString(params);
    return this.request<F1DriverRanking>(
      `${F1_ENDPOINTS.RANKINGS_DRIVERS}${query}`,
    );
  }

  /**
   * Get team (constructor) rankings
   */
  async getTeamRankings(
    params: F1TeamRankingsParams,
  ): Promise<ApiF1Response<F1TeamRanking>> {
    const query = buildQueryString(params);
    return this.request<F1TeamRanking>(
      `${F1_ENDPOINTS.RANKINGS_TEAMS}${query}`,
    );
  }

  // ============================================================================
  // Pit Stops Endpoints
  // ============================================================================

  /**
   * Get pit stops for a race
   */
  async getPitStops(
    params: F1PitStopsParams,
  ): Promise<ApiF1Response<F1PitStop>> {
    const query = buildQueryString(params);
    return this.request<F1PitStop>(`${F1_ENDPOINTS.PITSTOPS}${query}`);
  }
}

/**
 * Factory function to create an ApiF1Client instance
 */
export const createApiF1Client = (
  networkClient: NetworkClient,
  config: ApiF1Config,
): ApiF1Client => {
  return new ApiF1Client(networkClient, config);
};
