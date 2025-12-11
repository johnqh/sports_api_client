/**
 * @module rugby/types/rugby-games
 * @description Game-related types for API-Rugby
 */

import type { RugbyCountry } from "./rugby-common";
import type { RugbyLeague } from "./rugby-leagues";
import type { RugbyTeam } from "./rugby-teams";

/**
 * Game status
 */
export interface RugbyGameStatus {
  long: string;
  short: string;
}

/**
 * Rugby scores by half
 */
export interface RugbyScores {
  home: {
    half_1: number | null;
    half_2: number | null;
    extra_time: number | null;
    total: number | null;
  };
  away: {
    half_1: number | null;
    half_2: number | null;
    extra_time: number | null;
    total: number | null;
  };
}

/**
 * Game information
 */
export interface RugbyGame {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  week: string | null;
  status: RugbyGameStatus;
  country: RugbyCountry;
  league: RugbyLeague;
  teams: {
    home: RugbyTeam;
    away: RugbyTeam;
  };
  scores: RugbyScores;
}

/**
 * Parameters for games endpoint
 */
export interface RugbyGamesParams {
  id?: number;
  date?: string;
  league?: number;
  season?: number | string;
  team?: number;
  timezone?: string;
  h2h?: string;
}

/**
 * Parameters for head-to-head games
 */
export interface RugbyHeadToHeadParams {
  h2h: string;
  league?: number;
  season?: number | string;
}
