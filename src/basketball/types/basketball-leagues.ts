/**
 * Types for Basketball Leagues and Seasons endpoints
 */

import type { Optional } from "@sudobility/types";
import type { BasketballCountry } from "./basketball-common";

/**
 * Basketball league information
 */
export interface BasketballLeague {
  /** League ID */
  id: number;
  /** League name */
  name: string;
  /** Type of competition */
  type: string;
  /** URL to league logo */
  logo: Optional<string>;
}

/**
 * Basketball season information
 */
export interface BasketballSeason {
  /** Season identifier (e.g., "2023-2024") */
  season: string;
  /** Season start date (YYYY-MM-DD) */
  start: string;
  /** Season end date (YYYY-MM-DD) */
  end: string;
}

/**
 * Complete league response including country and seasons.
 * Note: Basketball API returns flat structure (not nested under `league`).
 */
export interface BasketballLeagueResponse {
  /** League ID */
  id: number;
  /** League name */
  name: string;
  /** Type of competition */
  type: string;
  /** URL to league logo */
  logo: Optional<string>;
  /** Country information */
  country: BasketballCountry;
  /** Available seasons */
  seasons: BasketballSeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface BasketballLeaguesParams {
  /** Filter by league ID */
  id?: Optional<number>;
  /** Filter by league name */
  name?: Optional<string>;
  /**
   * Filter by country name (NOT country code).
   * Use full country name like "Japan", not "JP".
   * Get valid names from the /countries endpoint.
   * Note: The `code` parameter does NOT work for Basketball API.
   */
  country?: Optional<string>;
  /** Filter by season (free tier: 2021-2023 only) */
  season?: Optional<string>;
  /** Filter by league type */
  type?: Optional<string>;
  /** Get current leagues only */
  current?: Optional<boolean>;
  /** Search by partial name (min 3 characters) */
  search?: Optional<string>;
}

/**
 * Parameters for seasons endpoint
 */
export interface BasketballSeasonsParams {
  /** Filter by league ID */
  league?: Optional<number>;
}
