/**
 * @module volleyball/types/volleyball-teams
 * @description Team types for API-Volleyball
 */

/**
 * Volleyball team
 */
export interface VolleyballTeam {
  id: number;
  name: string;
  logo: string | null;
  national: boolean;
}

/**
 * Volleyball team country
 */
export interface VolleyballTeamCountry {
  id: number;
  name: string;
  code: string | null;
  flag: string | null;
}

/**
 * Volleyball team response - flat structure from API
 * API returns: { id, name, logo, national, country: {...} }
 */
export interface VolleyballTeamResponse {
  id: number;
  name: string;
  logo: string | null;
  national: boolean;
  country: VolleyballTeamCountry;
}

/**
 * Parameters for teams endpoint
 */
export interface VolleyballTeamsParams {
  id?: number;
  name?: string;
  country_id?: number;
  country?: string;
  league?: number;
  season?: number;
  search?: string;
}
