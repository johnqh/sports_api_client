/**
 * Types for NFL Teams
 */

import type { Optional } from "@sudobility/types";
import type { NflCountry } from "./nfl-common";

/**
 * NFL team information
 */
export interface NflTeam {
  /** Team ID */
  id: number;
  /** Team name */
  name: string;
  /** Team logo URL */
  logo: Optional<string>;
  /** Team city */
  city: Optional<string>;
  /** Team code/abbreviation */
  code: Optional<string>;
  /** Team coach */
  coach: Optional<string>;
  /** Team owner */
  owner: Optional<string>;
  /** Stadium name */
  stadium: Optional<string>;
  /** Stadium capacity */
  capacity: Optional<number>;
  /** Year established */
  established: Optional<number>;
  /** Whether team is a national team */
  national: boolean;
}

/**
 * NFL team response with country
 */
export interface NflTeamResponse {
  /** Team information */
  team: NflTeam;
  /** Country information */
  country: NflCountry;
}

/**
 * Parameters for teams endpoint
 */
export interface NflTeamsParams {
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
 * NFL team statistics
 */
export interface NflTeamStatistics {
  /** League information */
  league: {
    id: number;
    name: string;
    season: number;
    logo: Optional<string>;
  };
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: Optional<string>;
  };
  /** Country information */
  country: NflCountry;
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
  /** Points statistics */
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
export interface NflTeamStatisticsParams {
  /** Team ID (required) */
  team: number;
  /** League ID (required) */
  league: number;
  /** Season (required) */
  season: number;
}
