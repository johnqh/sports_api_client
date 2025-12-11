/**
 * Types for Hockey Leagues and Seasons
 */

import type { Optional } from "@sudobility/types";
import type { HockeyCountry } from "./hockey-common";

/**
 * Hockey league information
 */
export interface HockeyLeague {
  /** League ID */
  id: number;
  /** League name */
  name: string;
  /** League type (League, Cup, etc.) */
  type: string;
  /** League logo URL */
  logo: Optional<string>;
}

/**
 * Hockey season information
 */
export interface HockeySeason {
  /** Season year or identifier */
  season: number;
  /** Season start date */
  start: string;
  /** Season end date */
  end: string;
  /** Whether season is current */
  current: boolean;
}

/**
 * Hockey league response with country and seasons.
 * Note: Hockey API returns flat structure (not nested under `league`).
 */
export interface HockeyLeagueResponse {
  /** League ID */
  id: number;
  /** League name */
  name: string;
  /** League type (League, Cup, etc.) */
  type: string;
  /** League logo URL */
  logo: Optional<string>;
  /** Country information */
  country: HockeyCountry;
  /** Available seasons */
  seasons: HockeySeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface HockeyLeaguesParams {
  /** Filter by league ID */
  id?: Optional<number>;
  /** Filter by league name */
  name?: Optional<string>;
  /**
   * Filter by country name (NOT country code).
   * Use full country name like "Japan", not "JP".
   * Get valid names from the /countries endpoint.
   * Note: The `code` parameter does NOT work for Hockey API.
   */
  country?: Optional<string>;
  /** Filter by season (free tier: 2021-2023 only) */
  season?: Optional<number>;
  /** Filter by league type */
  type?: Optional<string>;
  /** Filter current leagues only */
  current?: Optional<boolean>;
  /** Search by name */
  search?: Optional<string>;
}

/**
 * Parameters for seasons endpoint
 */
export interface HockeySeasonsParams {
  /** Filter by league ID */
  league?: Optional<number>;
}
