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
import {
  ApiSportsError,
  ApiSportsErrorType,
  classifyApiError,
} from "../../common/api-sports-error";
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
 * Uses NetworkClient from @sudobility/di for network requests, enabling
 * cross-platform compatibility between React and React Native.
 *
 * @class ApiBaseballClient
 *
 * @example
 * ```typescript
 * const client = new ApiBaseballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "USA" });
 * ```
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
   *
   * @template T - The expected response data type
   * @param endpoint - The API endpoint path with query string
   * @returns Promise resolving to the typed API response
   * @throws {ApiSportsError} When no data is received or API returns errors
   */
  private async request<T>(endpoint: string): Promise<ApiBaseballResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiBaseballResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new ApiSportsError(
        "No data received from API-Baseball",
        "Baseball",
        ApiSportsErrorType.NO_DATA,
      );
    }

    // Check for API errors
    const data = response.data as ApiBaseballResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new ApiSportsError(
        `API-Baseball error: ${errorMsg}`,
        "Baseball",
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
   *
   * @example
   * ```typescript
   * const timezones = await client.getTimezone();
   * ```
   */
  async getTimezone(): Promise<ApiBaseballResponse<BaseballTimezone>> {
    return this.request<BaseballTimezone>(BASEBALL_ENDPOINTS.TIMEZONE);
  }

  /**
   * Get all available countries or filter by name/code
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by country ID
   * @param params.name - Filter by country name
   * @param params.code - Filter by ISO country code
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of Country objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const countries = await client.getCountries({ name: "USA" });
   * ```
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
   * Get all available baseball seasons
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
   * Get baseball leagues with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by league ID
   * @param params.name - Filter by league name
   * @param params.country - Filter by country name
   * @param params.season - Filter by season year
   * @param params.type - Filter by type ("league" or "cup")
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of LeagueResponse objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const mlb = await client.getLeagues({ country: "USA" });
   * ```
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
   * Get baseball teams with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by team ID
   * @param params.name - Filter by team name
   * @param params.league - Filter by league ID
   * @param params.season - Filter by season year
   * @param params.country - Filter by country name
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of TeamResponse objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const teams = await client.getTeams({ league: 1, season: 2023 });
   * ```
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
   * Get team statistics for a specific league and season
   *
   * @param params - Required filter parameters
   * @param params.league - League ID (required)
   * @param params.season - Season year (required)
   * @param params.team - Team ID (required)
   * @returns Promise resolving to team statistics data
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const stats = await client.getTeamStatistics({ league: 1, season: 2023, team: 1 });
   * ```
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
   * Get baseball games with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by game ID
   * @param params.league - Filter by league ID
   * @param params.season - Filter by season year
   * @param params.team - Filter by team ID
   * @param params.date - Filter by date (YYYY-MM-DD)
   * @param params.live - Get live games ("all" or league IDs)
   * @param params.timezone - Timezone for date filtering
   * @returns Promise resolving to array of Game objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const liveGames = await client.getGames({ live: "all" });
   * ```
   */
  async getGames(
    params?: BaseballGamesParams,
  ): Promise<ApiBaseballResponse<BaseballGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<BaseballGame>(`${BASEBALL_ENDPOINTS.GAMES}${query}`);
  }

  /**
   * Get head-to-head games between two baseball teams
   *
   * @param params - Parameters including h2h team IDs
   * @param params.h2h - Hyphen-separated team IDs (e.g., "1-2")
   * @param params.league - Optional league ID filter
   * @param params.season - Optional season year filter
   * @returns Promise resolving to array of Game objects for the matchup
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const h2h = await client.getGamesHeadToHead({ h2h: "1-2" });
   * ```
   */
  async getGamesHeadToHead(
    params: BaseballHeadToHeadParams,
  ): Promise<ApiBaseballResponse<BaseballGame>> {
    const query = buildQueryString(params);
    return this.request<BaseballGame>(
      `${BASEBALL_ENDPOINTS.GAMES_HEAD_TO_HEAD}${query}`,
    );
  }

  // ============================================================================
  // Standings Endpoints
  // ============================================================================

  /**
   * Get baseball standings for a league and season
   *
   * @param params - Required filter parameters
   * @param params.league - League ID (required)
   * @param params.season - Season year (required)
   * @param params.team - Optional team ID filter
   * @param params.group - Optional group filter
   * @param params.stage - Optional stage filter
   * @returns Promise resolving to array of Standing objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const standings = await client.getStandings({ league: 1, season: 2023 });
   * ```
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
 *
 * @param networkClient - NetworkClient instance for making HTTP requests
 * @param config - API configuration including API key
 * @returns New ApiBaseballClient instance
 *
 * @example
 * ```typescript
 * const client = createApiBaseballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 * ```
 */
export const createApiBaseballClient = (
  networkClient: NetworkClient,
  config: ApiBaseballConfig,
): ApiBaseballClient => {
  return new ApiBaseballClient(networkClient, config);
};
