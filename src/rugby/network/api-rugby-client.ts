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
import {
  ApiSportsError,
  ApiSportsErrorType,
  classifyApiError,
} from "../../common/api-sports-error";
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
 * Uses NetworkClient from @sudobility/di for network requests, enabling
 * cross-platform compatibility between React and React Native.
 *
 * @class ApiRugbyClient
 *
 * @example
 * ```typescript
 * const client = new ApiRugbyClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "England" });
 * ```
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
   *
   * @template T - The expected response data type
   * @param endpoint - The API endpoint path with query string
   * @returns Promise resolving to the typed API response
   * @throws {ApiSportsError} When no data is received or API returns errors
   */
  private async request<T>(endpoint: string): Promise<ApiRugbyResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiRugbyResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new ApiSportsError(
        "No data received from API-Rugby",
        "Rugby",
        ApiSportsErrorType.NO_DATA,
      );
    }

    // Check for API errors
    const data = response.data as ApiRugbyResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new ApiSportsError(
        `API-Rugby error: ${errorMsg}`,
        "Rugby",
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
  async getTimezone(): Promise<ApiRugbyResponse<RugbyTimezone>> {
    return this.request<RugbyTimezone>(RUGBY_ENDPOINTS.TIMEZONE);
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
   */
  async getCountries(
    params?: RugbyCountriesParams,
  ): Promise<ApiRugbyResponse<RugbyCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<RugbyCountry>(`${RUGBY_ENDPOINTS.COUNTRIES}${query}`);
  }

  /**
   * Get all available rugby seasons
   *
   * @param params - Optional filter parameters
   * @returns Promise resolving to array of season years
   * @throws {ApiSportsError} If API returns an error or no data
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
   * Get rugby leagues with optional filtering
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
   * const leagues = await client.getLeagues({ country: "England" });
   * ```
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
   * Get rugby teams with optional filtering
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
    params?: RugbyTeamsParams,
  ): Promise<ApiRugbyResponse<RugbyTeamResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<RugbyTeamResponse>(`${RUGBY_ENDPOINTS.TEAMS}${query}`);
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
   * Get rugby games with optional filtering
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
    params?: RugbyGamesParams,
  ): Promise<ApiRugbyResponse<RugbyGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<RugbyGame>(`${RUGBY_ENDPOINTS.GAMES}${query}`);
  }

  /**
   * Get head-to-head games between two rugby teams
   *
   * @param params - Parameters including h2h team IDs
   * @param params.h2h - Hyphen-separated team IDs (e.g., "1-2")
   * @param params.league - Optional league ID filter
   * @param params.season - Optional season year filter
   * @returns Promise resolving to array of Game objects for the matchup
   * @throws {ApiSportsError} If API returns an error or no data
   */
  async getGamesHeadToHead(
    params: RugbyHeadToHeadParams,
  ): Promise<ApiRugbyResponse<RugbyGame>> {
    const query = buildQueryString(params);
    return this.request<RugbyGame>(
      `${RUGBY_ENDPOINTS.GAMES_HEAD_TO_HEAD}${query}`,
    );
  }

  // ============================================================================
  // Standings Endpoints
  // ============================================================================

  /**
   * Get rugby standings for a league and season
   *
   * @param params - Required filter parameters
   * @param params.league - League ID (required)
   * @param params.season - Season year (required)
   * @param params.team - Optional team ID filter
   * @param params.group - Optional group filter
   * @returns Promise resolving to array of Standing objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const standings = await client.getStandings({ league: 1, season: 2023 });
   * ```
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
 *
 * @param networkClient - NetworkClient instance for making HTTP requests
 * @param config - API configuration including API key
 * @returns New ApiRugbyClient instance
 *
 * @example
 * ```typescript
 * const client = createApiRugbyClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 * ```
 */
export const createApiRugbyClient = (
  networkClient: NetworkClient,
  config: ApiRugbyConfig,
): ApiRugbyClient => {
  return new ApiRugbyClient(networkClient, config);
};
