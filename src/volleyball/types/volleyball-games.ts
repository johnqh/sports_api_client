/**
 * @module volleyball/types/volleyball-games
 * @description Game types for API-Volleyball
 */

import type {
  VolleyballLeague,
  VolleyballLeagueCountry,
} from "./volleyball-leagues";

/**
 * Game status
 */
export interface VolleyballGameStatus {
  long: string;
  short: string;
}

/**
 * Set scores
 */
export interface VolleyballSetScores {
  1: number | null;
  2: number | null;
  3: number | null;
  4: number | null;
  5: number | null;
}

/**
 * Team in a game
 */
export interface VolleyballGameTeam {
  id: number;
  name: string;
  logo: string | null;
}

/**
 * Game scores
 */
export interface VolleyballGameScores {
  home: VolleyballSetScores;
  away: VolleyballSetScores;
}

/**
 * Volleyball game
 */
export interface VolleyballGame {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  week: string | null;
  status: VolleyballGameStatus;
  league: VolleyballLeague;
  country: VolleyballLeagueCountry;
  teams: {
    home: VolleyballGameTeam;
    away: VolleyballGameTeam;
  };
  scores: VolleyballGameScores;
}

/**
 * Parameters for games endpoint
 */
export interface VolleyballGamesParams {
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
export interface VolleyballH2HParams {
  h2h: string;
  league?: number;
  season?: number;
}
