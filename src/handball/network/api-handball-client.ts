/**
 * @module api-handball-client
 * @description API-Handball Client Library
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
import { buildQueryString } from "../../utils/query-params";
import {
  HANDBALL_API_BASE_URL,
  HANDBALL_DEFAULT_HEADERS,
  HANDBALL_ENDPOINTS,
  HANDBALL_RAPIDAPI_HOST,
} from "./handball-endpoints";

/**
 * API-Handball Client class
 */
export class ApiHandballClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

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
   */
  private async request<T>(endpoint: string): Promise<ApiHandballResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await this.networkClient.get<ApiHandballResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new Error("No data received from API-Handball");
    }

    const data = response.data as ApiHandballResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new Error(`API-Handball error: ${errorMsg}`);
    }

    return data;
  }

  /**
   * Get available timezones
   */
  async getTimezones(): Promise<ApiHandballResponse<HandballTimezone>> {
    return this.request<HandballTimezone>(HANDBALL_ENDPOINTS.TIMEZONE);
  }

  /**
   * Get countries
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
   * Get seasons
   */
  async getSeasons(
    params?: HandballSeasonsParams,
  ): Promise<ApiHandballResponse<HandballSeason>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HandballSeason>(
      `${HANDBALL_ENDPOINTS.SEASONS}${query}`,
    );
  }

  /**
   * Get leagues
   */
  async getLeagues(
    params?: HandballLeaguesParams,
  ): Promise<ApiHandballResponse<HandballLeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HandballLeagueResponse>(
      `${HANDBALL_ENDPOINTS.LEAGUES}${query}`,
    );
  }

  /**
   * Get teams
   */
  async getTeams(
    params?: HandballTeamsParams,
  ): Promise<ApiHandballResponse<HandballTeamResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HandballTeamResponse>(
      `${HANDBALL_ENDPOINTS.TEAMS}${query}`,
    );
  }

  /**
   * Get standings
   */
  async getStandings(
    params: HandballStandingsParams,
  ): Promise<ApiHandballResponse<HandballStandingsResponse>> {
    const query = buildQueryString(params);
    return this.request<HandballStandingsResponse>(
      `${HANDBALL_ENDPOINTS.STANDINGS}${query}`,
    );
  }

  /**
   * Get games
   */
  async getGames(
    params?: HandballGamesParams,
  ): Promise<ApiHandballResponse<HandballGame>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<HandballGame>(`${HANDBALL_ENDPOINTS.GAMES}${query}`);
  }

  /**
   * Get head-to-head
   */
  async getH2H(
    params: HandballH2HParams,
  ): Promise<ApiHandballResponse<HandballGame>> {
    const query = buildQueryString(params);
    return this.request<HandballGame>(`${HANDBALL_ENDPOINTS.H2H}${query}`);
  }

  /**
   * Get odds
   */
  async getOdds(
    params: HandballOddsParams,
  ): Promise<ApiHandballResponse<HandballOdds>> {
    const query = buildQueryString(params);
    return this.request<HandballOdds>(`${HANDBALL_ENDPOINTS.ODDS}${query}`);
  }
}

/**
 * Create a new API-Handball client
 */
export function createApiHandballClient(
  networkClient: NetworkClient,
  config: ApiHandballConfig,
): ApiHandballClient {
  return new ApiHandballClient(networkClient, config);
}
