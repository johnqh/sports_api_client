/**
 * @module baseball/types/baseball-teams
 * @description Team-related types for API-Baseball
 */

import type { BaseballCountry } from "./baseball-common";

/**
 * Team information
 */
export interface BaseballTeam {
  id: number;
  name: string;
  logo: string | null;
  national: boolean;
}

/**
 * Team response with country
 */
export interface BaseballTeamResponse {
  team: BaseballTeam;
  country: BaseballCountry;
}

/**
 * Parameters for teams endpoint
 */
export interface BaseballTeamsParams {
  id?: number;
  name?: string;
  country?: string;
  country_id?: number;
  league?: number;
  season?: number;
  search?: string;
}

/**
 * Team statistics
 */
export interface BaseballTeamStatistics {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string | null;
    flag: string | null;
    season: number;
  };
  team: BaseballTeam;
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
export interface BaseballTeamStatisticsParams {
  league: number;
  season: number;
  team: number;
}
