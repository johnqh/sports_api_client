/**
 * Types for Basketball Games endpoints
 */

import type { Optional } from "@sudobility/types";

/**
 * Basketball game status
 */
export interface BasketballGameStatus {
  /** Long status description */
  long: string;
  /** Short status code */
  short: string;
  /** Timer/elapsed time */
  timer: Optional<string>;
}

/**
 * Basketball game scores
 */
export interface BasketballScores {
  /** Home team scores */
  home: {
    quarter_1: Optional<number>;
    quarter_2: Optional<number>;
    quarter_3: Optional<number>;
    quarter_4: Optional<number>;
    over_time: Optional<number>;
    total: Optional<number>;
  };
  /** Away team scores */
  away: {
    quarter_1: Optional<number>;
    quarter_2: Optional<number>;
    quarter_3: Optional<number>;
    quarter_4: Optional<number>;
    over_time: Optional<number>;
    total: Optional<number>;
  };
}

/**
 * Basketball game response
 */
export interface BasketballGame {
  /** Game ID */
  id: number;
  /** Game date */
  date: string;
  /** Game time */
  time: string;
  /** Game timestamp */
  timestamp: number;
  /** Timezone */
  timezone: string;
  /** Game stage */
  stage: Optional<string>;
  /** Game week */
  week: Optional<string>;
  /** Game status */
  status: BasketballGameStatus;
  /** League information */
  league: {
    id: number;
    name: string;
    type: string;
    season: string;
    logo: Optional<string>;
  };
  /** Country information */
  country: {
    id: number;
    name: string;
    code: Optional<string>;
    flag: Optional<string>;
  };
  /** Teams information */
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
  /** Game scores */
  scores: BasketballScores;
}

/**
 * Parameters for games endpoint
 */
export interface BasketballGamesParams {
  /** Filter by game ID */
  id?: Optional<number>;
  /** Filter by date (YYYY-MM-DD) */
  date?: Optional<string>;
  /** Filter by league ID */
  league?: Optional<number>;
  /** Filter by season */
  season?: Optional<string>;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Filter by timezone */
  timezone?: Optional<string>;
  /** Get live games */
  live?: Optional<string>;
  /** Filter from date (YYYY-MM-DD) */
  from?: Optional<string>;
  /** Filter to date (YYYY-MM-DD) */
  to?: Optional<string>;
}

/**
 * Head to head parameters
 */
export interface BasketballHeadToHeadParams {
  /** First team ID (format: "teamId1-teamId2") */
  h2h: string;
  /** Filter by league ID */
  league?: Optional<number>;
  /** Filter by season */
  season?: Optional<string>;
  /** Filter by timezone */
  timezone?: Optional<string>;
}
