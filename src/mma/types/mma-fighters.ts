/**
 * @module mma/types/mma-fighters
 * @description Fighter types for API-MMA
 */

import type { MmaCategory } from "./mma-categories";

/**
 * Fighter team information
 */
export interface MmaTeam {
  id: number;
  name: string;
}

/**
 * Full fighter information (from /fighters endpoint)
 */
export interface MmaFighter {
  id: number;
  name: string;
  nickname: string | null;
  photo: string | null;
  gender: string | null;
  birth_date: string | null;
  age: number | null;
  height: string | null;
  weight: string | null;
  reach: string | null;
  stance: string | null;
  category: MmaCategory | null;
  team: MmaTeam | null;
  last_update: string | null;
}

/**
 * Fighter summary in fight context
 */
export interface MmaFightFighter {
  id: number;
  name: string;
  logo: string | null;
  winner: boolean;
}

/**
 * Parameters for fighters endpoint
 */
export interface MmaFightersParams {
  id?: number;
  name?: string;
  category?: number;
  search?: string;
}
