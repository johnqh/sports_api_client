/**
 * Types for Hockey Teams
 */

import type { Optional } from "@sudobility/types";
import type { HockeyCountry } from "./hockey-common";

/**
 * Hockey team information
 */
export interface HockeyTeam {
  /** Team ID */
  id: number;
  /** Team name */
  name: string;
  /** Team logo URL */
  logo: Optional<string>;
  /** Whether team is a national team */
  national: boolean;
}

/**
 * Hockey team response with country
 */
export interface HockeyTeamResponse {
  /** Team information */
  team: HockeyTeam;
  /** Country information */
  country: HockeyCountry;
}

/**
 * Parameters for teams endpoint
 */
export interface HockeyTeamsParams {
  /** Filter by team ID */
  id?: Optional<number>;
  /** Filter by team name */
  name?: Optional<string>;
  /** Filter by country name */
  country?: Optional<string>;
  /** Filter by league ID */
  league?: Optional<number>;
  /** Filter by season */
  season?: Optional<number>;
  /** Search by name */
  search?: Optional<string>;
}

/**
 * Hockey team statistics
 */
export interface HockeyTeamStatistics {
  /** League information */
  league: {
    id: number;
    name: string;
    logo: Optional<string>;
  };
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: Optional<string>;
  };
  /** Country information */
  country: HockeyCountry;
  /** Games statistics */
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
  /** Goals statistics */
  goals: {
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
export interface HockeyTeamStatisticsParams {
  /** Team ID (required) */
  team: number;
  /** League ID (required) */
  league: number;
  /** Season (required) */
  season: number;
}
