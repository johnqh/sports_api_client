/**
 * @module baseball/types/baseball-leagues
 * @description League-related types for API-Baseball
 */

import type { BaseballCountry } from "./baseball-common";

/**
 * League information
 */
export interface BaseballLeague {
  id: number;
  name: string;
  type: string;
  logo: string | null;
}

/**
 * Season information within a league
 */
export interface BaseballSeason {
  season: number;
  start: string;
  end: string;
}

/**
 * League response with country and seasons
 */
export interface BaseballLeagueResponse {
  league: BaseballLeague;
  country: BaseballCountry;
  seasons: BaseballSeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface BaseballLeaguesParams {
  /** Filter by league ID */
  id?: number;
  /** Filter by league name */
  name?: string;
  /**
   * Filter by country name (NOT country code).
   * Use full country name like "Japan", not "JP".
   * Get valid names from the /countries endpoint.
   */
  country?: string;
  /** Filter by country ID */
  country_id?: number;
  /** Filter by league type */
  type?: string;
  /** Filter by season (free tier: 2021-2023 only) */
  season?: number;
  /** Search by name (minimum 3 characters) */
  search?: string;
}
