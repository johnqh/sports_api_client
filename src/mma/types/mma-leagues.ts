/**
 * @module mma/types/mma-leagues
 * @description League-related types for API-MMA
 */

import type { MmaCountry } from "./mma-common";

/**
 * League information
 */
export interface MmaLeague {
  id: number;
  name: string;
  type: string;
  logo: string | null;
}

/**
 * Season information within a league
 */
export interface MmaSeason {
  season: number;
  start: string;
  end: string;
}

/**
 * League response with country and seasons
 */
export interface MmaLeagueResponse {
  league: MmaLeague;
  country: MmaCountry;
  seasons: MmaSeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface MmaLeaguesParams {
  id?: number;
  name?: string;
  country?: string;
  country_id?: number;
  type?: string;
  season?: number;
  search?: string;
}
