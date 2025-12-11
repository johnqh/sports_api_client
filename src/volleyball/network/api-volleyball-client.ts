/**
 * @module api-volleyball-client
 * @description API-Volleyball Client Library
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
import { buildQueryString } from "../../utils/query-params";
import {
  VOLLEYBALL_API_BASE_URL,
  VOLLEYBALL_DEFAULT_HEADERS,
  VOLLEYBALL_ENDPOINTS,
  VOLLEYBALL_RAPIDAPI_HOST,
} from "./volleyball-endpoints";

/**
 * API-Volleyball Client class
 */
export class ApiVolleyballClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

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
      throw new Error("No data received from API-Volleyball");
    }

    const data = response.data as ApiVolleyballResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new Error(`API-Volleyball error: ${errorMsg}`);
    }

    return data;
  }

  /**
   * Get available timezones
   */
  async getTimezones(): Promise<ApiVolleyballResponse<VolleyballTimezone>> {
    return this.request<VolleyballTimezone>(VOLLEYBALL_ENDPOINTS.TIMEZONE);
  }

  /**
   * Get countries
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
   * Get seasons
   */
  async getSeasons(
    params?: VolleyballSeasonsParams,
  ): Promise<ApiVolleyballResponse<VolleyballSeason>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<VolleyballSeason>(
      `${VOLLEYBALL_ENDPOINTS.SEASONS}${query}`,
    );
  }

  /**
   * Get leagues
   */
  async getLeagues(
    params?: VolleyballLeaguesParams,
  ): Promise<ApiVolleyballResponse<VolleyballLeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<VolleyballLeagueResponse>(
      `${VOLLEYBALL_ENDPOINTS.LEAGUES}${query}`,
    );
  }

  /**
   * Get teams
   */
  async getTeams(
    params?: VolleyballTeamsParams,
  ): Promise<ApiVolleyballResponse<VolleyballTeamResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<VolleyballTeamResponse>(
      `${VOLLEYBALL_ENDPOINTS.TEAMS}${query}`,
    );
  }

  /**
   * Get standings
   */
  async getStandings(
    params: VolleyballStandingsParams,
  ): Promise<ApiVolleyballResponse<VolleyballStandingsResponse>> {
    const query = buildQueryString(params);
    return this.request<VolleyballStandingsResponse>(
      `${VOLLEYBALL_ENDPOINTS.STANDINGS}${query}`,
    );
  }

  /**
   * Get games
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
   * Get head-to-head
   */
  async getH2H(
    params: VolleyballH2HParams,
  ): Promise<ApiVolleyballResponse<VolleyballGame>> {
    const query = buildQueryString(params);
    return this.request<VolleyballGame>(`${VOLLEYBALL_ENDPOINTS.H2H}${query}`);
  }
}

/**
 * Create a new API-Volleyball client
 */
export function createApiVolleyballClient(
  networkClient: NetworkClient,
  config: ApiVolleyballConfig,
): ApiVolleyballClient {
  return new ApiVolleyballClient(networkClient, config);
}
