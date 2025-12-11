/**
 * Types for NFL Leagues and Seasons
 */

import type { Optional } from "@sudobility/types";
import type { NflCountry } from "./nfl-common";

/**
 * NFL league information
 */
export interface NflLeague {
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
 * NFL season information
 */
export interface NflSeason {
  /** Season year */
  season: number;
  /** Season start date */
  start: string;
  /** Season end date */
  end: string;
  /** Whether season is current */
  current: boolean;
}

/**
 * NFL league response with country and seasons
 */
export interface NflLeagueResponse {
  /** League information */
  league: NflLeague;
  /** Country information */
  country: NflCountry;
  /** Available seasons */
  seasons: NflSeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface NflLeaguesParams {
  /** Filter by league ID */
  id?: Optional<number>;
  /** Filter by league name */
  name?: Optional<string>;
  /**
   * Filter by country name (NOT country code).
   * Use full country name like "Japan", not "JP".
   * Get valid names from the /countries endpoint.
   */
  country?: Optional<string>;
  /** Filter by 2-letter country code (e.g., "JP", "US") */
  code?: Optional<string>;
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
export interface NflSeasonsParams {
  /** Filter by league ID */
  league?: Optional<number>;
}
