/**
 * @module rugby/types/rugby-teams
 * @description Team-related types for API-Rugby
 */

import type { RugbyCountry } from "./rugby-common";

/**
 * Team information
 */
export interface RugbyTeam {
  id: number;
  name: string;
  logo: string | null;
  national: boolean;
}

/**
 * Team response with country
 */
export interface RugbyTeamResponse {
  team: RugbyTeam;
  country: RugbyCountry;
}

/**
 * Parameters for teams endpoint
 */
export interface RugbyTeamsParams {
  id?: number;
  name?: string;
  country?: string;
  country_id?: number;
  league?: number;
  season?: number | string;
  search?: string;
}

/**
 * Team statistics
 */
export interface RugbyTeamStatistics {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string | null;
    flag: string | null;
    season: number | string;
  };
  team: RugbyTeam;
  games: {
    played: {
      home: number;
      away: number;
      all: number;
    };
    wins: {
      home: {
        total: number;
        percentage: string;
      };
      away: {
        total: number;
        percentage: string;
      };
      all: {
        total: number;
        percentage: string;
      };
    };
    draws: {
      home: {
        total: number;
        percentage: string;
      };
      away: {
        total: number;
        percentage: string;
      };
      all: {
        total: number;
        percentage: string;
      };
    };
    loses: {
      home: {
        total: number;
        percentage: string;
      };
      away: {
        total: number;
        percentage: string;
      };
      all: {
        total: number;
        percentage: string;
      };
    };
  };
  points: {
    for: {
      total: {
        home: number;
        away: number;
        all: number;
      };
      average: {
        home: string;
        away: string;
        all: string;
      };
    };
    against: {
      total: {
        home: number;
        away: number;
        all: number;
      };
      average: {
        home: string;
        away: string;
        all: string;
      };
    };
  };
}

/**
 * Parameters for team statistics endpoint
 */
export interface RugbyTeamStatisticsParams {
  league: number;
  season: number | string;
  team: number;
}
