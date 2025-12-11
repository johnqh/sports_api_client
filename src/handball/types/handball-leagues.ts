/**
 * @module handball/types/handball-leagues
 * @description League types for API-Handball
 */

/**
 * Handball league information
 */
export interface HandballLeague {
  id: number;
  name: string;
  type: string;
  logo: string | null;
}

/**
 * Handball league country
 */
export interface HandballLeagueCountry {
  id: number;
  name: string;
  code: string | null;
  flag: string | null;
}

/**
 * Handball league season
 */
export interface HandballLeagueSeason {
  season: number;
  start: string;
  end: string;
  current: boolean;
}

/**
 * Full league response.
 * Note: Handball API returns flat structure (not nested under `league`).
 */
export interface HandballLeagueResponse {
  /** League ID */
  id: number;
  /** League name */
  name: string;
  /** League type */
  type: string;
  /** League logo URL */
  logo: string | null;
  /** Country information */
  country: HandballLeagueCountry;
  /** Available seasons */
  seasons: HandballLeagueSeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface HandballLeaguesParams {
  /** Filter by league ID */
  id?: number;
  /** Filter by league name */
  name?: string;
  /** Filter by country ID */
  country_id?: number;
  /**
   * Filter by country name (NOT country code).
   * Use full country name like "Japan", not "JP".
   * Get valid names from the /countries endpoint.
   */
  country?: string;
  /** Filter by league type */
  type?: string;
  /** Filter by season (free tier: 2021-2023 only) */
  season?: number;
  /** Search by name (minimum 3 characters) */
  search?: string;
}
