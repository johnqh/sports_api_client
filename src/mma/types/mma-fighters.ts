/**
 * @module mma/types/mma-fighters
 * @description Fighter types for API-MMA
 */

import type { MmaCategory } from "./mma-categories";

/**
 * Fighter information
 */
export interface MmaFighter {
  id: number;
  name: string;
  nickname: string | null;
  image: string | null;
  category: MmaCategory;
  nationality: string | null;
  country: {
    name: string | null;
    code: string | null;
    flag: string | null;
  } | null;
  birthdate: string | null;
  birthplace: string | null;
  age: number | null;
  height: string | null;
  reach: string | null;
  stance: string | null;
  wins: {
    total: number | null;
    knockouts: number | null;
    submissions: number | null;
    decisions: number | null;
  } | null;
  losses: {
    total: number | null;
    knockouts: number | null;
    submissions: number | null;
    decisions: number | null;
  } | null;
  draws: number | null;
  no_contests: number | null;
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
