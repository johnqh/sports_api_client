/**
 * Types for Standings endpoint
 */

import type { Optional } from "@sudobility/types";

/**
 * Standings response wrapper
 */
export interface FootballStandingsResponse {
  /** League information */
  league: FootballStandingsLeague;
}

/**
 * League with standings
 */
export interface FootballStandingsLeague {
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
  standings: FootballStanding[][];
}

/**
 * Individual team standing
 */
export interface FootballStanding {
  /** Position/Rank */
  rank: number;
  /** Team information */
  team: FootballStandingTeam;
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
  all: FootballStandingStats;
  /** Home matches statistics */
  home: FootballStandingStats;
  /** Away matches statistics */
  away: FootballStandingStats;
  /** Last update timestamp */
  update: string;
}

/**
 * Team info in standing context
 */
export interface FootballStandingTeam {
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
export interface FootballStandingStats {
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
export interface FootballStandingsParams {
  /** League ID (required) */
  league: number;
  /** Season year (required) */
  season: number;
  /** Filter by team ID */
  team?: Optional<number>;
}
