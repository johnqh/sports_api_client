/**
 * Common types for API-Football responses
 */

import type { Optional } from "@sudobility/types";
import type {
  BaseApiConfig,
  BaseApiPaging,
  BaseApiResponse,
} from "../../common";

/**
 * Pagination information for API-Football
 *
 * Uses the base paging type - football doesn't need additional fields.
 */
export type ApiFootballPaging = BaseApiPaging;

/**
 * Configuration for API-Football client
 *
 * Uses the base config type - football doesn't need additional fields.
 */
export type ApiFootballConfig = BaseApiConfig;

/**
 * Base response wrapper for all API-Football endpoints
 *
 * Extends BaseApiResponse with football-specific paging field.
 */
export interface ApiFootballResponse<T> extends BaseApiResponse<T> {
  /** Pagination information */
  paging: ApiFootballPaging;
}

/**
 * Common image/logo type
 */
export interface FootballLogo {
  /** URL of the logo image */
  logo: string;
}

/**
 * Common birth information
 */
export interface FootballBirth {
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
export interface FootballPagingParams {
  /** Page number (default: 1) */
  page?: Optional<number>;
}

/**
 * Rate limit information from response headers
 */
export interface FootballRateLimitInfo {
  /** Requests remaining in current period */
  requestsRemaining: number;
  /** Total requests limit */
  requestsLimit: number;
}
