/**
 * @module common/base-types
 * @description Shared base types for all api-sports.io API clients
 *
 * All api-sports.io APIs (football, basketball, hockey, etc.) share the same
 * response structure. This module provides the base types that can be extended
 * by sport-specific implementations.
 */

import type { Optional } from "@sudobility/types";

/**
 * Base response wrapper for all api-sports.io API endpoints
 *
 * All sport APIs return responses in this format. Sport-specific clients
 * can use this directly or extend it with additional fields.
 *
 * @template T - The type of data in the response array
 *
 * @example
 * ```typescript
 * // Use directly
 * type LeaguesResponse = BaseApiResponse<League>;
 *
 * // Or extend for sport-specific needs
 * interface ApiFootballResponse<T> extends BaseApiResponse<T> {
 *   paging: ApiFootballPaging;
 * }
 * ```
 */
export interface BaseApiResponse<T> {
  /** The endpoint that was called */
  get: string;
  /** Parameters that were passed to the endpoint */
  parameters: Record<string, string>;
  /** Array of error messages or error object */
  errors: string[] | Record<string, string>;
  /** Number of results returned */
  results: number;
  /** Array of response data */
  response: T[];
}

/**
 * Base pagination information
 *
 * Some sport APIs include pagination in responses.
 */
export interface BaseApiPaging {
  /** Current page number */
  current: number;
  /** Total number of pages */
  total: number;
}

/**
 * Base configuration for all api-sports.io API clients
 *
 * All sport clients use the same authentication pattern, supporting both
 * direct API access and RapidAPI marketplace access.
 *
 * @example
 * ```typescript
 * // Direct API authentication
 * const config: BaseApiConfig = {
 *   apiKey: "YOUR_API_KEY",
 * };
 *
 * // RapidAPI authentication
 * const rapidConfig: BaseApiConfig = {
 *   apiKey: "YOUR_RAPIDAPI_KEY",
 *   useRapidApi: true,
 *   rapidApiHost: "api-basketball-v1.p.rapidapi.com",
 * };
 * ```
 */
export interface BaseApiConfig {
  /** Base URL for the API (each sport has its own default) */
  baseUrl?: Optional<string>;
  /** API key from api-sports.io dashboard or RapidAPI */
  apiKey: string;
  /** RapidAPI host for RapidAPI usage */
  rapidApiHost?: Optional<string>;
  /** Use RapidAPI authentication instead of direct API */
  useRapidApi?: Optional<boolean>;
}

/**
 * Default HTTP headers for all api-sports.io requests
 */
export const BASE_DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
