/**
 * @module api-rugby-client
 * @description API-Rugby Client Library
 *
 * A TypeScript client for the API-Rugby API that provides type-safe
 * access to rugby data including leagues, teams, games, standings, and more.
 *
 * @example
 * ```typescript
 * import { ApiRugbyClient } from "@sudobility/sports_api_client";
 *
 * const client = new ApiRugbyClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "England" });
 * ```
 */

import type { NetworkClient } from "@sudobility/types";
import type {
  ApiRugbyConfig,
  ApiRugbyResponse,
  RugbyCountriesParams,
  RugbyCountry,
  RugbyGame,
  RugbyGamesParams,
  RugbyGameStatistics,
  RugbyGameStatisticsParams,
  RugbyHeadToHeadParams,
  RugbyLeagueResponse,
  RugbyLeaguesParams,
  RugbySeasonsParams,
  RugbyStanding,
  RugbyStandingsParams,
  RugbyTeamResponse,
  RugbyTeamsParams,
  RugbyTeamStatistics,
  RugbyTeamStatisticsParams,
  RugbyTimezone,
} from "../types";
import { buildQueryString } from "../../utils/query-params";
import {
  RUGBY_API_BASE_URL,
  RUGBY_DEFAULT_HEADERS,
  RUGBY_ENDPOINTS,
  RUGBY_RAPIDAPI_HOST,
} from "./rugby-endpoints";

/**
 * API-Rugby Client class
 *
 * Provides type-safe methods for all API-Rugby endpoints.
 */
export class ApiRugbyClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

  /**
   * Create a new ApiRugbyClient instance
   *
   * @param networkClient - NetworkClient instance for making HTTP requests
   * @param config - API configuration including API key
   */
  constructor(networkClient: NetworkClient, config: ApiRugbyConfig) {
    this.networkClient = networkClient;
    this.baseUrl = config.baseUrl || RUGBY_API_BASE_URL;

    // Set up authentication headers
    if (config.useRapidApi && config.rapidApiHost) {
      this.headers = {
        ...RUGBY_DEFAULT_HEADERS,
        "x-rapidapi-host": config.rapidApiHost || RUGBY_RAPIDAPI_HOST,
        "x-rapidapi-key": config.apiKey,
      };
    } else {
      this.headers = {
        ...RUGBY_DEFAULT_HEADERS,
        "x-apisports-key": config.apiKey,
      };
    }
  }

  /**
   * Make a GET request to the API
   */
  private async request<T>(endpoint: string): Promise<ApiRugbyResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiRugbyResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new Error("No data received from API-Rugby");
    }

    // Check for API errors
    const data = response.data as ApiRugbyResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new Error(`API-Rugby error: ${errorMsg}`);
    }

    return data;
  }

  // ============================================================================
  // General Endpoints
  // ============================================================================

  /**
   * Get all available timezones
   */
  async getTimezone(): Promise<ApiRugbyResponse<RugbyTimezone>> {
    return this.request<RugbyTimezone>(RUGBY_ENDPOINTS.TIMEZONE);
  }

  /**
   * Get all available countries
   */
  async getCountries(
    params?: RugbyCountriesParams,
  ): Promise<ApiRugbyResponse<RugbyCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<RugbyCountry>(`${RUGBY_ENDPOINTS.COUNTRIES}${query}`);
  }

  /**
   * Get all available seasons
   */
  async getSeasons(
    params?: RugbySeasonsParams,
  ): Promise<ApiRugbyResponse<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(`${RUGBY_ENDPOINTS.SEASONS}${query}`);
  }

  // ============================================================================
  // Leagues Endpoints
  // ============================================================================

  /**
   * Get leagues with optional filtering
   */
  async getLeagues(
    params?: RugbyLeaguesParams,
  ): Promise<ApiRugbyResponse<RugbyLeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<RugbyLeagueResponse>(
      `${RUGBY_ENDPOINTS.LEAGUES}${query}`,
    );
  }

  // ============================================================================
  // Teams Endpoints
  // ============================================================================

  /**
   * Get teams
   */
  async getTeams(
    params?: RugbyTeamsParams,
  ): Promise<ApiRugbyResponse<RugbyTeamResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<RugbyTeamResponse>(`${RUGBY_ENDPOINTS.TEAMS}${query}`);
  }

  /**
   * Get team statistics
   */
  async getTeamStatistics(
    params: RugbyTeamStatisticsParams,
  ): Promise<ApiRugbyResponse<RugbyTeamStatistics>> {
    const query = buildQueryString(params);
    return this.request<RugbyTeamStatistics>(
      `${RUGBY_ENDPOINTS.TEAMS_STATISTICS}${query}`,
    );
  }

  // ============================================================================
  // Games Endpoints
  // ============================================================================

  /**
   * Get games with optional filtering
   */
  async getGames(
    params?: RugbyGamesParams,
  ): Promise<ApiRugbyResponse<RugbyGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<RugbyGame>(`${RUGBY_ENDPOINTS.GAMES}${query}`);
  }

  /**
   * Get head to head games between two teams
   */
  async getGamesHeadToHead(
    params: RugbyHeadToHeadParams,
  ): Promise<ApiRugbyResponse<RugbyGame>> {
    const query = buildQueryString(params);
    return this.request<RugbyGame>(
      `${RUGBY_ENDPOINTS.GAMES_HEAD_TO_HEAD}${query}`,
    );
  }

  /**
   * Get game statistics
   */
  async getGameStatistics(
    params: RugbyGameStatisticsParams,
  ): Promise<ApiRugbyResponse<RugbyGameStatistics>> {
    const query = buildQueryString(params);
    return this.request<RugbyGameStatistics>(
      `${RUGBY_ENDPOINTS.GAMES_STATISTICS}${query}`,
    );
  }

  // ============================================================================
  // Standings Endpoints
  // ============================================================================

  /**
   * Get standings for a league/season
   */
  async getStandings(
    params: RugbyStandingsParams,
  ): Promise<ApiRugbyResponse<RugbyStanding>> {
    const query = buildQueryString(params);
    return this.request<RugbyStanding>(`${RUGBY_ENDPOINTS.STANDINGS}${query}`);
  }
}

/**
 * Factory function to create an ApiRugbyClient instance
 */
export const createApiRugbyClient = (
  networkClient: NetworkClient,
  config: ApiRugbyConfig,
): ApiRugbyClient => {
  return new ApiRugbyClient(networkClient, config);
};
