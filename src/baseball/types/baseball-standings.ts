/**
 * @module baseball/types/baseball-standings
 * @description Standings types for API-Baseball
 */

import type { BaseballCountry } from "./baseball-common";
import type { BaseballLeague } from "./baseball-leagues";
import type { BaseballTeam } from "./baseball-teams";

/**
 * Standing entry
 */
export interface BaseballStanding {
  position: number;
  stage: string;
  group: {
    name: string;
  };
  team: BaseballTeam;
  league: BaseballLeague;
  country: BaseballCountry;
  games: {
    played: number;
    win: {
      total: number;
      percentage: string;
    };
    lose: {
      total: number;
      percentage: string;
    };
  };
  points: {
    for: number;
    against: number;
  };
  form: string | null;
  description: string | null;
}

/**
 * Parameters for standings endpoint
 */
export interface BaseballStandingsParams {
  league: number;
  season: number;
  team?: number;
  group?: string;
  stage?: string;
}
