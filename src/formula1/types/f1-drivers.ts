/**
 * @module formula1/types/f1-drivers
 * @description Driver types for API-Formula-1
 */

import type { F1Team } from "./f1-teams";

/**
 * Driver information
 */
export interface F1Driver {
  id: number;
  name: string;
  abbr: string | null;
  number: number | null;
  image: string | null;
  nationality: string | null;
  country: {
    name: string | null;
    code: string | null;
  } | null;
  birthdate: string | null;
  birthplace: string | null;
  grands_prix_entered: number | null;
  world_championships: number | null;
  podiums: number | null;
  highest_race_finish: {
    position: number | null;
    number: number | null;
  } | null;
  highest_grid_position: number | null;
  career_points: string | null;
  teams: {
    season: number;
    team: F1Team;
  }[];
}

/**
 * Parameters for drivers endpoint
 */
export interface F1DriversParams {
  id?: number;
  name?: string;
  search?: string;
}
