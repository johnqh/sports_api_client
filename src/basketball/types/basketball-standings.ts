/**
 * Types for Basketball Standings endpoints
 */

import type { Optional } from "@sudobility/types";

/**
 * Basketball standing entry
 */
export interface BasketballStanding {
  /** Position in standings */
  position: number;
  /** Stage/group name */
  stage: string;
  /** Group name */
  group: {
    name: string;
    points: Optional<number>;
  };
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: Optional<string>;
  };
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
  /** Games statistics */
  games: {
    played: number;
    win: number;
    lose: number;
  };
  /** Points statistics */
  points: {
    for: number;
    against: number;
  };
  /** Form (recent results) */
  form: Optional<string>;
  /** Description (e.g., "Promotion", "Relegation") */
  description: Optional<string>;
}

/**
 * Parameters for standings endpoint
 */
export interface BasketballStandingsParams {
  /** League ID (required) */
  league: number;
  /** Season (required) */
  season: string;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Filter by stage */
  stage?: Optional<string>;
  /** Filter by group */
  group?: Optional<string>;
}
