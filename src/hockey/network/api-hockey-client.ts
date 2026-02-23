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
import {
  ApiSportsError,
  ApiSportsErrorType,
  classifyApiError,
} from "../../common/api-sports-error";
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
 * Uses NetworkClient from @sudobility/di for network requests, enabling
 * cross-platform compatibility between React and React Native.
 *
 * @class ApiHockeyClient
 *
 * @example
 * ```typescript
 * // Direct API authentication
 * const client = new ApiHockeyClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * // RapidAPI authentication
 * const rapidClient = new ApiHockeyClient(networkClient, {
 *   apiKey: "YOUR_RAPIDAPI_KEY",
 *   useRapidApi: true,
 *   rapidApiHost: "api-hockey-v1.p.rapidapi.com",
 * });
 * ```
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
   *
   * @template T - The expected response data type
   * @param endpoint - The API endpoint path with query string
   * @returns Promise resolving to the typed API response
   * @throws {ApiSportsError} When no data is received or API returns errors
   */
  private async request<T>(endpoint: string): Promise<ApiHockeyResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiHockeyResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new ApiSportsError(
        "No data received from API-Hockey",
        "Hockey",
        ApiSportsErrorType.NO_DATA,
      );
    }

    // Check for API errors
    const data = response.data as ApiHockeyResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new ApiSportsError(
        `API-Hockey error: ${errorMsg}`,
        "Hockey",
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
   * console.log(timezones.response);
   * ```
   */
  async getTimezone(): Promise<ApiHockeyResponse<HockeyTimezone>> {
    return this.request<HockeyTimezone>(HOCKEY_ENDPOINTS.TIMEZONE);
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
   * const countries = await client.getCountries({ search: "can" });
   * ```
   */
  async getCountries(
    params?: HockeyCountriesParams,
  ): Promise<ApiHockeyResponse<HockeyCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HockeyCountry>(`${HOCKEY_ENDPOINTS.COUNTRIES}${query}`);
  }

  /**
   * Get all available seasons for hockey leagues
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
    params?: HockeySeasonsParams,
  ): Promise<ApiHockeyResponse<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(`${HOCKEY_ENDPOINTS.SEASONS}${query}`);
  }

  // ============================================================================
  // Leagues Endpoints
  // ============================================================================

  /**
   * Get hockey leagues with optional filtering
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
   * const nhl = await client.getLeagues({ country: "USA" });
   * ```
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
   * Get hockey teams with optional filtering
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
   * const teams = await client.getTeams({ league: 57, season: 2023 });
   * ```
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
   * const stats = await client.getTeamStatistics({ league: 57, season: 2023, team: 1 });
   * ```
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
   * Get hockey games with optional filtering
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
    params?: HockeyGamesParams,
  ): Promise<ApiHockeyResponse<HockeyGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HockeyGame>(`${HOCKEY_ENDPOINTS.GAMES}${query}`);
  }

  /**
   * Get head-to-head games between two hockey teams
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
   * Get hockey standings for a league and season
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
   * const standings = await client.getStandings({ league: 57, season: 2023 });
   * ```
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
 *
 * @param networkClient - NetworkClient instance for making HTTP requests
 * @param config - API configuration including API key
 * @returns New ApiHockeyClient instance
 *
 * @example
 * ```typescript
 * const client = createApiHockeyClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 * ```
 */
export const createApiHockeyClient = (
  networkClient: NetworkClient,
  config: ApiHockeyConfig,
): ApiHockeyClient => {
  return new ApiHockeyClient(networkClient, config);
};
