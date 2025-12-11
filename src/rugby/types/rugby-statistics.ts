/**
 * @module rugby/types/rugby-statistics
 * @description Statistics types for API-Rugby
 */

import type { RugbyTeam } from "./rugby-teams";

/**
 * Statistics item type
 */
export type RugbyStatType =
  | "Tries"
  | "Conversions"
  | "Penalty Goals"
  | "Drop Goals"
  | "Yellow Cards"
  | "Red Cards"
  | "Tackles"
  | "Lineouts Won"
  | "Scrums Won"
  | "Turnovers"
  | "Possession %"
  | string;

/**
 * Individual statistic item
 */
export interface RugbyStatItem {
  type: RugbyStatType;
  value: number | string | null;
}

/**
 * Team statistics for a game
 */
export interface RugbyTeamGameStats {
  team: RugbyTeam;
  statistics: RugbyStatItem[];
}

/**
 * Game statistics
 */
export interface RugbyGameStatistics {
  teams: RugbyTeamGameStats[];
}

/**
 * Parameters for game statistics endpoint
 */
export interface RugbyGameStatisticsParams {
  id: number;
  team?: number;
}
