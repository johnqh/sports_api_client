/**
 * @module handball/types/handball-standings
 * @description Standings types for API-Handball
 */

import type { HandballLeague, HandballLeagueCountry } from "./handball-leagues";

/**
 * Team record stats
 */
export interface HandballTeamRecord {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: {
    for: number;
    against: number;
  };
}

/**
 * Standing entry
 */
export interface HandballStandingEntry {
  position: number;
  stage: string;
  group: {
    name: string;
  };
  team: {
    id: number;
    name: string;
    logo: string | null;
  };
  points: number;
  goalsDiff: number;
  form: string | null;
  status: string | null;
  description: string | null;
  all: HandballTeamRecord;
  home: HandballTeamRecord;
  away: HandballTeamRecord;
}

/**
 * Standings response
 */
export interface HandballStandingsResponse {
  league: HandballLeague;
  country: HandballLeagueCountry;
  season: number;
  standings: HandballStandingEntry[][];
}

/**
 * Parameters for standings endpoint
 */
export interface HandballStandingsParams {
  league: number;
  season: number;
  team?: number;
}
