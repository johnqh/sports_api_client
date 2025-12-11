/**
 * Types for Basketball Statistics endpoints
 */

import type { Optional } from "@sudobility/types";

/**
 * Basketball game statistics for a team
 */
export interface BasketballGameStatistics {
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: Optional<string>;
  };
  /** Statistics array */
  statistics: BasketballStatItem[];
}

/**
 * Individual statistic item
 */
export interface BasketballStatItem {
  /** Statistic type */
  type: string;
  /** Statistic value */
  value: Optional<number | string>;
}

/**
 * Parameters for game statistics endpoint
 */
export interface BasketballGameStatisticsParams {
  /** Game ID (required) */
  id: number;
  /** Filter by team ID */
  team?: Optional<number>;
}

/**
 * Common statistic types in basketball
 */
export type BasketballStatType =
  | "Points"
  | "Field Goals Made"
  | "Field Goals Attempted"
  | "Field Goals Percentage"
  | "3 Points Made"
  | "3 Points Attempted"
  | "3 Points Percentage"
  | "Free Throws Made"
  | "Free Throws Attempted"
  | "Free Throws Percentage"
  | "Offensive Rebounds"
  | "Defensive Rebounds"
  | "Total Rebounds"
  | "Assists"
  | "Steals"
  | "Blocks"
  | "Turnovers"
  | "Personal Fouls";
