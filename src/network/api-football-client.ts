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
  Coach,
  CoachsParams,
  CountriesParams,
  Country,
  FixtureEvent,
  FixtureEventsParams,
  FixtureLineup,
  FixtureLineupsParams,
  FixturePlayersParams,
  FixturePlayerStats,
  FixtureResponse,
  FixturesParams,
  FixtureStatistics,
  FixtureStatisticsParams,
  HeadToHeadParams,
  InjuriesParams,
  Injury,
  LeagueResponse,
  LeaguesParams,
  PlayerResponse,
  PlayersParams,
  PlayersSeasonParams,
  Sidelined,
  SidelinedParams,
  SquadResponse,
  SquadsParams,
  StandingsParams,
  StandingsResponse,
  TeamResponse,
  TeamsParams,
  TeamStatistics,
  TeamStatisticsParams,
  Timezone,
  TopAssistsParams,
  TopCardsParams,
  TopScorersParams,
  TransferResponse,
  TransfersParams,
  TrophiesParams,
  Trophy,
  Venue,
  VenuesParams,
} from "../types";
import { buildQueryString } from "../utils/query-params";
import {
  API_FOOTBALL_BASE_URL,
  DEFAULT_HEADERS,
  ENDPOINTS,
  RAPIDAPI_HOST,
} from "./endpoints";

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
    this.baseUrl = config.baseUrl || API_FOOTBALL_BASE_URL;

    // Set up authentication headers
    if (config.useRapidApi && config.rapidApiHost) {
      this.headers = {
        ...DEFAULT_HEADERS,
        "x-rapidapi-host": config.rapidApiHost || RAPIDAPI_HOST,
        "x-rapidapi-key": config.apiKey,
      };
    } else {
      this.headers = {
        ...DEFAULT_HEADERS,
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
  async getTimezone(): Promise<ApiFootballResponse<Timezone>> {
    return this.request<Timezone>(ENDPOINTS.TIMEZONE);
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
    params?: CountriesParams,
  ): Promise<ApiFootballResponse<Country>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<Country>(`${ENDPOINTS.COUNTRIES}${query}`);
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
    return this.request<number>(ENDPOINTS.LEAGUES_SEASONS);
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
    params?: LeaguesParams,
  ): Promise<ApiFootballResponse<LeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<LeagueResponse>(`${ENDPOINTS.LEAGUES}${query}`);
  }

  // ============================================================================
  // Teams Endpoints
  // ============================================================================

  /**
   * Get teams
   */
  async getTeams(
    params: TeamsParams,
  ): Promise<ApiFootballResponse<TeamResponse>> {
    const query = buildQueryString(params);
    return this.request<TeamResponse>(`${ENDPOINTS.TEAMS}${query}`);
  }

  /**
   * Get team statistics
   */
  async getTeamStatistics(
    params: TeamStatisticsParams,
  ): Promise<ApiFootballResponse<TeamStatistics>> {
    const query = buildQueryString(params);
    return this.request<TeamStatistics>(
      `${ENDPOINTS.TEAMS_STATISTICS}${query}`,
    );
  }

  /**
   * Get venues/stadiums
   */
  async getVenues(params?: VenuesParams): Promise<ApiFootballResponse<Venue>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<Venue>(`${ENDPOINTS.VENUES}${query}`);
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
    params: StandingsParams,
  ): Promise<ApiFootballResponse<StandingsResponse>> {
    const query = buildQueryString(params);
    return this.request<StandingsResponse>(`${ENDPOINTS.STANDINGS}${query}`);
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
    params?: FixturesParams,
  ): Promise<ApiFootballResponse<FixtureResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<FixtureResponse>(`${ENDPOINTS.FIXTURES}${query}`);
  }

  /**
   * Get head to head fixtures between two teams
   */
  async getFixturesHeadToHead(
    params: HeadToHeadParams,
  ): Promise<ApiFootballResponse<FixtureResponse>> {
    const query = buildQueryString(params);
    return this.request<FixtureResponse>(
      `${ENDPOINTS.FIXTURES_HEAD_TO_HEAD}${query}`,
    );
  }

  /**
   * Get fixture statistics
   */
  async getFixtureStatistics(
    params: FixtureStatisticsParams,
  ): Promise<ApiFootballResponse<FixtureStatistics>> {
    const query = buildQueryString(params);
    return this.request<FixtureStatistics>(
      `${ENDPOINTS.FIXTURES_STATISTICS}${query}`,
    );
  }

  /**
   * Get fixture events (goals, cards, substitutions, VAR)
   */
  async getFixtureEvents(
    params: FixtureEventsParams,
  ): Promise<ApiFootballResponse<FixtureEvent>> {
    const query = buildQueryString(params);
    return this.request<FixtureEvent>(`${ENDPOINTS.FIXTURES_EVENTS}${query}`);
  }

  /**
   * Get fixture lineups
   */
  async getFixtureLineups(
    params: FixtureLineupsParams,
  ): Promise<ApiFootballResponse<FixtureLineup>> {
    const query = buildQueryString(params);
    return this.request<FixtureLineup>(`${ENDPOINTS.FIXTURES_LINEUPS}${query}`);
  }

  /**
   * Get player statistics for a fixture
   */
  async getFixturePlayers(
    params: FixturePlayersParams,
  ): Promise<ApiFootballResponse<FixturePlayerStats>> {
    const query = buildQueryString(params);
    return this.request<FixturePlayerStats>(
      `${ENDPOINTS.FIXTURES_PLAYERS}${query}`,
    );
  }

  // ============================================================================
  // Players Endpoints
  // ============================================================================

  /**
   * Get players
   */
  async getPlayers(
    params: PlayersParams,
  ): Promise<ApiFootballResponse<PlayerResponse>> {
    const query = buildQueryString(params);
    return this.request<PlayerResponse>(`${ENDPOINTS.PLAYERS}${query}`);
  }

  /**
   * Get available player seasons
   */
  async getPlayersSeasons(
    params?: PlayersSeasonParams,
  ): Promise<ApiFootballResponse<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(`${ENDPOINTS.PLAYERS_SEASONS}${query}`);
  }

  /**
   * Get team squads or player's teams
   */
  async getSquads(
    params: SquadsParams,
  ): Promise<ApiFootballResponse<SquadResponse>> {
    const query = buildQueryString(params);
    return this.request<SquadResponse>(`${ENDPOINTS.PLAYERS_SQUADS}${query}`);
  }

  /**
   * Get top scorers for a league/season
   */
  async getTopScorers(
    params: TopScorersParams,
  ): Promise<ApiFootballResponse<PlayerResponse>> {
    const query = buildQueryString(params);
    return this.request<PlayerResponse>(
      `${ENDPOINTS.PLAYERS_TOP_SCORERS}${query}`,
    );
  }

  /**
   * Get top assists for a league/season
   */
  async getTopAssists(
    params: TopAssistsParams,
  ): Promise<ApiFootballResponse<PlayerResponse>> {
    const query = buildQueryString(params);
    return this.request<PlayerResponse>(
      `${ENDPOINTS.PLAYERS_TOP_ASSISTS}${query}`,
    );
  }

  /**
   * Get top cards (most carded players) for a league/season
   */
  async getTopCards(
    params: TopCardsParams,
  ): Promise<ApiFootballResponse<PlayerResponse>> {
    const query = buildQueryString(params);
    return this.request<PlayerResponse>(
      `${ENDPOINTS.PLAYERS_TOP_CARDS}${query}`,
    );
  }

  // ============================================================================
  // Transfers Endpoints
  // ============================================================================

  /**
   * Get player transfers
   */
  async getTransfers(
    params: TransfersParams,
  ): Promise<ApiFootballResponse<TransferResponse>> {
    const query = buildQueryString(params);
    return this.request<TransferResponse>(`${ENDPOINTS.TRANSFERS}${query}`);
  }

  // ============================================================================
  // Trophies Endpoints
  // ============================================================================

  /**
   * Get trophies for a player or coach
   */
  async getTrophies(
    params: TrophiesParams,
  ): Promise<ApiFootballResponse<Trophy>> {
    const query = buildQueryString(params);
    return this.request<Trophy>(`${ENDPOINTS.TROPHIES}${query}`);
  }

  // ============================================================================
  // Sidelined Endpoints
  // ============================================================================

  /**
   * Get sidelined players (injured/suspended)
   */
  async getSidelined(
    params: SidelinedParams,
  ): Promise<ApiFootballResponse<Sidelined>> {
    const query = buildQueryString(params);
    return this.request<Sidelined>(`${ENDPOINTS.SIDELINED}${query}`);
  }

  // ============================================================================
  // Coachs Endpoints
  // ============================================================================

  /**
   * Get coach information
   */
  async getCoachs(params: CoachsParams): Promise<ApiFootballResponse<Coach>> {
    const query = buildQueryString(params);
    return this.request<Coach>(`${ENDPOINTS.COACHS}${query}`);
  }

  // ============================================================================
  // Injuries Endpoints
  // ============================================================================

  /**
   * Get injuries
   */
  async getInjuries(
    params: InjuriesParams,
  ): Promise<ApiFootballResponse<Injury>> {
    const query = buildQueryString(params);
    return this.request<Injury>(`${ENDPOINTS.INJURIES}${query}`);
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
