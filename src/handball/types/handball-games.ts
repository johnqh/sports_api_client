/**
 * @module handball/types/handball-games
 * @description Game types for API-Handball
 */

import type { HandballLeague, HandballLeagueCountry } from "./handball-leagues";

/**
 * Game status
 */
export interface HandballGameStatus {
  long: string;
  short: string;
}

/**
 * Game period scores
 */
export interface HandballPeriodScores {
  first: number | null;
  second: number | null;
  overtime: number | null;
}

/**
 * Team in a game
 */
export interface HandballGameTeam {
  id: number;
  name: string;
  logo: string | null;
}

/**
 * Game scores
 */
export interface HandballGameScores {
  home: HandballPeriodScores;
  away: HandballPeriodScores;
}

/**
 * Handball game
 */
export interface HandballGame {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  week: string | null;
  status: HandballGameStatus;
  league: HandballLeague;
  country: HandballLeagueCountry;
  teams: {
    home: HandballGameTeam;
    away: HandballGameTeam;
  };
  scores: HandballGameScores;
}

/**
 * Parameters for games endpoint
 */
export interface HandballGamesParams {
  id?: number;
  date?: string;
  league?: number;
  season?: number;
  team?: number;
  timezone?: string;
  status?: string;
}

/**
 * Parameters for head-to-head endpoint
 */
export interface HandballH2HParams {
  h2h: string;
  league?: number;
  season?: number;
}
