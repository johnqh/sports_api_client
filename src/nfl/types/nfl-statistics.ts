/**
 * Types for NFL Statistics
 */

import type { Optional } from "@sudobility/types";

/**
 * NFL game statistics for a team
 */
export interface NflGameStatistics {
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: Optional<string>;
  };
  /** Statistics array */
  statistics: NflStatItem[];
}

/**
 * Individual statistic item
 */
export interface NflStatItem {
  /** Statistic type */
  type: string;
  /** Statistic value */
  value: Optional<number | string>;
}

/**
 * Parameters for game statistics endpoint
 */
export interface NflGameStatisticsParams {
  /** Game ID (required) */
  id: number;
  /** Filter by team ID */
  team?: Optional<number>;
}

/**
 * Common statistic types in NFL
 */
export type NflStatType =
  | "First Downs"
  | "Rushing Yards"
  | "Passing Yards"
  | "Total Yards"
  | "Turnovers"
  | "Fumbles Lost"
  | "Interceptions Thrown"
  | "Sacks"
  | "Third Down Efficiency"
  | "Fourth Down Efficiency"
  | "Red Zone Efficiency"
  | "Penalties"
  | "Penalty Yards"
  | "Time of Possession";
