/**
 * @module volleyball/types/volleyball-leagues
 * @description League types for API-Volleyball
 */

/**
 * Volleyball league information
 */
export interface VolleyballLeague {
  id: number;
  name: string;
  type: string;
  logo: string | null;
}

/**
 * Volleyball league country
 */
export interface VolleyballLeagueCountry {
  id: number;
  name: string;
  code: string | null;
  flag: string | null;
}

/**
 * Volleyball league season
 */
export interface VolleyballLeagueSeason {
  season: number;
  start: string;
  end: string;
  current: boolean;
}

/**
 * Full league response.
 * Note: Volleyball API returns flat structure (not nested under `league`).
 */
export interface VolleyballLeagueResponse {
  /** League ID */
  id: number;
  /** League name */
  name: string;
  /** League type */
  type: string;
  /** League logo URL */
  logo: string | null;
  /** Country information */
  country: VolleyballLeagueCountry;
  /** Available seasons */
  seasons: VolleyballLeagueSeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface VolleyballLeaguesParams {
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
