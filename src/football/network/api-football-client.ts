/**
 * @module api-football-client
 * @description API-Football v3 Client Library
 *
 * A TypeScript client for the API-Football v3 API that provides type-safe
 * access to football data including leagues, teams, fixtures, players, and more.
 *
 * Uses dependency injection for network requests, making it compatible with
 * both React (web) and React Native applications.
 *
 * @example
 * ```typescript
 * import { ApiFootballClient } from "@sudobility/sports_api_client";
 *
 * const client = new ApiFootballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const leagues = await client.getLeagues({ country: "England" });
 * ```
 */

import type { NetworkClient } from "@sudobility/types";
import type {
  ApiFootballConfig,
  ApiFootballResponse,
  FootballCoach,
  FootballCoachsParams,
  FootballCountriesParams,
  FootballCountry,
  FootballFixtureEvent,
  FootballFixtureEventsParams,
  FootballFixtureLineup,
  FootballFixtureLineupsParams,
  FootballFixturePlayersParams,
  FootballFixturePlayerStats,
  FootballFixtureResponse,
  FootballFixturesParams,
  FootballFixtureStatistics,
  FootballFixtureStatisticsParams,
  FootballHeadToHeadParams,
  FootballInjuriesParams,
  FootballInjury,
  FootballLeagueResponse,
  FootballLeaguesParams,
  FootballPlayerResponse,
  FootballPlayersParams,
  FootballPlayersSeasonParams,
  FootballSidelined,
  FootballSidelinedParams,
  FootballSquadResponse,
  FootballSquadsParams,
  FootballStandingsParams,
  FootballStandingsResponse,
  FootballTeamResponse,
  FootballTeamsParams,
  FootballTeamStatistics,
  FootballTeamStatisticsParams,
  FootballTimezone,
  FootballTopAssistsParams,
  FootballTopCardsParams,
  FootballTopScorersParams,
  FootballTransferResponse,
  FootballTransfersParams,
  FootballTrophiesParams,
  FootballTrophy,
  FootballVenue,
  FootballVenuesParams,
} from "../types";
import { buildQueryString } from "../../utils/query-params";
import {
  FOOTBALL_API_BASE_URL,
  FOOTBALL_DEFAULT_HEADERS,
  FOOTBALL_ENDPOINTS,
  FOOTBALL_RAPIDAPI_HOST,
} from "./football-endpoints";

/**
 * API-Football Client class
 *
 * Provides type-safe methods for all API-Football v3 endpoints.
 * Uses NetworkClient from @sudobility/di for network requests, enabling
 * cross-platform compatibility between React and React Native.
 *
 * @class ApiFootballClient
 *
 * @example
 * ```typescript
 * // Direct API authentication
 * const client = new ApiFootballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * // RapidAPI authentication
 * const rapidClient = new ApiFootballClient(networkClient, {
 *   apiKey: "YOUR_RAPIDAPI_KEY",
 *   useRapidApi: true,
 *   rapidApiHost: "api-football-v1.p.rapidapi.com",
 * });
 * ```
 */
