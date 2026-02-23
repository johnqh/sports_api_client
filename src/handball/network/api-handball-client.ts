/**
 * @module api-handball-client
 * @description API-Handball Client Library
 *
 * A TypeScript client for the API-Handball API that provides type-safe
 * access to handball data including leagues, teams, games, standings, odds, and more.
 *
 * Uses dependency injection for network requests, making it compatible with
 * both React (web) and React Native applications.
 *
 * @example
 * ```typescript
 * import { ApiHandballClient } from "@sudobility/sports_api_client";
 *
 * const client = new ApiHandballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "Germany" });
 * ```
 */

import type { NetworkClient } from "@sudobility/types";
import type {
  ApiHandballConfig,
  ApiHandballResponse,
  HandballCountriesParams,
  HandballCountry,
  HandballGame,
  HandballGamesParams,
  HandballH2HParams,
  HandballLeagueResponse,
  HandballLeaguesParams,
  HandballOdds,
  HandballOddsParams,
  HandballSeason,
  HandballSeasonsParams,
  HandballStandingsParams,
  HandballStandingsResponse,
  HandballTeamResponse,
  HandballTeamsParams,
  HandballTimezone,
} from "../types";
import {
  ApiSportsError,
  ApiSportsErrorType,
  classifyApiError,
} from "../../common/api-sports-error";
import { buildQueryString } from "../../utils/query-params";
import {
  HANDBALL_API_BASE_URL,
  HANDBALL_DEFAULT_HEADERS,
  HANDBALL_ENDPOINTS,
  HANDBALL_RAPIDAPI_HOST,
} from "./handball-endpoints";

/**
 * API-Handball Client class
 *
 * Provides type-safe methods for all API-Handball endpoints including
 * leagues, teams, games, standings, head-to-head, and odds.
 * Uses NetworkClient from @sudobility/di for network requests, enabling
 * cross-platform compatibility between React and React Native.
 *
 * @class ApiHandballClient
 *
 * @example
 * ```typescript
 * const client = new ApiHandballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "Germany" });
 * ```
 */
