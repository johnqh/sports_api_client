/**
 * Types for Hockey Statistics
 */

import type { Optional } from "@sudobility/types";

/**
 * Hockey game statistics for a team
 */
export interface HockeyGameStatistics {
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: Optional<string>;
  };
  /** Statistics array */
  statistics: HockeyStatItem[];
}

/**
 * Individual statistic item
 */
export interface HockeyStatItem {
  /** Statistic type */
  type: string;
  /** Statistic value */
  value: Optional<number | string>;
}

/**
 * Parameters for game statistics endpoint
 */
export interface HockeyGameStatisticsParams {
  /** Game ID (required) */
  id: number;
  /** Filter by team ID */
  team?: Optional<number>;
}

/**
 * Common statistic types in hockey
 */
export type HockeyStatType =
  | "Shots on Goal"
  | "Shots off Goal"
  | "Total Shots"
  | "Blocked Shots"
  | "Shots insidebox"
  | "Shots outsidebox"
  | "Fouls"
  | "Corner Kicks"
  | "Offsides"
  | "Ball Possession"
  | "Yellow Cards"
  | "Red Cards"
  | "Goalkeeper Saves"
  | "Total passes"
  | "Passes accurate"
  | "Passes %";
