/**
 * @module api-hockey-client
 * @description API-Hockey Client Library
 *
 * A TypeScript client for the API-Hockey API that provides type-safe
 * access to hockey data including leagues, teams, games, standings, and more.
 *
 * @example
 * ```typescript
 * import { ApiHockeyClient } from "@sudobility/sports_api_client";
 *
 * const client = new ApiHockeyClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "USA" });
 * ```
 */

import type { NetworkClient } from "@sudobility/types";
import type {
  ApiHockeyConfig,
  ApiHockeyResponse,
  HockeyCountriesParams,
  HockeyCountry,
  HockeyGame,
  HockeyGamesParams,
  HockeyHeadToHeadParams,
  HockeyLeagueResponse,
  HockeyLeaguesParams,
  HockeySeasonsParams,
  HockeyStanding,
  HockeyStandingsParams,
  HockeyTeamResponse,
  HockeyTeamsParams,
  HockeyTeamStatistics,
  HockeyTeamStatisticsParams,
  HockeyTimezone,
} from "../types";
import { buildQueryString } from "../../utils/query-params";
import {
  HOCKEY_API_BASE_URL,
  HOCKEY_DEFAULT_HEADERS,
  HOCKEY_ENDPOINTS,
  HOCKEY_RAPIDAPI_HOST,
} from "./hockey-endpoints";

/**
 * API-Hockey Client class
 *
 * Provides type-safe methods for all API-Hockey endpoints.
 */
export class ApiHockeyClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

  /**
   * Create a new ApiHockeyClient instance
   *
   * @param networkClient - NetworkClient instance for making HTTP requests
   * @param config - API configuration including API key
   */
  constructor(networkClient: NetworkClient, config: ApiHockeyConfig) {
    this.networkClient = networkClient;
    this.baseUrl = config.baseUrl || HOCKEY_API_BASE_URL;

    // Set up authentication headers
    if (config.useRapidApi && config.rapidApiHost) {
      this.headers = {
        ...HOCKEY_DEFAULT_HEADERS,
        "x-rapidapi-host": config.rapidApiHost || HOCKEY_RAPIDAPI_HOST,
        "x-rapidapi-key": config.apiKey,
      };
    } else {
      this.headers = {
        ...HOCKEY_DEFAULT_HEADERS,
        "x-apisports-key": config.apiKey,
      };
    }
  }

  /**
   * Make a GET request to the API
   */
  private async request<T>(endpoint: string): Promise<ApiHockeyResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiHockeyResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new Error("No data received from API-Hockey");
    }

    // Check for API errors
    const data = response.data as ApiHockeyResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new Error(`API-Hockey error: ${errorMsg}`);
    }

    return data;
  }

  // ============================================================================
  // General Endpoints
  // ============================================================================

  /**
   * Get all available timezones
   */
  async getTimezone(): Promise<ApiHockeyResponse<HockeyTimezone>> {
    return this.request<HockeyTimezone>(HOCKEY_ENDPOINTS.TIMEZONE);
  }

  /**
   * Get all available countries
   */
  async getCountries(
    params?: HockeyCountriesParams,
  ): Promise<ApiHockeyResponse<HockeyCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HockeyCountry>(`${HOCKEY_ENDPOINTS.COUNTRIES}${query}`);
  }

  /**
   * Get all available seasons
   */
  async getSeasons(
    params?: HockeySeasonsParams,
  ): Promise<ApiHockeyResponse<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(`${HOCKEY_ENDPOINTS.SEASONS}${query}`);
  }

  // ============================================================================
  // Leagues Endpoints
  // ============================================================================

  /**
   * Get leagues with optional filtering
   */
  async getLeagues(
    params?: HockeyLeaguesParams,
  ): Promise<ApiHockeyResponse<HockeyLeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HockeyLeagueResponse>(
      `${HOCKEY_ENDPOINTS.LEAGUES}${query}`,
    );
  }

  // ============================================================================
  // Teams Endpoints
  // ============================================================================

  /**
   * Get teams
   */
  async getTeams(
    params?: HockeyTeamsParams,
  ): Promise<ApiHockeyResponse<HockeyTeamResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HockeyTeamResponse>(
      `${HOCKEY_ENDPOINTS.TEAMS}${query}`,
    );
  }

  /**
   * Get team statistics
   */
  async getTeamStatistics(
    params: HockeyTeamStatisticsParams,
  ): Promise<ApiHockeyResponse<HockeyTeamStatistics>> {
    const query = buildQueryString(params);
    return this.request<HockeyTeamStatistics>(
      `${HOCKEY_ENDPOINTS.TEAMS_STATISTICS}${query}`,
    );
  }

  // ============================================================================
  // Games Endpoints
  // ============================================================================

  /**
   * Get games with optional filtering
   */
  async getGames(
    params?: HockeyGamesParams,
  ): Promise<ApiHockeyResponse<HockeyGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HockeyGame>(`${HOCKEY_ENDPOINTS.GAMES}${query}`);
  }

  /**
   * Get head to head games between two teams
   */
  async getGamesHeadToHead(
    params: HockeyHeadToHeadParams,
  ): Promise<ApiHockeyResponse<HockeyGame>> {
    const query = buildQueryString(params);
    return this.request<HockeyGame>(
      `${HOCKEY_ENDPOINTS.GAMES_HEAD_TO_HEAD}${query}`,
    );
  }

  // ============================================================================
  // Standings Endpoints
  // ============================================================================

  /**
   * Get standings for a league/season
   */
  async getStandings(
    params: HockeyStandingsParams,
  ): Promise<ApiHockeyResponse<HockeyStanding>> {
    const query = buildQueryString(params);
    return this.request<HockeyStanding>(
      `${HOCKEY_ENDPOINTS.STANDINGS}${query}`,
    );
  }
}

/**
 * Factory function to create an ApiHockeyClient instance
 */
export const createApiHockeyClient = (
  networkClient: NetworkClient,
  config: ApiHockeyConfig,
): ApiHockeyClient => {
  return new ApiHockeyClient(networkClient, config);
};
