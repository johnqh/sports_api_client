/**
 * @module handball/types/handball-teams
 * @description Team types for API-Handball
 */

/**
 * Handball team
 */
export interface HandballTeam {
  id: number;
  name: string;
  logo: string | null;
  national: boolean;
}

/**
 * Handball team country
 */
export interface HandballTeamCountry {
  id: number;
  name: string;
  code: string | null;
  flag: string | null;
}

/**
 * Handball team response
 */
export interface HandballTeamResponse {
  team: HandballTeam;
  country: HandballTeamCountry;
}

/**
 * Parameters for teams endpoint
 */
export interface HandballTeamsParams {
  id?: number;
  name?: string;
  country_id?: number;
  country?: string;
  league?: number;
  season?: number;
  search?: string;
}
