/**
 * @module formula1/types/f1-teams
 * @description Team (Constructor) types for API-Formula-1
 */

/**
 * Team (Constructor) information
 */
export interface F1Team {
  id: number;
  name: string;
  logo: string | null;
  base: string | null;
  first_team_entry: number | null;
  world_championships: number | null;
  highest_race_finish: {
    position: number | null;
    number: number | null;
  } | null;
  pole_positions: number | null;
  fastest_laps: number | null;
  president: string | null;
  director: string | null;
  technical_manager: string | null;
  chassis: string | null;
  engine: string | null;
  tyres: string | null;
}

/**
 * Parameters for teams endpoint
 */
export interface F1TeamsParams {
  id?: number;
  name?: string;
  search?: string;
}
