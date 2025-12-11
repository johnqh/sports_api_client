/**
 * Types for Basketball Teams endpoints
 */

import type { Optional } from "@sudobility/types";

/**
 * Basketball team information
 */
export interface BasketballTeam {
  /** Team ID */
  id: number;
  /** Team name */
  name: string;
  /** Team logo URL */
  logo: Optional<string>;
  /** Whether this is a national team */
  national: boolean;
}

/**
 * Basketball team response - flat structure from API
 * API returns: { id, name, logo, national, country: {...} }
 */
export interface BasketballTeamResponse {
  /** Team ID */
  id: number;
  /** Team name */
  name: string;
  /** Team logo URL */
  logo: Optional<string>;
  /** Whether this is a national team */
  national: boolean;
  /** Country information */
  country: {
    id: number;
    name: string;
    code: Optional<string>;
    flag: Optional<string>;
  };
}

/**
 * Parameters for teams endpoint
 */
export interface BasketballTeamsParams {
  /** Filter by team ID */
  id?: Optional<number>;
  /** Filter by team name */
  name?: Optional<string>;
  /** Filter by country ID */
  country?: Optional<number>;
  /** Filter by league ID */
  league?: Optional<number>;
  /** Filter by season */
  season?: Optional<string>;
  /** Search by partial name (min 3 characters) */
  search?: Optional<string>;
}

/**
 * Basketball team statistics
 */
export interface BasketballTeamStatistics {
  /** League information */
  league: {
    id: number;
    name: string;
    type: string;
    logo: Optional<string>;
  };
  /** Country information */
  country: {
    id: number;
    name: string;
    code: Optional<string>;
    flag: Optional<string>;
  };
  /** Team information */
  team: BasketballTeam;
  /** Games statistics */
  games: {
    played: {
      home: number;
      away: number;
      all: number;
    };
    wins: {
      home: { total: number; percentage: string };
      away: { total: number; percentage: string };
      all: { total: number; percentage: string };
    };
    loses: {
      home: { total: number; percentage: string };
      away: { total: number; percentage: string };
      all: { total: number; percentage: string };
    };
  };
  /** Points statistics */
  points: {
    for: {
      total: { home: number; away: number; all: number };
      average: { home: string; away: string; all: string };
    };
    against: {
      total: { home: number; away: number; all: number };
      average: { home: string; away: string; all: string };
    };
  };
}

/**
 * Parameters for team statistics endpoint
 */
export interface BasketballTeamStatisticsParams {
  /** League ID (required) */
  league: number;
  /** Season (required) */
  season: string;
  /** Team ID (required) */
  team: number;
  /** Filter by date */
  date?: Optional<string>;
}
