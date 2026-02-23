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
import {
  ApiSportsError,
  ApiSportsErrorType,
  classifyApiError,
} from "../../common/api-sports-error";
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
 * Provides type-safe methods for all API-Formula-1 endpoints including
 * circuits, competitions, drivers, teams, races, rankings, and pit stops.
 * Uses NetworkClient from @sudobility/di for network requests, enabling
 * cross-platform compatibility between React and React Native.
 *
 * @class ApiF1Client
 *
 * @example
 * ```typescript
 * const client = new ApiF1Client(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const races = await client.getRaces({ season: 2023 });
 * const drivers = await client.getDrivers({ search: "verstappen" });
 * ```
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
   *
   * @template T - The expected response data type
   * @param endpoint - The API endpoint path with query string
   * @returns Promise resolving to the typed API response
   * @throws {ApiSportsError} When no data is received or API returns errors
   */
  private async request<T>(endpoint: string): Promise<ApiF1Response<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiF1Response<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new ApiSportsError(
        "No data received from API-Formula-1",
        "Formula1",
        ApiSportsErrorType.NO_DATA,
      );
    }

    // Check for API errors
    const data = response.data as ApiF1Response<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new ApiSportsError(
        `API-Formula-1 error: ${errorMsg}`,
        "Formula1",
        classifyApiError(data.errors),
        { errors: data.errors },
      );
    }

    return data;
  }

  // ============================================================================
  // General Endpoints
  // ============================================================================

  /**
   * Get all available timezones supported by the API
   *
   * @returns Promise resolving to array of timezone strings
   * @throws {ApiSportsError} If API returns an error or no data
   */
  async getTimezone(): Promise<ApiF1Response<F1Timezone>> {
    return this.request<F1Timezone>(F1_ENDPOINTS.TIMEZONE);
  }

  /**
   * Get all available Formula 1 seasons
   *
   * @param params - Optional filter parameters
   * @returns Promise resolving to array of season years
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const seasons = await client.getSeasons();
   * ```
   */
  async getSeasons(params?: F1SeasonsParams): Promise<ApiF1Response<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(`${F1_ENDPOINTS.SEASONS}${query}`);
  }

  // ============================================================================
  // Circuits Endpoints
  // ============================================================================

  /**
   * Get Formula 1 circuits with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by circuit ID
   * @param params.name - Filter by circuit name
   * @param params.country - Filter by country name
   * @param params.city - Filter by city name
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of Circuit objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const circuits = await client.getCircuits({ country: "Italy" });
   * ```
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
   * Get Formula 1 competitions (Grand Prix events)
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by competition ID
   * @param params.name - Filter by competition name
   * @param params.country - Filter by country name
   * @param params.city - Filter by city name
   * @param params.season - Filter by season year
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of Competition objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const gps = await client.getCompetitions({ season: 2023 });
   * ```
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
   * Get Formula 1 teams (constructors) with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by team ID
   * @param params.name - Filter by team name
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of Team objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const teams = await client.getTeams({ search: "red bull" });
   * ```
   */
  async getTeams(params?: F1TeamsParams): Promise<ApiF1Response<F1Team>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<F1Team>(`${F1_ENDPOINTS.TEAMS}${query}`);
  }

  // ============================================================================
  // Drivers Endpoints
  // ============================================================================

  /**
   * Get Formula 1 drivers with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by driver ID
   * @param params.name - Filter by driver name
   * @param params.team - Filter by team ID
   * @param params.season - Filter by season year
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of Driver objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const drivers = await client.getDrivers({ search: "verstappen" });
   * ```
   */
  async getDrivers(params?: F1DriversParams): Promise<ApiF1Response<F1Driver>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<F1Driver>(`${F1_ENDPOINTS.DRIVERS}${query}`);
  }

  // ============================================================================
  // Races Endpoints
  // ============================================================================

  /**
   * Get Formula 1 races with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by race ID
   * @param params.competition - Filter by competition ID
   * @param params.season - Filter by season year
   * @param params.type - Filter by race type (e.g., "Race", "Qualifying")
   * @param params.date - Filter by date (YYYY-MM-DD)
   * @param params.next - Get next N races
   * @param params.last - Get last N races
   * @returns Promise resolving to array of Race objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const races = await client.getRaces({ season: 2023 });
   * const nextRace = await client.getRaces({ next: 1 });
   * ```
   */
  async getRaces(params?: F1RacesParams): Promise<ApiF1Response<F1Race>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<F1Race>(`${F1_ENDPOINTS.RACES}${query}`);
  }

  // ============================================================================
  // Rankings Endpoints
  // ============================================================================

  /**
   * Get Formula 1 driver championship rankings
   *
   * @param params - Required filter parameters
   * @param params.season - Season year (required)
   * @returns Promise resolving to array of DriverRanking objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const driverRankings = await client.getDriverRankings({ season: 2023 });
   * ```
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
   * Get Formula 1 team (constructor) championship rankings
   *
   * @param params - Required filter parameters
   * @param params.season - Season year (required)
   * @returns Promise resolving to array of TeamRanking objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const teamRankings = await client.getTeamRankings({ season: 2023 });
   * ```
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
   * Get pit stop data for a specific race
   *
   * @param params - Required filter parameters
   * @param params.race - Race ID (required)
   * @param params.team - Optional team ID filter
   * @returns Promise resolving to array of PitStop objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const pitStops = await client.getPitStops({ race: 1 });
   * ```
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
 *
 * @param networkClient - NetworkClient instance for making HTTP requests
 * @param config - API configuration including API key
 * @returns New ApiF1Client instance
 *
 * @example
 * ```typescript
 * const client = createApiF1Client(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 * ```
 */
export const createApiF1Client = (
  networkClient: NetworkClient,
  config: ApiF1Config,
): ApiF1Client => {
  return new ApiF1Client(networkClient, config);
};