export class ApiFootballClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

  /**
   * Create a new ApiFootballClient instance
   *
   * @param networkClient - NetworkClient instance for making HTTP requests
   * @param config - API configuration including API key
   */
  constructor(networkClient: NetworkClient, config: ApiFootballConfig) {
    this.networkClient = networkClient;
    this.baseUrl = config.baseUrl || FOOTBALL_API_BASE_URL;

    // Set up authentication headers
    if (config.useRapidApi && config.rapidApiHost) {
      this.headers = {
        ...FOOTBALL_DEFAULT_HEADERS,
        "x-rapidapi-host": config.rapidApiHost || FOOTBALL_RAPIDAPI_HOST,
        "x-rapidapi-key": config.apiKey,
      };
    } else {
      this.headers = {
        ...FOOTBALL_DEFAULT_HEADERS,
        "x-apisports-key": config.apiKey,
      };
    }
  }

  /**
   * Make a GET request to the API
   */
  private async request<T>(endpoint: string): Promise<ApiFootballResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiFootballResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new Error("No data received from API-Football");
    }

    // Check for API errors
    const data = response.data as ApiFootballResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new Error(`API-Football error: ${errorMsg}`);
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
   * @throws Error if API returns an error or no data
   *
   * @example
   * ```typescript
   * const timezones = await client.getTimezone();
   * console.log(timezones.response); // ["Europe/London", "America/New_York", ...]
   * ```
   */
  async getTimezone(): Promise<ApiFootballResponse<FootballTimezone>> {
    return this.request<FootballTimezone>(FOOTBALL_ENDPOINTS.TIMEZONE);
  }

  /**
   * Get all available countries or filter by name/code
   *
   * @param params - Optional filter parameters
   * @param params.name - Filter by country name
   * @param params.code - Filter by ISO 3166-1 alpha-2 code
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of Country objects
   * @throws Error if API returns an error or no data
   *
   * @example
   * ```typescript
   * // Get all countries
   * const allCountries = await client.getCountries();
   *
   * // Search for countries
   * const results = await client.getCountries({ search: "eng" });
   * ```
   */
  async getCountries(
    params?: FootballCountriesParams,
  ): Promise<ApiFootballResponse<FootballCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<FootballCountry>(
      `${FOOTBALL_ENDPOINTS.COUNTRIES}${query}`,
    );
  }

  // ============================================================================
  // Leagues Endpoints
  // ============================================================================

  /**
   * Get all available seasons (years) in the API
   *
   * @returns Promise resolving to array of season years (e.g., [2020, 2021, 2022, 2023])
   * @throws Error if API returns an error or no data
   *
   * @example
   * ```typescript
   * const seasons = await client.getSeasons();
   * const currentSeason = Math.max(...seasons.response);
   * ```
   */
  async getSeasons(): Promise<ApiFootballResponse<number>> {
    return this.request<number>(FOOTBALL_ENDPOINTS.LEAGUES_SEASONS);
  }

  /**
   * Get leagues and cups with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by league ID
   * @param params.name - Filter by league name
   * @param params.country - Filter by country name
   * @param params.season - Filter by season year
   * @param params.team - Filter by team ID
   * @param params.type - Filter by type ("league" or "cup")
   * @param params.current - Get only current leagues
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of LeagueResponse objects
   * @throws Error if API returns an error or no data
   *
   * @example
   * ```typescript
   * // Get Premier League
   * const pl = await client.getLeagues({ id: 39 });
   *
   * // Get all English leagues
   * const english = await client.getLeagues({ country: "England" });
   * ```
   */
  async getLeagues(
    params?: FootballLeaguesParams,
  ): Promise<ApiFootballResponse<FootballLeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<FootballLeagueResponse>(
      `${FOOTBALL_ENDPOINTS.LEAGUES}${query}`,
    );
  }

  // ============================================================================
  // Teams Endpoints
  // ============================================================================

  /**
   * Get teams
   */
  async getTeams(
    params: FootballTeamsParams,
  ): Promise<ApiFootballResponse<FootballTeamResponse>> {
    const query = buildQueryString(params);
    return this.request<FootballTeamResponse>(
      `${FOOTBALL_ENDPOINTS.TEAMS}${query}`,
    );
  }

  /**
   * Get team statistics
   */
  async getTeamStatistics(
    params: FootballTeamStatisticsParams,
  ): Promise<ApiFootballResponse<FootballTeamStatistics>> {
    const query = buildQueryString(params);
    return this.request<FootballTeamStatistics>(
      `${FOOTBALL_ENDPOINTS.TEAMS_STATISTICS}${query}`,
    );
  }

  /**
   * Get venues/stadiums
   */
  async getVenues(
    params?: FootballVenuesParams,
  ): Promise<ApiFootballResponse<FootballVenue>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<FootballVenue>(`${FOOTBALL_ENDPOINTS.VENUES}${query}`);
  }

  // ============================================================================
  // Standings Endpoints
  // ============================================================================

  /**
   * Get league standings/table for a season
   *
   * @param params - Required filter parameters
   * @param params.league - League ID (required)
   * @param params.season - Season year (required)
   * @param params.team - Filter by team ID
   * @returns Promise resolving to array of StandingsResponse objects
   * @throws Error if API returns an error or no data
   *
   * @example
   * ```typescript
   * // Get Premier League 2023 standings
   * const standings = await client.getStandings({ league: 39, season: 2023 });
   * const table = standings.response[0]?.league.standings[0];
   * ```
   */
  async getStandings(
    params: FootballStandingsParams,
  ): Promise<ApiFootballResponse<FootballStandingsResponse>> {
    const query = buildQueryString(params);
    return this.request<FootballStandingsResponse>(
      `${FOOTBALL_ENDPOINTS.STANDINGS}${query}`,
    );
  }

  // ============================================================================
  // Fixtures Endpoints
  // ============================================================================

  /**
   * Get fixtures (matches) with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by fixture ID
   * @param params.live - Get live fixtures ("all" or league IDs)
   * @param params.date - Filter by date (YYYY-MM-DD)
   * @param params.league - Filter by league ID
   * @param params.season - Filter by season year
   * @param params.team - Filter by team ID
   * @param params.last - Get last N fixtures
   * @param params.next - Get next N fixtures
   * @param params.from - Filter from date (YYYY-MM-DD)
   * @param params.to - Filter to date (YYYY-MM-DD)
   * @returns Promise resolving to array of FixtureResponse objects
   * @throws Error if API returns an error or no data
   *
   * @example
   * ```typescript
   * // Get live fixtures
   * const live = await client.getFixtures({ live: "all" });
   *
   * // Get fixtures for a date
   * const today = await client.getFixtures({ date: "2024-01-15" });
   *
   * // Get next 5 fixtures for a team
   * const next = await client.getFixtures({ team: 33, next: 5 });
   * ```
   */
  async getFixtures(
    params?: FootballFixturesParams,
  ): Promise<ApiFootballResponse<FootballFixtureResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<FootballFixtureResponse>(
      `${FOOTBALL_ENDPOINTS.FIXTURES}${query}`,
    );
  }

  /**
   * Get head to head fixtures between two teams
   */
  async getFixturesHeadToHead(
    params: FootballHeadToHeadParams,
  ): Promise<ApiFootballResponse<FootballFixtureResponse>> {
    const query = buildQueryString(params);
    return this.request<FootballFixtureResponse>(
      `${FOOTBALL_ENDPOINTS.FIXTURES_HEAD_TO_HEAD}${query}`,
    );
  }

  /**
   * Get fixture statistics
   */
  async getFixtureStatistics(
    params: FootballFixtureStatisticsParams,
  ): Promise<ApiFootballResponse<FootballFixtureStatistics>> {
    const query = buildQueryString(params);
    return this.request<FootballFixtureStatistics>(
      `${FOOTBALL_ENDPOINTS.FIXTURES_STATISTICS}${query}`,
    );
  }

  /**
   * Get fixture events (goals, cards, substitutions, VAR)
   */
  async getFixtureEvents(
    params: FootballFixtureEventsParams,
  ): Promise<ApiFootballResponse<FootballFixtureEvent>> {
    const query = buildQueryString(params);
    return this.request<FootballFixtureEvent>(
      `${FOOTBALL_ENDPOINTS.FIXTURES_EVENTS}${query}`,
    );
  }

  /**
   * Get fixture lineups
   */
  async getFixtureLineups(
    params: FootballFixtureLineupsParams,
  ): Promise<ApiFootballResponse<FootballFixtureLineup>> {
    const query = buildQueryString(params);
    return this.request<FootballFixtureLineup>(
      `${FOOTBALL_ENDPOINTS.FIXTURES_LINEUPS}${query}`,
    );
  }

  /**
   * Get player statistics for a fixture
   */
  async getFixturePlayers(
    params: FootballFixturePlayersParams,
  ): Promise<ApiFootballResponse<FootballFixturePlayerStats>> {
    const query = buildQueryString(params);
    return this.request<FootballFixturePlayerStats>(
      `${FOOTBALL_ENDPOINTS.FIXTURES_PLAYERS}${query}`,
    );
  }

  // ============================================================================
  // Players Endpoints
  // ============================================================================

  /**
   * Get players
   */
  async getPlayers(
    params: FootballPlayersParams,
  ): Promise<ApiFootballResponse<FootballPlayerResponse>> {
    const query = buildQueryString(params);
    return this.request<FootballPlayerResponse>(
      `${FOOTBALL_ENDPOINTS.PLAYERS}${query}`,
    );
  }

  /**
   * Get available player seasons
   */
  async getPlayersSeasons(
    params?: FootballPlayersSeasonParams,
  ): Promise<ApiFootballResponse<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(
      `${FOOTBALL_ENDPOINTS.PLAYERS_SEASONS}${query}`,
    );
  }

  /**
   * Get team squads or player's teams
   */
  async getSquads(
    params: FootballSquadsParams,
  ): Promise<ApiFootballResponse<FootballSquadResponse>> {
    const query = buildQueryString(params);
    return this.request<FootballSquadResponse>(
      `${FOOTBALL_ENDPOINTS.PLAYERS_SQUADS}${query}`,
    );
  }

  /**
   * Get top scorers for a league/season
   */
  async getTopScorers(
    params: FootballTopScorersParams,
  ): Promise<ApiFootballResponse<FootballPlayerResponse>> {
    const query = buildQueryString(params);
    return this.request<FootballPlayerResponse>(
      `${FOOTBALL_ENDPOINTS.PLAYERS_TOP_SCORERS}${query}`,
    );
  }

  /**
   * Get top assists for a league/season
   */
  async getTopAssists(
    params: FootballTopAssistsParams,
  ): Promise<ApiFootballResponse<FootballPlayerResponse>> {
    const query = buildQueryString(params);
    return this.request<FootballPlayerResponse>(
      `${FOOTBALL_ENDPOINTS.PLAYERS_TOP_ASSISTS}${query}`,
    );
  }

  /**
   * Get top cards (most carded players) for a league/season
   */
  async getTopCards(
    params: FootballTopCardsParams,
  ): Promise<ApiFootballResponse<FootballPlayerResponse>> {
    const query = buildQueryString(params);
    return this.request<FootballPlayerResponse>(
      `${FOOTBALL_ENDPOINTS.PLAYERS_TOP_CARDS}${query}`,
    );
  }

  // ============================================================================
  // Transfers Endpoints
  // ============================================================================

  /**
   * Get player transfers
   */
  async getTransfers(
    params: FootballTransfersParams,
  ): Promise<ApiFootballResponse<FootballTransferResponse>> {
    const query = buildQueryString(params);
    return this.request<FootballTransferResponse>(
      `${FOOTBALL_ENDPOINTS.TRANSFERS}${query}`,
    );
  }

  // ============================================================================
  // Trophies Endpoints
  // ============================================================================

  /**
   * Get trophies for a player or coach
   */
  async getTrophies(
    params: FootballTrophiesParams,
  ): Promise<ApiFootballResponse<FootballTrophy>> {
    const query = buildQueryString(params);
    return this.request<FootballTrophy>(
      `${FOOTBALL_ENDPOINTS.TROPHIES}${query}`,
    );
  }

  // ============================================================================
  // Sidelined Endpoints
  // ============================================================================

  /**
   * Get sidelined players (injured/suspended)
   */
  async getSidelined(
    params: FootballSidelinedParams,
  ): Promise<ApiFootballResponse<FootballSidelined>> {
    const query = buildQueryString(params);
    return this.request<FootballSidelined>(
      `${FOOTBALL_ENDPOINTS.SIDELINED}${query}`,
    );
  }

  // ============================================================================
  // Coachs Endpoints
  // ============================================================================

  /**
   * Get coach information
   */
  async getCoachs(
    params: FootballCoachsParams,
  ): Promise<ApiFootballResponse<FootballCoach>> {
    const query = buildQueryString(params);
    return this.request<FootballCoach>(`${FOOTBALL_ENDPOINTS.COACHS}${query}`);
  }

  // ============================================================================
  // Injuries Endpoints
  // ============================================================================

  /**
   * Get injuries
   */
  async getInjuries(
    params: FootballInjuriesParams,
  ): Promise<ApiFootballResponse<FootballInjury>> {
    const query = buildQueryString(params);
    return this.request<FootballInjury>(
      `${FOOTBALL_ENDPOINTS.INJURIES}${query}`,
    );
  }
}

/**
 * Factory function to create an ApiFootballClient instance
 *
 * @param networkClient - NetworkClient instance for making HTTP requests
 * @param config - API configuration including API key
 * @returns New ApiFootballClient instance
 *
 * @example
 * ```typescript
 * const client = createApiFootballClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 * ```
 */
export const createApiFootballClient = (
  networkClient: NetworkClient,
  config: ApiFootballConfig,
): ApiFootballClient => {
  return new ApiFootballClient(networkClient, config);
};
