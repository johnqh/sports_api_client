/**
 * @module api-basketball-client
 * @description API-Basketball Client Library
 *
 * A TypeScript client for the API-Basketball API that provides type-safe
 * access to basketball data including leagues, teams, games, standings, and more.
 *
 * Uses dependency injection for network requests, making it compatible with
 * both React (web) and React Native applications.
 *
 * @example
 * ```typescript
 * import { ApiBasketballClient } from "@sudobility/sports_api_client";
 *
 * const client = new ApiBasketballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "USA" });
 * ```
 */

import type { NetworkClient } from "@sudobility/types";
import type {
  ApiBasketballConfig,
  ApiBasketballResponse,
  BasketballCountriesParams,
  BasketballCountry,
  BasketballGame,
  BasketballGamesParams,
  BasketballHeadToHeadParams,
  BasketballLeagueResponse,
  BasketballLeaguesParams,
  BasketballSeasonsParams,
  BasketballStanding,
  BasketballStandingsParams,
  BasketballTeamResponse,
  BasketballTeamsParams,
  BasketballTeamStatistics,
  BasketballTeamStatisticsParams,
  BasketballTimezone,
} from "../types";
import { buildQueryString } from "../../utils/query-params";
import {
  BASKETBALL_API_BASE_URL,
  BASKETBALL_DEFAULT_HEADERS,
  BASKETBALL_ENDPOINTS,
  BASKETBALL_RAPIDAPI_HOST,
} from "./basketball-endpoints";

/**
 * API-Basketball Client class
 *
 * Provides type-safe methods for all API-Basketball endpoints.
 */
export class ApiBasketballClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

  /**
   * Create a new ApiBasketballClient instance
   *
   * @param networkClient - NetworkClient instance for making HTTP requests
   * @param config - API configuration including API key
   */
  constructor(networkClient: NetworkClient, config: ApiBasketballConfig) {
    this.networkClient = networkClient;
    this.baseUrl = config.baseUrl || BASKETBALL_API_BASE_URL;

    // Set up authentication headers
    if (config.useRapidApi && config.rapidApiHost) {
      this.headers = {
        ...BASKETBALL_DEFAULT_HEADERS,
        "x-rapidapi-host": config.rapidApiHost || BASKETBALL_RAPIDAPI_HOST,
        "x-rapidapi-key": config.apiKey,
      };
    } else {
      this.headers = {
        ...BASKETBALL_DEFAULT_HEADERS,
        "x-apisports-key": config.apiKey,
      };
    }
  }

  /**
   * Make a GET request to the API
   */
  private async request<T>(
    endpoint: string,
  ): Promise<ApiBasketballResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiBasketballResponse<T>>(
      url,
      {
        headers: this.headers,
      },
    );

    if (response.data === undefined || response.data === null) {
      throw new Error("No data received from API-Basketball");
    }

    // Check for API errors
    const data = response.data as ApiBasketballResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new Error(`API-Basketball error: ${errorMsg}`);
    }

    return data;
  }

  // ============================================================================
  // General Endpoints
  // ============================================================================

  /**
   * Get all available timezones
   */
  async getTimezone(): Promise<ApiBasketballResponse<BasketballTimezone>> {
    return this.request<BasketballTimezone>(BASKETBALL_ENDPOINTS.TIMEZONE);
  }

  /**
   * Get all available countries
   */
  async getCountries(
    params?: BasketballCountriesParams,
  ): Promise<ApiBasketballResponse<BasketballCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<BasketballCountry>(
      `${BASKETBALL_ENDPOINTS.COUNTRIES}${query}`,
    );
  }

  /**
   * Get all available seasons
   */
  async getSeasons(
    params?: BasketballSeasonsParams,
  ): Promise<ApiBasketballResponse<string>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<string>(`${BASKETBALL_ENDPOINTS.SEASONS}${query}`);
  }

  // ============================================================================
  // Leagues Endpoints
  // ============================================================================

  /**
   * Get leagues with optional filtering
   */
  async getLeagues(
    params?: BasketballLeaguesParams,
  ): Promise<ApiBasketballResponse<BasketballLeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<BasketballLeagueResponse>(
      `${BASKETBALL_ENDPOINTS.LEAGUES}${query}`,
    );
  }

  // ============================================================================
  // Teams Endpoints
  // ============================================================================

  /**
   * Get teams
   */
  async getTeams(
    params?: BasketballTeamsParams,
  ): Promise<ApiBasketballResponse<BasketballTeamResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<BasketballTeamResponse>(
      `${BASKETBALL_ENDPOINTS.TEAMS}${query}`,
    );
  }

  /**
   * Get team statistics
   */
  async getTeamStatistics(
    params: BasketballTeamStatisticsParams,
  ): Promise<ApiBasketballResponse<BasketballTeamStatistics>> {
    const query = buildQueryString(params);
    return this.request<BasketballTeamStatistics>(
      `${BASKETBALL_ENDPOINTS.TEAMS_STATISTICS}${query}`,
    );
  }

  // ============================================================================
  // Games Endpoints
  // ============================================================================

  /**
   * Get games with optional filtering
   */
  async getGames(
    params?: BasketballGamesParams,
  ): Promise<ApiBasketballResponse<BasketballGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<BasketballGame>(
      `${BASKETBALL_ENDPOINTS.GAMES}${query}`,
    );
  }

  /**
   * Get head to head games between two teams
   */
  async getGamesHeadToHead(
    params: BasketballHeadToHeadParams,
  ): Promise<ApiBasketballResponse<BasketballGame>> {
    const query = buildQueryString(params);
    return this.request<BasketballGame>(
      `${BASKETBALL_ENDPOINTS.GAMES_HEAD_TO_HEAD}${query}`,
    );
  }

  // ============================================================================
  // Standings Endpoints
  // ============================================================================

  /**
   * Get standings for a league/season
   */
  async getStandings(
    params: BasketballStandingsParams,
  ): Promise<ApiBasketballResponse<BasketballStanding>> {
    const query = buildQueryString(params);
    return this.request<BasketballStanding>(
      `${BASKETBALL_ENDPOINTS.STANDINGS}${query}`,
    );
  }
}

/**
 * Factory function to create an ApiBasketballClient instance
 */
export const createApiBasketballClient = (
  networkClient: NetworkClient,
  config: ApiBasketballConfig,
): ApiBasketballClient => {
  return new ApiBasketballClient(networkClient, config);
};
