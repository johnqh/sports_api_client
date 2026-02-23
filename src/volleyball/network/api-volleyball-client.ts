/**
 * @module api-volleyball-client
 * @description API-Volleyball Client Library
 *
 * A TypeScript client for the API-Volleyball API that provides type-safe
 * access to volleyball data including leagues, teams, games, standings, and head-to-head.
 *
 * Uses dependency injection for network requests, making it compatible with
 * both React (web) and React Native applications.
 *
 * @example
 * ```typescript
 * import { ApiVolleyballClient } from "@sudobility/sports_api_client";
 *
 * const client = new ApiVolleyballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "Brazil" });
 * ```
 */

import type { NetworkClient } from "@sudobility/types";
import type {
  ApiVolleyballConfig,
  ApiVolleyballResponse,
  VolleyballCountriesParams,
  VolleyballCountry,
  VolleyballGame,
  VolleyballGamesParams,
  VolleyballH2HParams,
  VolleyballLeagueResponse,
  VolleyballLeaguesParams,
  VolleyballSeason,
  VolleyballSeasonsParams,
  VolleyballStandingsParams,
  VolleyballStandingsResponse,
  VolleyballTeamResponse,
  VolleyballTeamsParams,
  VolleyballTimezone,
} from "../types";
import {
  ApiSportsError,
  ApiSportsErrorType,
  classifyApiError,
} from "../../common/api-sports-error";
import { buildQueryString } from "../../utils/query-params";
import {
  VOLLEYBALL_API_BASE_URL,
  VOLLEYBALL_DEFAULT_HEADERS,
  VOLLEYBALL_ENDPOINTS,
  VOLLEYBALL_RAPIDAPI_HOST,
} from "./volleyball-endpoints";

/**
 * API-Volleyball Client class
 *
 * Provides type-safe methods for all API-Volleyball endpoints including
 * leagues, teams, games, standings, and head-to-head.
 * Uses NetworkClient from @sudobility/di for network requests, enabling
 * cross-platform compatibility between React and React Native.
 *
 * @class ApiVolleyballClient
 *
 * @example
 * ```typescript
 * const client = new ApiVolleyballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "Brazil" });
 * ```
 */
export class ApiVolleyballClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

  /**
   * Create a new ApiVolleyballClient instance
   *
   * @param networkClient - NetworkClient instance for making HTTP requests
   * @param config - API configuration including API key
   */
  constructor(networkClient: NetworkClient, config: ApiVolleyballConfig) {
    this.networkClient = networkClient;
    this.baseUrl = config.baseUrl || VOLLEYBALL_API_BASE_URL;

    if (config.useRapidApi && config.rapidApiHost) {
      this.headers = {
        ...VOLLEYBALL_DEFAULT_HEADERS,
        "x-rapidapi-host": config.rapidApiHost || VOLLEYBALL_RAPIDAPI_HOST,
        "x-rapidapi-key": config.apiKey,
      };
    } else {
      this.headers = {
        ...VOLLEYBALL_DEFAULT_HEADERS,
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
  ): Promise<ApiVolleyballResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiVolleyballResponse<T>>(
      url,
      {
        headers: this.headers,
      },
    );

    if (response.data === undefined || response.data === null) {
      throw new ApiSportsError(
        "No data received from API-Volleyball",
        "Volleyball",
        ApiSportsErrorType.NO_DATA,
      );
    }

    const data = response.data as ApiVolleyballResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new ApiSportsError(
        `API-Volleyball error: ${errorMsg}`,
        "Volleyball",
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
  async getTimezones(): Promise<ApiVolleyballResponse<VolleyballTimezone>> {
    return this.request<VolleyballTimezone>(VOLLEYBALL_ENDPOINTS.TIMEZONE);
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
   * const countries = await client.getCountries({ search: "bra" });
   * ```
   */
  async getCountries(
    params?: VolleyballCountriesParams,
  ): Promise<ApiVolleyballResponse<VolleyballCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<VolleyballCountry>(
      `${VOLLEYBALL_ENDPOINTS.COUNTRIES}${query}`,
    );
  }

  /**
   * Get all available volleyball seasons
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
    params?: VolleyballSeasonsParams,
  ): Promise<ApiVolleyballResponse<VolleyballSeason>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<VolleyballSeason>(
      `${VOLLEYBALL_ENDPOINTS.SEASONS}${query}`,
    );
  }

  // ============================================================================
  // Leagues Endpoints
  // ============================================================================

  /**
   * Get volleyball leagues with optional filtering
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
   * const leagues = await client.getLeagues({ country: "Brazil" });
   * ```
   */
  async getLeagues(
    params?: VolleyballLeaguesParams,
  ): Promise<ApiVolleyballResponse<VolleyballLeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<VolleyballLeagueResponse>(
      `${VOLLEYBALL_ENDPOINTS.LEAGUES}${query}`,
    );
  }

  // ============================================================================
  // Teams Endpoints
  // ============================================================================

  /**
   * Get volleyball teams with optional filtering
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
    params?: VolleyballTeamsParams,
  ): Promise<ApiVolleyballResponse<VolleyballTeamResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<VolleyballTeamResponse>(
      `${VOLLEYBALL_ENDPOINTS.TEAMS}${query}`,
    );
  }

  // ============================================================================
  // Standings Endpoints
  // ============================================================================

  /**
   * Get volleyball standings for a league and season
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
    params: VolleyballStandingsParams,
  ): Promise<ApiVolleyballResponse<VolleyballStandingsResponse>> {
    const query = buildQueryString(params);
    return this.request<VolleyballStandingsResponse>(
      `${VOLLEYBALL_ENDPOINTS.STANDINGS}${query}`,
    );
  }

  // ============================================================================
  // Games Endpoints
  // ============================================================================

  /**
   * Get volleyball games with optional filtering
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
    params?: VolleyballGamesParams,
  ): Promise<ApiVolleyballResponse<VolleyballGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<VolleyballGame>(
      `${VOLLEYBALL_ENDPOINTS.GAMES}${query}`,
    );
  }

  /**
   * Get head-to-head games between two volleyball teams
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
    params: VolleyballH2HParams,
  ): Promise<ApiVolleyballResponse<VolleyballGame>> {
    const query = buildQueryString(params);
    return this.request<VolleyballGame>(`${VOLLEYBALL_ENDPOINTS.H2H}${query}`);
  }
}

/**
 * Factory function to create an ApiVolleyballClient instance
 *
 * @param networkClient - NetworkClient instance for making HTTP requests
 * @param config - API configuration including API key
 * @returns New ApiVolleyballClient instance
 *
 * @example
 * ```typescript
 * const client = createApiVolleyballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 * ```
 */
export function createApiVolleyballClient(
  networkClient: NetworkClient,
  config: ApiVolleyballConfig,
): ApiVolleyballClient {
  return new ApiVolleyballClient(networkClient, config);
}
