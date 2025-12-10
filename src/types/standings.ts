/**
 * Types for Standings endpoint
 */

import type { Optional } from "@sudobility/types";

/**
 * Standings response wrapper
 */
export interface StandingsResponse {
  /** League information */
  league: StandingsLeague;
}

/**
 * League with standings
 */
export interface StandingsLeague {
  /** League ID */
  id: number;
  /** League name */
  name: string;
  /** Country */
  country: string;
  /** League logo URL */
  logo: string;
  /** Country flag URL */
  flag: Optional<string>;
  /** Season year */
  season: number;
  /** Standings groups (array of arrays for multiple groups) */
  standings: Standing[][];
}

/**
 * Individual team standing
 */
export interface Standing {
  /** Position/Rank */
  rank: number;
  /** Team information */
  team: StandingTeam;
  /** Points */
  points: number;
  /** Goal difference */
  goalsDiff: number;
  /** Group name (if applicable) */
  group: string;
  /** Form string (e.g., "WWDLW") */
  form: Optional<string>;
  /** Status (promotion, relegation, etc.) */
  status: Optional<string>;
  /** Description of position */
  description: Optional<string>;
  /** All matches statistics */
  all: StandingStats;
  /** Home matches statistics */
  home: StandingStats;
  /** Away matches statistics */
  away: StandingStats;
  /** Last update timestamp */
  update: string;
}

/**
 * Team info in standing context
 */
export interface StandingTeam {
  /** Team ID */
  id: number;
  /** Team name */
  name: string;
  /** Team logo URL */
  logo: string;
}

/**
 * Standing statistics
 */
export interface StandingStats {
  /** Matches played */
  played: number;
  /** Matches won */
  win: number;
  /** Matches drawn */
  draw: number;
  /** Matches lost */
  lose: number;
  /** Goals statistics */
  goals: {
    /** Goals scored */
    for: number;
    /** Goals conceded */
    against: number;
  };
}

/**
 * Parameters for standings endpoint
 */
export interface StandingsParams {
  /** League ID (required) */
  league: number;
  /** Season year (required) */
  season: number;
  /** Filter by team ID */
  team?: Optional<number>;
}