export class ApiHandballClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

  /**
   * Create a new ApiHandballClient instance
   *
   * @param networkClient - NetworkClient instance for making HTTP requests
   * @param config - API configuration including API key
   */
  constructor(networkClient: NetworkClient, config: ApiHandballConfig) {
    this.networkClient = networkClient;
    this.baseUrl = config.baseUrl || HANDBALL_API_BASE_URL;

    if (config.useRapidApi && config.rapidApiHost) {
      this.headers = {
        ...HANDBALL_DEFAULT_HEADERS,
        "x-rapidapi-host": config.rapidApiHost || HANDBALL_RAPIDAPI_HOST,
        "x-rapidapi-key": config.apiKey,
      };
    } else {
      this.headers = {
        ...HANDBALL_DEFAULT_HEADERS,
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
  private async request<T>(endpoint: string): Promise<ApiHandballResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiHandballResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new ApiSportsError(
        "No data received from API-Handball",
        "Handball",
        ApiSportsErrorType.NO_DATA,
      );
    }

    const data = response.data as ApiHandballResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new ApiSportsError(
        `API-Handball error: ${errorMsg}`,
        "Handball",
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
  async getTimezones(): Promise<ApiHandballResponse<HandballTimezone>> {
    return this.request<HandballTimezone>(HANDBALL_ENDPOINTS.TIMEZONE);
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
   * const countries = await client.getCountries({ search: "ger" });
   * ```
   */
  async getCountries(
    params?: HandballCountriesParams,
  ): Promise<ApiHandballResponse<HandballCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HandballCountry>(
      `${HANDBALL_ENDPOINTS.COUNTRIES}${query}`,
    );
  }

  /**
   * Get all available handball seasons
   *
   * @param params - Optional filter parameters
   * @returns Promise resolving to array of Season objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const seasons = await client.getSeasons();
   * ```
   */
  async getSeasons(
    params?: HandballSeasonsParams,
  ): Promise<ApiHandballResponse<HandballSeason>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HandballSeason>(
      `${HANDBALL_ENDPOINTS.SEASONS}${query}`,
    );
  }

  // ============================================================================
  // Leagues Endpoints
  // ============================================================================

  /**
   * Get handball leagues with optional filtering
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
   * const leagues = await client.getLeagues({ country: "Germany" });
   * ```
   */
  async getLeagues(
    params?: HandballLeaguesParams,
  ): Promise<ApiHandballResponse<HandballLeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HandballLeagueResponse>(
      `${HANDBALL_ENDPOINTS.LEAGUES}${query}`,
    );
  }

  // ============================================================================
  // Teams Endpoints
  // ============================================================================

  /**
   * Get handball teams with optional filtering
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
   * const teams = await client.getTeams({ league: 1, season: 2023 });
   * ```
   */
  async getTeams(
    params?: HandballTeamsParams,
  ): Promise<ApiHandballResponse<HandballTeamResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HandballTeamResponse>(
      `${HANDBALL_ENDPOINTS.TEAMS}${query}`,
    );
  }

  // ============================================================================
  // Standings Endpoints
  // ============================================================================

  /**
   * Get handball standings for a league and season
   *
   * @param params - Required filter parameters
   * @param params.league - League ID (required)
   * @param params.season - Season (required)
   * @param params.team - Optional team ID filter
   * @param params.group - Optional group filter
   * @param params.stage - Optional stage filter
   * @returns Promise resolving to array of StandingsResponse objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const standings = await client.getStandings({ league: 1, season: 2023 });
   * ```
   */
  async getStandings(
    params: HandballStandingsParams,
  ): Promise<ApiHandballResponse<HandballStandingsResponse>> {
    const query = buildQueryString(params);
    return this.request<HandballStandingsResponse>(
      `${HANDBALL_ENDPOINTS.STANDINGS}${query}`,
    );
  }

  // ============================================================================
  // Games Endpoints
  // ============================================================================

  /**
   * Get handball games with optional filtering
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
   * ```
   */
  async getGames(
    params?: HandballGamesParams,
  ): Promise<ApiHandballResponse<HandballGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HandballGame>(`${HANDBALL_ENDPOINTS.GAMES}${query}`);
  }

  /**
   * Get head-to-head games between two handball teams
   *
   * @param params - Parameters including h2h team IDs
   * @param params.h2h - Hyphen-separated team IDs (e.g., "1-2")
   * @param params.league - Optional league ID filter
   * @param params.season - Optional season filter
   * @returns Promise resolving to array of Game objects for the matchup
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const h2h = await client.getH2H({ h2h: "1-2" });
   * ```
   */
  async getH2H(
    params: HandballH2HParams,
  ): Promise<ApiHandballResponse<HandballGame>> {
    const query = buildQueryString(params);
    return this.request<HandballGame>(`${HANDBALL_ENDPOINTS.H2H}${query}`);
  }

  // ============================================================================
  // Odds Endpoints
  // ============================================================================

  /**
   * Get betting odds for handball games
   *
   * @param params - Required filter parameters
   * @param params.game - Game ID (required)
   * @param params.bookmaker - Optional bookmaker ID filter
   * @returns Promise resolving to array of Odds objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const odds = await client.getOdds({ game: 12345 });
   * ```
   */
  async getOdds(
    params: HandballOddsParams,
  ): Promise<ApiHandballResponse<HandballOdds>> {
    const query = buildQueryString(params);
    return this.request<HandballOdds>(`${HANDBALL_ENDPOINTS.ODDS}${query}`);
  }
}

/**
 * Factory function to create an ApiHandballClient instance
 *
 * @param networkClient - NetworkClient instance for making HTTP requests
 * @param config - API configuration including API key
 * @returns New ApiHandballClient instance
 *
 * @example
 * ```typescript
 * const client = createApiHandballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 * ```
 */
export function createApiHandballClient(
  networkClient: NetworkClient,
  config: ApiHandballConfig,
): ApiHandballClient {
  return new ApiHandballClient(networkClient, config);
}
