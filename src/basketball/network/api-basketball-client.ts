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
import {
  ApiSportsError,
  ApiSportsErrorType,
  classifyApiError,
} from "../../common/api-sports-error";
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
 * Uses NetworkClient from @sudobility/di for network requests, enabling
 * cross-platform compatibility between React and React Native.
 *
 * @class ApiBasketballClient
 *
 * @example
 * ```typescript
 * // Direct API authentication
 * const client = new ApiBasketballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * // RapidAPI authentication
 * const rapidClient = new ApiBasketballClient(networkClient, {
 *   apiKey: "YOUR_RAPIDAPI_KEY",
 *   useRapidApi: true,
 *   rapidApiHost: "api-basketball-v1.p.rapidapi.com",
 * });
 * ```
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
   *
   * @template T - The expected response data type
   * @param endpoint - The API endpoint path with query string
   * @returns Promise resolving to the typed API response
   * @throws {ApiSportsError} When no data is received or API returns errors
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
      throw new ApiSportsError(
        "No data received from API-Basketball",
        "Basketball",
        ApiSportsErrorType.NO_DATA,
      );
    }

    // Check for API errors
    const data = response.data as ApiBasketballResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new ApiSportsError(
        `API-Basketball error: ${errorMsg}`,
        "Basketball",
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
   * @returns Promise resolving to array of timezone strings (e.g., "Europe/London")
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const timezones = await client.getTimezone();
   * console.log(timezones.response); // ["Europe/London", "America/New_York", ...]
   * ```
   */
  async getTimezone(): Promise<ApiBasketballResponse<BasketballTimezone>> {
    return this.request<BasketballTimezone>(BASKETBALL_ENDPOINTS.TIMEZONE);
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
   * const countries = await client.getCountries({ search: "usa" });
   * ```
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
   * Get all available seasons for basketball leagues
   *
   * @param params - Optional filter parameters
   * @returns Promise resolving to array of season strings (e.g., ["2022-2023", "2023-2024"])
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const seasons = await client.getSeasons();
   * ```
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
   * Get basketball leagues with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by league ID
   * @param params.name - Filter by league name
   * @param params.country - Filter by country name
   * @param params.season - Filter by season
   * @param params.type - Filter by type ("league" or "cup")
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of LeagueResponse objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const nba = await client.getLeagues({ id: 12 });
   * const usaLeagues = await client.getLeagues({ country: "USA" });
   * ```
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
   * Get basketball teams with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by team ID
   * @param params.name - Filter by team name
   * @param params.league - Filter by league ID
   * @param params.season - Filter by season
   * @param params.country - Filter by country name
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of TeamResponse objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const teams = await client.getTeams({ league: 12, season: "2023-2024" });
   * ```
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
   * Get team statistics for a specific league and season
   *
   * @param params - Required filter parameters
   * @param params.league - League ID (required)
   * @param params.season - Season string (required)
   * @param params.team - Team ID (required)
   * @returns Promise resolving to team statistics data
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const stats = await client.getTeamStatistics({ league: 12, season: "2023-2024", team: 137 });
   * ```
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
   * Get basketball games with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by game ID
   * @param params.league - Filter by league ID
   * @param params.season - Filter by season
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
   * const todayGames = await client.getGames({ date: "2024-01-15" });
   * ```
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
   * Get head-to-head games between two basketball teams
   *
   * @param params - Parameters including h2h team IDs
   * @param params.h2h - Hyphen-separated team IDs (e.g., "137-139")
   * @param params.league - Optional league ID filter
   * @param params.season - Optional season filter
   * @returns Promise resolving to array of Game objects for the matchup
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const h2h = await client.getGamesHeadToHead({ h2h: "137-139" });
   * ```
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
   * Get basketball standings for a league and season
   *
   * @param params - Required filter parameters
   * @param params.league - League ID (required)
   * @param params.season - Season string (required)
   * @param params.team - Optional team ID filter
   * @param params.group - Optional group filter
   * @param params.stage - Optional stage filter
   * @returns Promise resolving to array of Standing objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const standings = await client.getStandings({ league: 12, season: "2023-2024" });
   * ```
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
 *
 * @param networkClient - NetworkClient instance for making HTTP requests
 * @param config - API configuration including API key
 * @returns New ApiBasketballClient instance
 *
 * @example
 * ```typescript
 * const client = createApiBasketballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 * ```
 */
export const createApiBasketballClient = (
  networkClient: NetworkClient,
  config: ApiBasketballConfig,
): ApiBasketballClient => {
  return new ApiBasketballClient(networkClient, config);
};
