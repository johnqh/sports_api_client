/**
 * Common types for API-Football responses
 */

import type { Optional } from "@sudobility/types";

/**
 * Base response wrapper for all API-Football endpoints
 */
export interface ApiFootballResponse<T> {
  /** The endpoint that was called */
  get: string;
  /** Parameters that were passed to the endpoint */
  parameters: Record<string, string>;
  /** Array of error messages or error object */
  errors: string[] | Record<string, string>;
  /** Number of results returned */
  results: number;
  /** Pagination information */
  paging: ApiFootballPaging;
  /** Array of response data */
  response: T[];
}

/**
 * Pagination information
 */
export interface ApiFootballPaging {
  /** Current page number */
  current: number;
  /** Total number of pages */
  total: number;
}

/**
 * Configuration for API-Football client
 */
export interface ApiFootballConfig {
  /** Base URL for the API (default: https://v3.football.api-sports.io) */
  baseUrl?: Optional<string>;
  /** API key from API-Football dashboard */
  apiKey: string;
  /** RapidAPI host for RapidAPI usage */
  rapidApiHost?: Optional<string>;
  /** Use RapidAPI authentication instead of direct API */
  useRapidApi?: Optional<boolean>;
}

/**
 * Common image/logo type
 */
export interface Logo {
  /** URL of the logo image */
  logo: string;
}

/**
 * Common birth information
 */
export interface Birth {
  /** Date of birth (YYYY-MM-DD) */
  date: Optional<string>;
  /** Place of birth */
  place: Optional<string>;
  /** Country of birth */
  country: Optional<string>;
}

/**
 * Common paging parameters for list endpoints
 */
export interface PagingParams {
  /** Page number (default: 1) */
  page?: Optional<number>;
}

/**
 * Rate limit information from response headers
 */
export interface RateLimitInfo {
  /** Requests remaining in current period */
  requestsRemaining: number;
  /** Total requests limit */
  requestsLimit: number;
}
