/**
 * Types for Hockey Games
 */

import type { Optional } from "@sudobility/types";
import type { HockeyCountry } from "./hockey-common";

/**
 * Hockey game status
 */
export interface HockeyGameStatus {
  /** Long status description */
  long: string;
  /** Short status code */
  short: string;
  /** Timer value if applicable */
  timer: Optional<string>;
}

/**
 * Hockey period scores
 */
export interface HockeyScores {
  /** First period score */
  first: Optional<number>;
  /** Second period score */
  second: Optional<number>;
  /** Third period score */
  third: Optional<number>;
  /** Overtime score */
  overtime: Optional<number>;
  /** Penalty shootout score */
  penalties: Optional<number>;
  /** Total score */
  total: Optional<number>;
}

/**
 * Hockey game
 */
export interface HockeyGame {
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
  /** Week number if applicable */
  week: Optional<string>;
  /** Game status */
  status: HockeyGameStatus;
  /** League information */
  league: {
    id: number;
    name: string;
    type: string;
    season: number;
    logo: Optional<string>;
  };
  /** Country information */
  country: HockeyCountry;
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
    home: HockeyScores;
    away: HockeyScores;
  };
  /** Periods */
  periods: {
    first: Optional<string>;
    second: Optional<string>;
    third: Optional<string>;
    overtime: Optional<string>;
    penalties: Optional<string>;
  };
  /** Game events (goals, penalties, etc.) */
  events: HockeyGameEvent[];
}

/**
 * Hockey game event
 */
export interface HockeyGameEvent {
  /** Event type */
  type: string;
  /** Event time */
  time: string;
  /** Team involved */
  team: {
    id: number;
    name: string;
    logo: Optional<string>;
  };
  /** Player involved */
  player: Optional<string>;
  /** Event comment/details */
  comment: Optional<string>;
}

/**
 * Parameters for games endpoint
 */
export interface HockeyGamesParams {
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
  /** Filter by timezone */
  timezone?: Optional<string>;
}

/**
 * Parameters for head to head endpoint
 */
export interface HockeyHeadToHeadParams {
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
