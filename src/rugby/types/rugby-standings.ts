/**
 * @module rugby/types/rugby-standings
 * @description Standings types for API-Rugby
 */

import type { RugbyCountry } from "./rugby-common";
import type { RugbyLeague } from "./rugby-leagues";
import type { RugbyTeam } from "./rugby-teams";

/**
 * Standing entry
 */
export interface RugbyStanding {
  position: number;
  stage: string;
  group: {
    name: string;
  };
  team: RugbyTeam;
  league: RugbyLeague;
  country: RugbyCountry;
  games: {
    played: number;
    win: number;
    draw: number;
    lose: number;
  };
  points: {
    for: number;
    against: number;
    difference: number;
  };
  pts: number;
  form: string | null;
  description: string | null;
}

/**
 * Parameters for standings endpoint
 */
export interface RugbyStandingsParams {
  league: number;
  season: number | string;
  team?: number;
  group?: string;
  stage?: string;
}
