/**
 * @module api-baseball-client
 * @description API-Baseball Client Library
 *
 * A TypeScript client for the API-Baseball API that provides type-safe
 * access to baseball data including leagues, teams, games, standings, and more.
 *
 * @example
 * ```typescript
 * import { ApiBaseballClient } from "@sudobility/sports_api_client";
 *
 * const client = new ApiBaseballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "USA" });
 * ```
 */

import type { NetworkClient } from "@sudobility/types";
import type {
  ApiBaseballConfig,
  ApiBaseballResponse,
  BaseballCountriesParams,
  BaseballCountry,
  BaseballGame,
  BaseballGamesParams,
  BaseballGameStatistics,
  BaseballGameStatisticsParams,
  BaseballHeadToHeadParams,
  BaseballLeagueResponse,
  BaseballLeaguesParams,
  BaseballSeasonsParams,
  BaseballStanding,
  BaseballStandingsParams,
  BaseballTeamResponse,
  BaseballTeamsParams,
  BaseballTeamStatistics,
  BaseballTeamStatisticsParams,
  BaseballTimezone,
} from "../types";
import { buildQueryString } from "../../utils/query-params";
import {
  BASEBALL_API_BASE_URL,
  BASEBALL_DEFAULT_HEADERS,
  BASEBALL_ENDPOINTS,
  BASEBALL_RAPIDAPI_HOST,
} from "./baseball-endpoints";

/**
 * API-Baseball Client class
 *
 * Provides type-safe methods for all API-Baseball endpoints.
 */
export class ApiBaseballClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

  /**
   * Create a new ApiBaseballClient instance
   *
   * @param networkClient - NetworkClient instance for making HTTP requests
   * @param config - API configuration including API key
   */
  constructor(networkClient: NetworkClient, config: ApiBaseballConfig) {
    this.networkClient = networkClient;
    this.baseUrl = config.baseUrl || BASEBALL_API_BASE_URL;

    // Set up authentication headers
    if (config.useRapidApi && config.rapidApiHost) {
      this.headers = {
        ...BASEBALL_DEFAULT_HEADERS,
        "x-rapidapi-host": config.rapidApiHost || BASEBALL_RAPIDAPI_HOST,
        "x-rapidapi-key": config.apiKey,
      };
    } else {
      this.headers = {
        ...BASEBALL_DEFAULT_HEADERS,
        "x-apisports-key": config.apiKey,
      };
    }
  }

  /**
   * Make a GET request to the API
   */
  private async request<T>(endpoint: string): Promise<ApiBaseballResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiBaseballResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new Error("No data received from API-Baseball");
    }

    // Check for API errors
    const data = response.data as ApiBaseballResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new Error(`API-Baseball error: ${errorMsg}`);
    }

    return data;
  }

  // ============================================================================
  // General Endpoints
  // ============================================================================

  /**
   * Get all available timezones
   */
  async getTimezone(): Promise<ApiBaseballResponse<BaseballTimezone>> {
    return this.request<BaseballTimezone>(BASEBALL_ENDPOINTS.TIMEZONE);
  }

  /**
   * Get all available countries
   */
  async getCountries(
    params?: BaseballCountriesParams,
  ): Promise<ApiBaseballResponse<BaseballCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<BaseballCountry>(
      `${BASEBALL_ENDPOINTS.COUNTRIES}${query}`,
    );
  }

  /**
   * Get all available seasons
   */
  async getSeasons(
    params?: BaseballSeasonsParams,
  ): Promise<ApiBaseballResponse<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(`${BASEBALL_ENDPOINTS.SEASONS}${query}`);
  }

  // ============================================================================
  // Leagues Endpoints
  // ============================================================================

  /**
   * Get leagues with optional filtering
   */
  async getLeagues(
    params?: BaseballLeaguesParams,
  ): Promise<ApiBaseballResponse<BaseballLeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<BaseballLeagueResponse>(
      `${BASEBALL_ENDPOINTS.LEAGUES}${query}`,
    );
  }

  // ============================================================================
  // Teams Endpoints
  // ============================================================================

  /**
   * Get teams
   */
  async getTeams(
    params?: BaseballTeamsParams,
  ): Promise<ApiBaseballResponse<BaseballTeamResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<BaseballTeamResponse>(
      `${BASEBALL_ENDPOINTS.TEAMS}${query}`,
    );
  }

  /**
   * Get team statistics
   */
  async getTeamStatistics(
    params: BaseballTeamStatisticsParams,
  ): Promise<ApiBaseballResponse<BaseballTeamStatistics>> {
    const query = buildQueryString(params);
    return this.request<BaseballTeamStatistics>(
      `${BASEBALL_ENDPOINTS.TEAMS_STATISTICS}${query}`,
    );
  }

  // ============================================================================
  // Games Endpoints
  // ============================================================================

  /**
   * Get games with optional filtering
   */
  async getGames(
    params?: BaseballGamesParams,
  ): Promise<ApiBaseballResponse<BaseballGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<BaseballGame>(`${BASEBALL_ENDPOINTS.GAMES}${query}`);
  }

  /**
   * Get head to head games between two teams
   */
  async getGamesHeadToHead(
    params: BaseballHeadToHeadParams,
  ): Promise<ApiBaseballResponse<BaseballGame>> {
    const query = buildQueryString(params);
    return this.request<BaseballGame>(
      `${BASEBALL_ENDPOINTS.GAMES_HEAD_TO_HEAD}${query}`,
    );
  }

  /**
   * Get game statistics
   */
  async getGameStatistics(
    params: BaseballGameStatisticsParams,
  ): Promise<ApiBaseballResponse<BaseballGameStatistics>> {
    const query = buildQueryString(params);
    return this.request<BaseballGameStatistics>(
      `${BASEBALL_ENDPOINTS.GAMES_STATISTICS}${query}`,
    );
  }

  // ============================================================================
  // Standings Endpoints
  // ============================================================================

  /**
   * Get standings for a league/season
   */
  async getStandings(
    params: BaseballStandingsParams,
  ): Promise<ApiBaseballResponse<BaseballStanding>> {
    const query = buildQueryString(params);
    return this.request<BaseballStanding>(
      `${BASEBALL_ENDPOINTS.STANDINGS}${query}`,
    );
  }
}

/**
 * Factory function to create an ApiBaseballClient instance
 */
export const createApiBaseballClient = (
  networkClient: NetworkClient,
  config: ApiBaseballConfig,
): ApiBaseballClient => {
  return new ApiBaseballClient(networkClient, config);
};
