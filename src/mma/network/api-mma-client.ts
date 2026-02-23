/**
 * @module api-mma-client
 * @description API-MMA Client Library
 *
 * A TypeScript client for the API-MMA API that provides type-safe
 * access to MMA data including categories, fighters, fights, and more.
 * Note: MMA API does NOT have a /leagues endpoint; it uses categories instead.
 *
 * Uses dependency injection for network requests, making it compatible with
 * both React (web) and React Native applications.
 *
 * @example
 * ```typescript
 * import { ApiMmaClient } from "@sudobility/sports_api_client";
 *
 * const client = new ApiMmaClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const fighters = await client.getFighters({ search: "mcgregor" });
 * ```
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
  MmaSeasonsParams,
  MmaTimezone,
} from "../types";
import {
  ApiSportsError,
  ApiSportsErrorType,
  classifyApiError,
} from "../../common/api-sports-error";
import { buildQueryString } from "../../utils/query-params";
import {
  MMA_API_BASE_URL,
  MMA_DEFAULT_HEADERS,
  MMA_ENDPOINTS,
  MMA_RAPIDAPI_HOST,
} from "./mma-endpoints";

/**
 * API-MMA Client class
 *
 * Provides type-safe methods for all API-MMA endpoints including
 * categories, fighters, fights, countries, and seasons.
 * Uses NetworkClient from @sudobility/di for network requests, enabling
 * cross-platform compatibility between React and React Native.
 *
 * @class ApiMmaClient
 *
 * @example
 * ```typescript
 * const client = new ApiMmaClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 *
 * const categories = await client.getCategories();
 * const fighters = await client.getFighters({ search: "mcgregor" });
 * ```
 */
export class ApiMmaClient {
  private baseUrl: string;
  private networkClient: NetworkClient;
  private headers: Record<string, string>;

  /**
   * Create a new ApiMmaClient instance
   *
   * @param networkClient - NetworkClient instance for making HTTP requests
   * @param config - API configuration including API key
   */
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

  /**
   * Make a GET request to the API
   *
   * @template T - The expected response data type
   * @param endpoint - The API endpoint path with query string
   * @returns Promise resolving to the typed API response
   * @throws {ApiSportsError} When no data is received or API returns errors
   */
  private async request<T>(endpoint: string): Promise<ApiMmaResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.networkClient.get<ApiMmaResponse<T>>(url, {
      headers: this.headers,
    });

    if (response.data === undefined || response.data === null) {
      throw new ApiSportsError(
        "No data received from API-MMA",
        "MMA",
        ApiSportsErrorType.NO_DATA,
      );
    }

    const data = response.data as ApiMmaResponse<T>;
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      throw new ApiSportsError(
        `API-MMA error: ${errorMsg}`,
        "MMA",
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
  async getTimezone(): Promise<ApiMmaResponse<MmaTimezone>> {
    return this.request<MmaTimezone>(MMA_ENDPOINTS.TIMEZONE);
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
    params?: MmaCountriesParams,
  ): Promise<ApiMmaResponse<MmaCountry>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<MmaCountry>(`${MMA_ENDPOINTS.COUNTRIES}${query}`);
  }

  /**
   * Get all available MMA seasons
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
  async getSeasons(params?: MmaSeasonsParams): Promise<ApiMmaResponse<number>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<number>(`${MMA_ENDPOINTS.SEASONS}${query}`);
  }

  // Note: MMA API does NOT have a /leagues endpoint

  // ============================================================================
  // Categories Endpoints
  // ============================================================================

  /**
   * Get MMA categories (weight classes / divisions)
   *
   * Unlike other sports that use leagues, MMA organizes events by categories.
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by category ID
   * @param params.name - Filter by category name
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of Category objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const categories = await client.getCategories();
   * ```
   */
  async getCategories(
    params?: MmaCategoriesParams,
  ): Promise<ApiMmaResponse<MmaCategory>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<MmaCategory>(`${MMA_ENDPOINTS.CATEGORIES}${query}`);
  }

  // ============================================================================
  // Fighters Endpoints
  // ============================================================================

  /**
   * Get MMA fighters with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by fighter ID
   * @param params.name - Filter by fighter name
   * @param params.category - Filter by category ID
   * @param params.search - Search by partial name (min 3 characters)
   * @returns Promise resolving to array of Fighter objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const fighters = await client.getFighters({ search: "mcgregor" });
   * ```
   */
  async getFighters(
    params?: MmaFightersParams,
  ): Promise<ApiMmaResponse<MmaFighter>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<MmaFighter>(`${MMA_ENDPOINTS.FIGHTERS}${query}`);
  }

  // ============================================================================
  // Fights Endpoints
  // ============================================================================

  /**
   * Get MMA fights with optional filtering
   *
   * @param params - Optional filter parameters
   * @param params.id - Filter by fight ID
   * @param params.category - Filter by category ID
   * @param params.season - Filter by season year
   * @param params.date - Filter by date (YYYY-MM-DD)
   * @param params.fighter - Filter by fighter ID
   * @returns Promise resolving to array of Fight objects
   * @throws {ApiSportsError} If API returns an error or no data
   *
   * @example
   * ```typescript
   * const fights = await client.getFights({ date: "2024-01-15" });
   * ```
   */
  async getFights(params?: MmaFightsParams): Promise<ApiMmaResponse<MmaFight>> {
    const query = params ? buildQueryString(params) : "";
    return this.request<MmaFight>(`${MMA_ENDPOINTS.FIGHTS}${query}`);
  }
}

/**
 * Factory function to create an ApiMmaClient instance
 *
 * @param networkClient - NetworkClient instance for making HTTP requests
 * @param config - API configuration including API key
 * @returns New ApiMmaClient instance
 *
 * @example
 * ```typescript
 * const client = createApiMmaClient(networkClient, {
 *   apiKey: "YOUR_API_KEY",
 * });
 * ```
 */
export const createApiMmaClient = (
  networkClient: NetworkClient,
  config: ApiMmaConfig,
): ApiMmaClient => {
  return new ApiMmaClient(networkClient, config);
};
