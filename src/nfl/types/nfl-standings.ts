/**
 * Types for NFL Standings
 */

import type { Optional } from "@sudobility/types";

/**
 * NFL standing entry - matches actual API response
 */
export interface NflStanding {
  /** Position in standings */
  position: number;
  /** Conference name (e.g., "American Football Conference") */
  conference: string;
  /** Division name (e.g., "AFC East") */
  division: string;
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
    season: number;
    logo: Optional<string>;
    country: {
      name: string;
      code: string;
      flag: Optional<string>;
    };
  };
  /** Games won */
  won: number;
  /** Games lost */
  lost: number;
  /** Games tied */
  ties: number;
  /** Points statistics */
  points: {
    for: number;
    against: number;
    difference: number;
  };
  /** Records breakdown */
  records: {
    home: string;
    road: string;
    conference: string;
    division: string;
  };
  /** Current streak (e.g., "W5", "L2") */
  streak: Optional<string>;
  /** NCAA conference stats (for college) */
  ncaa_conference: {
    won: Optional<number>;
    lost: Optional<number>;
    points: {
      for: Optional<number>;
      against: Optional<number>;
    };
  };
  /** Group info (optional, for compatibility) */
  group?: {
    name: string;
  };
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
