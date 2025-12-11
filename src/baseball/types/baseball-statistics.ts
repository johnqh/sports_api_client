/**
 * @module baseball/types/baseball-statistics
 * @description Statistics types for API-Baseball
 */

import type { BaseballTeam } from "./baseball-teams";

/**
 * Statistics item type
 */
export type BaseballStatType =
  | "Hits"
  | "Errors"
  | "Runs"
  | "Doubles"
  | "Triples"
  | "Home Runs"
  | "Strikeouts"
  | "Walks"
  | "Stolen Bases"
  | "At Bats"
  | "RBI"
  | string;

/**
 * Individual statistic item
 */
export interface BaseballStatItem {
  type: BaseballStatType;
  value: number | string | null;
}

/**
 * Team statistics for a game
 */
export interface BaseballTeamGameStats {
  team: BaseballTeam;
  statistics: BaseballStatItem[];
}

/**
 * Game statistics
 */
export interface BaseballGameStatistics {
  teams: BaseballTeamGameStats[];
}

/**
 * Parameters for game statistics endpoint
 */
export interface BaseballGameStatisticsParams {
  id: number;
  team?: number;
}
