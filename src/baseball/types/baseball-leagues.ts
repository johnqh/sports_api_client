/**
 * @module baseball/types/baseball-leagues
 * @description League-related types for API-Baseball
 */

import type { BaseballCountry } from "./baseball-common";

/**
 * League information
 */
export interface BaseballLeague {
  id: number;
  name: string;
  type: string;
  logo: string | null;
}

/**
 * Season information within a league
 */
export interface BaseballSeason {
  season: number;
  start: string;
  end: string;
}

/**
 * League response with country and seasons
 */
export interface BaseballLeagueResponse {
  league: BaseballLeague;
  country: BaseballCountry;
  seasons: BaseballSeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface BaseballLeaguesParams {
  id?: number;
  name?: string;
  country?: string;
  country_id?: number;
  type?: string;
  season?: number;
  search?: string;
}
