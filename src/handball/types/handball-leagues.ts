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
  year: number;
  start: string;
  end: string;
}

/**
 * Full league response
 */
export interface HandballLeagueResponse {
  league: HandballLeague;
  country: HandballLeagueCountry;
  seasons: HandballLeagueSeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface HandballLeaguesParams {
  id?: number;
  name?: string;
  country_id?: number;
  country?: string;
  type?: string;
  season?: number;
  search?: string;
}
