/**
 * @module baseball/types/baseball-games
 * @description Game-related types for API-Baseball
 */

import type { BaseballCountry } from "./baseball-common";
import type { BaseballLeague } from "./baseball-leagues";
import type { BaseballTeam } from "./baseball-teams";

/**
 * Game status
 */
export interface BaseballGameStatus {
  long: string;
  short: string;
}

/**
 * Baseball scores by innings
 */
export interface BaseballScores {
  home: {
    hits: number | null;
    errors: number | null;
    innings: Record<string, number | null>;
    total: number | null;
  };
  away: {
    hits: number | null;
    errors: number | null;
    innings: Record<string, number | null>;
    total: number | null;
  };
}

/**
 * Game information
 */
export interface BaseballGame {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  week: string | null;
  status: BaseballGameStatus;
  country: BaseballCountry;
  league: BaseballLeague;
  teams: {
    home: BaseballTeam;
    away: BaseballTeam;
  };
  scores: BaseballScores;
}

/**
 * Parameters for games endpoint
 */
export interface BaseballGamesParams {
  id?: number;
  date?: string;
  league?: number;
  season?: number;
  team?: number;
  timezone?: string;
  h2h?: string;
}

/**
 * Parameters for head-to-head games
 */
export interface BaseballHeadToHeadParams {
  h2h: string;
  league?: number;
  season?: number;
}
