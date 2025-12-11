/**
 * @module volleyball/types/volleyball-standings
 * @description Standings types for API-Volleyball
 */

import type {
  VolleyballLeague,
  VolleyballLeagueCountry,
} from "./volleyball-leagues";

/**
 * Team record stats
 */
export interface VolleyballTeamRecord {
  played: number;
  win: number;
  lose: number;
  sets: {
    for: number;
    against: number;
  };
}

/**
 * Standing entry
 */
export interface VolleyballStandingEntry {
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
  setsDiff: number;
  form: string | null;
  status: string | null;
  description: string | null;
  all: VolleyballTeamRecord;
  home: VolleyballTeamRecord;
  away: VolleyballTeamRecord;
}

/**
 * Standings response
 */
export interface VolleyballStandingsResponse {
  league: VolleyballLeague;
  country: VolleyballLeagueCountry;
  season: number;
  standings: VolleyballStandingEntry[][];
}

/**
 * Parameters for standings endpoint
 */
export interface VolleyballStandingsParams {
  league: number;
  season: number;
  team?: number;
}
