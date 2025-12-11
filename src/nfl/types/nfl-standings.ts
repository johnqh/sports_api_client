/**
 * Types for NFL Standings
 */

import type { Optional } from "@sudobility/types";
import type { NflCountry } from "./nfl-common";

/**
 * NFL standing entry
 */
export interface NflStanding {
  /** Position in standings */
  position: number;
  /** Stage (e.g., "Regular Season") */
  stage: string;
  /** Group/Division information */
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
  country: NflCountry;
  /** Games statistics */
  games: {
    played: number;
    win: number;
    lose: number;
    ties: Optional<number>;
  };
  /** Points statistics */
  points: {
    for: number;
    against: number;
    difference: number;
  };
  /** Win percentage */
  win_percentage: Optional<string>;
  /** Form (recent results) */
  form: Optional<string>;
  /** Description (playoff position, etc.) */
  description: Optional<string>;
}

/**
 * Parameters for standings endpoint
 */
export interface NflStandingsParams {
  /** League ID (required) */
  league: number;
  /** Season (required) */
  season: number;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Filter by stage */
  stage?: Optional<string>;
  /** Filter by division/group */
  group?: Optional<string>;
}
