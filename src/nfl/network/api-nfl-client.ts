/**
 * @module api-nfl-client
 * @description API-American-Football (NFL) Client Library
 *
 * A TypeScript client for the API-American-Football API that provides type-safe
 * access to NFL data including leagues, teams, games, standings, and more.
 *
 * @example
 * ```typescript
 * import { ApiNflClient } from "@sudobility/sports_api_client";
 *
 * const client = new ApiNflClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "USA" });
 * ```
 */

import type { NetworkClient } from "@sudobility/types";
import type {
  ApiNflConfig,
  ApiNflResponse,
  NflCountriesParams,
  NflCountry,
  NflGame,
  NflGamesParams,
  NflGameStatistics,
  NflGameStatisticsParams,
  NflHeadToHeadParams,
  NflLeagueResponse,
  NflLeaguesParams,
  NflSeasonsParams,
  NflStanding,
  NflStandingsParams,
  NflTeamResponse,
  NflTeamsParams,
  NflTeamStatistics,
  NflTeamStatisticsParams,
  NflTimezone,
} from "../types";
import { buildQueryString } from "../../utils/query-params";
import {
  NFL_API_BASE_URL,
  NFL_DEFAULT_HEADERS,
  NFL_ENDPOINTS,
  NFL_RAPIDAPI_HOST,
} from "./nfl-endpoints";

/**
 * API-NFL Client class
 *
 * Provides type-safe methods for all API-NFL endpoints.
 */
export class ApiNflClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

  /**
   * Create a new ApiNflClient instance
   *
   * @param networkClient - NetworkClient instance for making HTTP requests
   * @param config - API configuration including API key
   */
  constructor(networkClient: NetworkClient, config: ApiNflConfig) {
    this.networkClient = networkClient;
    this.baseUrl = config.baseUrl || NFL_API_BASE_URL;

    // Set up authentication headers
    if (config.useRapidApi && config.rapidApiHost) {
      this.headers = {
        ...NFL_DEFAULT_HEADERS,
        "x-rapidapi-host": config.rapidApiHost || NFL_RAPIDAPI_HOST,
        "x-rapidapi-key": config.apiKey,
      };
    } else {
      this.headers = {
        ...NFL_DEFAULT_HEADERS,
        "x-apisports-key": config.apiKey,
      };
    }
  }

  /**
   * Make a GET request to the API
   */
  private async request<T>(endpoint: string): Promise<ApiNflResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiNflResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new Error("No data received from API-NFL");
    }

    // Check for API errors
    const data = response.data as ApiNflResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new Error(`API-NFL error: ${errorMsg}`);
    }

    return data;
  }

  // ============================================================================
  // General Endpoints
  // ============================================================================

  /**
   * Get all available timezones
   */
  async getTimezone(): Promise<ApiNflResponse<NflTimezone>> {
    return this.request<NflTimezone>(NFL_ENDPOINTS.TIMEZONE);
  }

  /**
   * Get all available countries
   */
  async getCountries(
    params?: NflCountriesParams,
  ): Promise<ApiNflResponse<NflCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<NflCountry>(`${NFL_ENDPOINTS.COUNTRIES}${query}`);
  }

  /**
   * Get all available seasons
   */
  async getSeasons(params?: NflSeasonsParams): Promise<ApiNflResponse<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(`${NFL_ENDPOINTS.SEASONS}${query}`);
  }

  // ============================================================================
  // Leagues Endpoints
  // ============================================================================

  /**
   * Get leagues with optional filtering
   */
  async getLeagues(
    params?: NflLeaguesParams,
  ): Promise<ApiNflResponse<NflLeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<NflLeagueResponse>(`${NFL_ENDPOINTS.LEAGUES}${query}`);
  }

  // ============================================================================
  // Teams Endpoints
  // ============================================================================

  /**
   * Get teams
   */
  async getTeams(
    params?: NflTeamsParams,
  ): Promise<ApiNflResponse<NflTeamResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<NflTeamResponse>(`${NFL_ENDPOINTS.TEAMS}${query}`);
  }

  /**
   * Get team statistics
   */
  async getTeamStatistics(
    params: NflTeamStatisticsParams,
  ): Promise<ApiNflResponse<NflTeamStatistics>> {
    const query = buildQueryString(params);
    return this.request<NflTeamStatistics>(
      `${NFL_ENDPOINTS.TEAMS_STATISTICS}${query}`,
    );
  }

  // ============================================================================
  // Games Endpoints
  // ============================================================================

  /**
   * Get games with optional filtering
   */
  async getGames(params?: NflGamesParams): Promise<ApiNflResponse<NflGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<NflGame>(`${NFL_ENDPOINTS.GAMES}${query}`);
  }

  /**
   * Get head to head games between two teams
   */
  async getGamesHeadToHead(
    params: NflHeadToHeadParams,
  ): Promise<ApiNflResponse<NflGame>> {
    const query = buildQueryString(params);
    return this.request<NflGame>(`${NFL_ENDPOINTS.GAMES_HEAD_TO_HEAD}${query}`);
  }

  /**
   * Get game statistics
   */
  async getGameStatistics(
    params: NflGameStatisticsParams,
  ): Promise<ApiNflResponse<NflGameStatistics>> {
    const query = buildQueryString(params);
    return this.request<NflGameStatistics>(
      `${NFL_ENDPOINTS.GAMES_STATISTICS}${query}`,
    );
  }

  // ============================================================================
  // Standings Endpoints
  // ============================================================================

  /**
   * Get standings for a league/season
   */
  async getStandings(
    params: NflStandingsParams,
  ): Promise<ApiNflResponse<NflStanding>> {
    const query = buildQueryString(params);
    return this.request<NflStanding>(`${NFL_ENDPOINTS.STANDINGS}${query}`);
  }
}

/**
 * Factory function to create an ApiNflClient instance
 */
export const createApiNflClient = (
  networkClient: NetworkClient,
  config: ApiNflConfig,
): ApiNflClient => {
  return new ApiNflClient(networkClient, config);
};
