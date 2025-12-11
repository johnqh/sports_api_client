/**
 * @module api-mma-client
 * @description API-MMA Client Library
 */

import type { NetworkClient } from "@sudobility/types";
import type {
  ApiMmaConfig,
  ApiMmaResponse,
  MmaCategoriesParams,
  MmaCategory,
  MmaCountriesParams,
  MmaCountry,
  MmaFight,
  MmaFighter,
  MmaFightersParams,
  MmaFightsParams,
  MmaLeagueResponse,
  MmaLeaguesParams,
  MmaSeasonsParams,
  MmaTimezone,
} from "../types";
import { buildQueryString } from "../../utils/query-params";
import {
  MMA_API_BASE_URL,
  MMA_DEFAULT_HEADERS,
  MMA_ENDPOINTS,
  MMA_RAPIDAPI_HOST,
} from "./mma-endpoints";

/**
 * API-MMA Client class
 */
export class ApiMmaClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

  constructor(networkClient: NetworkClient, config: ApiMmaConfig) {
    this.networkClient = networkClient;
    this.baseUrl = config.baseUrl || MMA_API_BASE_URL;

    if (config.useRapidApi && config.rapidApiHost) {
      this.headers = {
        ...MMA_DEFAULT_HEADERS,
        "x-rapidapi-host": config.rapidApiHost || MMA_RAPIDAPI_HOST,
        "x-rapidapi-key": config.apiKey,
      };
    } else {
      this.headers = {
        ...MMA_DEFAULT_HEADERS,
        "x-apisports-key": config.apiKey,
      };
    }
  }

  private async request<T>(endpoint: string): Promise<ApiMmaResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.networkClient.get<ApiMmaResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new Error("No data received from API-MMA");
    }

    const data = response.data as ApiMmaResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new Error(`API-MMA error: ${errorMsg}`);
    }

    return data;
  }

  async getTimezone(): Promise<ApiMmaResponse<MmaTimezone>> {
    return this.request<MmaTimezone>(MMA_ENDPOINTS.TIMEZONE);
  }

  async getCountries(
    params?: MmaCountriesParams,
  ): Promise<ApiMmaResponse<MmaCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<MmaCountry>(`${MMA_ENDPOINTS.COUNTRIES}${query}`);
  }

  async getSeasons(params?: MmaSeasonsParams): Promise<ApiMmaResponse<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(`${MMA_ENDPOINTS.SEASONS}${query}`);
  }

  async getLeagues(
    params?: MmaLeaguesParams,
  ): Promise<ApiMmaResponse<MmaLeagueResponse>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<MmaLeagueResponse>(`${MMA_ENDPOINTS.LEAGUES}${query}`);
  }

  async getCategories(
    params?: MmaCategoriesParams,
  ): Promise<ApiMmaResponse<MmaCategory>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<MmaCategory>(`${MMA_ENDPOINTS.CATEGORIES}${query}`);
  }

  async getFighters(
    params?: MmaFightersParams,
  ): Promise<ApiMmaResponse<MmaFighter>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<MmaFighter>(`${MMA_ENDPOINTS.FIGHTERS}${query}`);
  }

  async getFights(params?: MmaFightsParams): Promise<ApiMmaResponse<MmaFight>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<MmaFight>(`${MMA_ENDPOINTS.FIGHTS}${query}`);
  }
}

export const createApiMmaClient = (
  networkClient: NetworkClient,
  config: ApiMmaConfig,
): ApiMmaClient => {
  return new ApiMmaClient(networkClient, config);
};
