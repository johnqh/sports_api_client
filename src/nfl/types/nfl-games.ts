/**
 * Types for NFL Games
 */

import type { Optional } from "@sudobility/types";
import type { NflCountry } from "./nfl-common";

/**
 * NFL game status
 */
export interface NflGameStatus {
  /** Long status description */
  long: string;
  /** Short status code */
  short: string;
  /** Timer value if applicable */
  timer: Optional<string>;
}

/**
 * NFL quarter scores
 */
export interface NflScores {
  /** First quarter score */
  quarter_1: Optional<number>;
  /** Second quarter score */
  quarter_2: Optional<number>;
  /** Third quarter score */
  quarter_3: Optional<number>;
  /** Fourth quarter score */
  quarter_4: Optional<number>;
  /** Overtime score */
  overtime: Optional<number>;
  /** Total score */
  total: Optional<number>;
}

/**
 * NFL game
 */
export interface NflGame {
  /** Game ID */
  id: number;
  /** Game date */
  date: string;
  /** Game time */
  time: string;
  /** Unix timestamp */
  timestamp: number;
  /** Timezone */
  timezone: string;
  /** Stage (e.g., Regular Season, Playoffs) */
  stage: Optional<string>;
  /** Week number */
  week: Optional<string>;
  /** Game status */
  status: NflGameStatus;
  /** League information */
  league: {
    id: number;
    name: string;
    type: string;
    season: number;
    logo: Optional<string>;
  };
  /** Country information */
  country: NflCountry;
  /** Teams playing */
  teams: {
    home: {
      id: number;
      name: string;
      logo: Optional<string>;
    };
    away: {
      id: number;
      name: string;
      logo: Optional<string>;
    };
  };
  /** Scores */
  scores: {
    home: NflScores;
    away: NflScores;
  };
}

/**
 * Parameters for games endpoint
 */
export interface NflGamesParams {
  /** Filter by game ID */
  id?: Optional<number>;
  /** Filter by date (YYYY-MM-DD) */
  date?: Optional<string>;
  /** Filter by league ID */
  league?: Optional<number>;
  /** Filter by season */
  season?: Optional<number>;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Filter by stage */
  stage?: Optional<string>;
  /** Filter by week */
  week?: Optional<string>;
  /** Filter by timezone */
  timezone?: Optional<string>;
}

/**
 * Parameters for head to head endpoint
 */
export interface NflHeadToHeadParams {
  /** Head to head format: "team1Id-team2Id" */
  h2h: string;
  /** Filter by date (YYYY-MM-DD) */
  date?: Optional<string>;
  /** Filter by league ID */
  league?: Optional<number>;
  /** Filter by season */
  season?: Optional<number>;
  /** Filter by timezone */
  timezone?: Optional<string>;
}
