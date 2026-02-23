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
import {
  ApiSportsError,
  ApiSportsErrorType,
  classifyApiError,
} from "../../common/api-sports-error";
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
 * Provides type-safe methods for all API-American-Football (NFL) endpoints.
 * Uses NetworkClient from @sudobility/di for network requests, enabling
 * cross-platform compatibility between React and React Native.
 *
 * @class ApiNflClient
 *
 * @example
 * ```typescript
 * // Direct API authentication
 * const client = new ApiNflClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * // RapidAPI authentication
 * const rapidClient = new ApiNflClient(networkClient, {
 *   apiKey: "YOUR_RAPIDAPI_KEY",
 *   useRapidApi: true,
 *   rapidApiHost: "api-american-football-v1.p.rapidapi.com",
 * });
 * ```
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
   *
   * @template T - The expected response data type
   * @param endpoint - The API endpoint path with query string
   * @returns Promise resolving to the typed API response
   * @throws {ApiSportsError} When no data is received or API returns errors
   */
  private async request<T>(endpoint: string): Promise<ApiNflResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiNflResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new ApiSportsError(
        "No data received from API-NFL",
        "NFL",
        ApiSportsErrorType.NO_DATA,
      );
    }

    // Check for API errors
    const data = response.data as ApiNflResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new ApiSportsError(
        `API-NFL error: ${errorMsg}`,
        "NFL",
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
  async getTimezone(): Promise<ApiNflResponse<NflTimezone>> {
    return this.request<NflTimezone>(NFL_ENDPOINTS.TIMEZONE);
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
    params?: NflCountriesParams,
  ): Promise<ApiNflResponse<NflCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<NflCountry>(`${NFL_ENDPOINTS.COUNTRIES}${query}`);
  }

  /**
   * Get all available NFL seasons
   *
   * @param params - Optional filter parameters
   * @returns Promise resolving to array of season years
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const seasons = await client.getSeasons();
   * const latestSeason = Math.max(...seasons.response);
   * ```
   */
  async getSeasons(params?: NflSeasonsParams): Promise<ApiNflResponse<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(`${NFL_ENDPOINTS.SEASONS}${query}`);
  }

  // ============================================================================
  // Leagues Endpoints
  // ============================================================================

  /**
   * Get NFL leagues with optional filtering
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
   * const leagues = await client.getLeagues({ country: "USA" });
   * ```
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
   * Get NFL teams with optional filtering
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
    params?: NflTeamsParams,
  ): Promise<ApiNflResponse<NflTeamResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<NflTeamResponse>(`${NFL_ENDPOINTS.TEAMS}${query}`);
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
   * Get NFL games with optional filtering
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
   * const sundayGames = await client.getGames({ date: "2024-01-14" });
   * ```
   */
  async getGames(params?: NflGamesParams): Promise<ApiNflResponse<NflGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<NflGame>(`${NFL_ENDPOINTS.GAMES}${query}`);
  }

  /**
   * Get head-to-head games between two NFL teams
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
    params: NflHeadToHeadParams,
  ): Promise<ApiNflResponse<NflGame>> {
    const query = buildQueryString(params);
    return this.request<NflGame>(`${NFL_ENDPOINTS.GAMES_HEAD_TO_HEAD}${query}`);
  }

  // ============================================================================
  // Standings Endpoints
  // ============================================================================

  /**
   * Get NFL standings for a league and season
   *
   * @param params - Required filter parameters
   * @param params.league - League ID (required)
   * @param params.season - Season year (required)
   * @param params.team - Optional team ID filter
   * @param params.group - Optional group/division filter
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
    params: NflStandingsParams,
  ): Promise<ApiNflResponse<NflStanding>> {
    const query = buildQueryString(params);
    return this.request<NflStanding>(`${NFL_ENDPOINTS.STANDINGS}${query}`);
  }
}

/**
 * Factory function to create an ApiNflClient instance
 *
 * @param networkClient - NetworkClient instance for making HTTP requests
 * @param config - API configuration including API key
 * @returns New ApiNflClient instance
 *
 * @example
 * ```typescript
 * const client = createApiNflClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 * ```
 */
export const createApiNflClient = (
  networkClient: NetworkClient,
  config: ApiNflConfig,
): ApiNflClient => {
  return new ApiNflClient(networkClient, config);
};
