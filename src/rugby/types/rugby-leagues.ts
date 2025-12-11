/**
 * @module rugby/types/rugby-leagues
 * @description League-related types for API-Rugby
 */

import type { RugbyCountry } from "./rugby-common";

/**
 * League information
 */
export interface RugbyLeague {
  id: number;
  name: string;
  type: string;
  logo: string | null;
}

/**
 * Season information within a league
 */
export interface RugbySeason {
  season: number | string;
  start: string;
  end: string;
}

/**
 * League response with country and seasons
 */
export interface RugbyLeagueResponse {
  league: RugbyLeague;
  country: RugbyCountry;
  seasons: RugbySeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface RugbyLeaguesParams {
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
  season?: number | string;
  /** Search by name (minimum 3 characters) */
  search?: string;
}
