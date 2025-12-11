/**
 * @module rugby/types/rugby-leagues
 * @description League-related types for API-Rugby
 */

import type { RugbyCountry } from "./rugby-common";

/**
 * League information
 */
export interface RugbyLeague {
  id: number;
  name: string;
  type: string;
  logo: string | null;
}

/**
 * Season information within a league
 */
export interface RugbySeason {
  season: number | string;
  start: string;
  end: string;
}

/**
 * League response with country and seasons
 */
export interface RugbyLeagueResponse {
  league: RugbyLeague;
  country: RugbyCountry;
  seasons: RugbySeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface RugbyLeaguesParams {
  id?: number;
  name?: string;
  country?: string;
  country_id?: number;
  type?: string;
  season?: number | string;
  search?: string;
}
