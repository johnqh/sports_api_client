/**
 * @module mma/types/mma-fights
 * @description Fight types for API-MMA
 */

import type { MmaCategory } from "./mma-categories";
import type { MmaFighter } from "./mma-fighters";
import type { MmaLeague } from "./mma-leagues";

/**
 * Fight status
 */
export interface MmaFightStatus {
  long: string;
  short: string;
}

/**
 * Fight result
 */
export interface MmaFightResult {
  winner: {
    id: number | null;
    name: string | null;
  } | null;
  method: string | null;
  round: number | null;
  time: string | null;
}

/**
 * Fight information
 */
export interface MmaFight {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  league: MmaLeague;
  category: MmaCategory;
  slug: string | null;
  status: MmaFightStatus;
  fighters: {
    first: MmaFighter;
    second: MmaFighter;
  };
  result: MmaFightResult;
}

/**
 * Parameters for fights endpoint
 */
export interface MmaFightsParams {
  id?: number;
  date?: string;
  league?: number;
  season?: number;
  fighter?: number;
  category?: number;
  timezone?: string;
}
