/**
 * @module mma/types/mma-fights
 * @description Fight types for API-MMA
 */

import type { MmaCategory } from "./mma-categories";
import type { MmaFightFighter } from "./mma-fighters";

/**
 * Fight status
 */
export interface MmaFightStatus {
  long: string;
  short: string;
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
  slug: string | null;
  is_main: boolean;
  category: MmaCategory | null;
  status: MmaFightStatus;
  fighters: {
    first: MmaFightFighter;
    second: MmaFightFighter;
  };
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
