/**
 * Types for Hockey Standings
 */

import type { Optional } from "@sudobility/types";
import type { HockeyCountry } from "./hockey-common";

/**
 * Hockey standing entry
 */
export interface HockeyStanding {
  /** Position in standings */
  position: number;
  /** Stage (e.g., "Regular Season") */
  stage: string;
  /** Group information */
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
    season: number;
    logo: Optional<string>;
  };
  /** Country information */
  country: HockeyCountry;
  /** Games statistics */
  games: {
    played: number;
    win: number;
    win_overtime: Optional<number>;
    lose: number;
    lose_overtime: Optional<number>;
  };
  /** Points statistics */
  points: {
    for: number;
    against: number;
  };
  /** Form (recent results) */
  form: Optional<string>;
  /** Description (playoff position, relegation, etc.) */
  description: Optional<string>;
}

/**
 * Parameters for standings endpoint
 */
export interface HockeyStandingsParams {
  /** League ID (required) */
  league: number;
  /** Season (required) */
  season: number;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Filter by stage */
  stage?: Optional<string>;
  /** Filter by group */
  group?: Optional<string>;
}
