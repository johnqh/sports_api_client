/**
 * @module formula1/types/f1-rankings
 * @description Rankings types for API-Formula-1
 */

import type { F1Driver } from "./f1-drivers";
import type { F1Team } from "./f1-teams";

/**
 * Driver ranking entry
 */
export interface F1DriverRanking {
  position: number;
  driver: F1Driver;
  team: F1Team;
  points: number;
  wins: number;
  behind: number | null;
  season: number;
}

/**
 * Team ranking entry
 */
export interface F1TeamRanking {
  position: number;
  team: F1Team;
  points: number;
  season: number;
}

/**
 * Parameters for driver rankings endpoint
 */
export interface F1DriverRankingsParams {
  season: number;
  driver?: number;
  team?: number;
}

/**
 * Parameters for team rankings endpoint
 */
export interface F1TeamRankingsParams {
  season: number;
  team?: number;
}
