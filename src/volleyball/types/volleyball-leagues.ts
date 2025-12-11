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
  year: number;
  start: string;
  end: string;
}

/**
 * Full league response
 */
export interface VolleyballLeagueResponse {
  league: VolleyballLeague;
  country: VolleyballLeagueCountry;
  seasons: VolleyballLeagueSeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface VolleyballLeaguesParams {
  id?: number;
  name?: string;
  country_id?: number;
  country?: string;
  type?: string;
  season?: number;
  search?: string;
}
