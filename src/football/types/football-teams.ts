/**
 * Types for Teams and Venues endpoints
 */

import type { Optional } from "@sudobility/types";

/**
 * Team information
 */
export interface FootballTeam {
  /** Team ID */
  id: number;
  /** Team name */
  name: string;
  /** Team code (short name) */
  code: Optional<string>;
  /** Country of the team */
  country: string;
  /** Year the team was founded */
  founded: Optional<number>;
  /** Whether this is a national team */
  national: boolean;
  /** URL to team logo */
  logo: string;
}

/**
 * Venue/Stadium information
 */
export interface FootballVenue {
  /** Venue ID */
  id: Optional<number>;
  /** Venue name */
  name: string;
  /** Address of the venue */
  address: Optional<string>;
  /** City where the venue is located */
  city: string;
  /** Capacity of the venue */
  capacity: Optional<number>;
  /** Playing surface type */
  surface: Optional<string>;
  /** URL to venue image */
  image: Optional<string>;
}

/**
 * Complete team response including venue
 */
export interface FootballTeamResponse {
  /** Team information */
  team: FootballTeam;
  /** Venue information */
  venue: FootballVenue;
}

/**
 * Parameters for teams endpoint
 */
export interface FootballTeamsParams {
  /** Filter by team ID */
  id?: Optional<number>;
  /** Filter by team name */
  name?: Optional<string>;
  /** Filter by league ID (requires season) */
  league?: Optional<number>;
  /** Filter by season year */
  season?: Optional<number>;
  /** Filter by country name */
  country?: Optional<string>;
  /** Filter by team code */
  code?: Optional<string>;
  /** Filter by venue ID */
  venue?: Optional<number>;
  /** Search by partial name (min 3 characters) */
  search?: Optional<string>;
}

/**
 * Parameters for venues endpoint
 */
export interface FootballVenuesParams {
  /** Filter by venue ID */
  id?: Optional<number>;
  /** Filter by venue name */
  name?: Optional<string>;
  /** Filter by city */
  city?: Optional<string>;
  /** Filter by country */
  country?: Optional<string>;
  /** Search by partial name (min 3 characters) */
  search?: Optional<string>;
}

/**
 * Team statistics for a league/season
 */
export interface FootballTeamStatistics {
  /** League information */
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: Optional<string>;
    season: number;
  };
  /** Team information */
  team: FootballTeam;
  /** Form string (e.g., "WWDLW") */
  form: Optional<string>;
  /** Fixtures statistics */
  fixtures: FootballTeamFixturesStats;
  /** Goals statistics */
  goals: FootballTeamGoalsStats;
  /** Biggest statistics */
  biggest: FootballTeamBiggestStats;
  /** Clean sheet statistics */
  clean_sheet: FootballTeamHomeAwayTotal;
  /** Failed to score statistics */
  failed_to_score: FootballTeamHomeAwayTotal;
  /** Penalty statistics */
  penalty: FootballTeamPenaltyStats;
  /** Lineups used */
  lineups: FootballTeamLineup[];
  /** Cards statistics */
  cards: FootballTeamCardsStats;
}

/**
 * Team fixtures statistics
 */
export interface FootballTeamFixturesStats {
  played: FootballTeamHomeAwayTotal;
  wins: FootballTeamHomeAwayTotal;
  draws: FootballTeamHomeAwayTotal;
  loses: FootballTeamHomeAwayTotal;
}

/**
 * Home/Away/Total breakdown
 */
export interface FootballTeamHomeAwayTotal {
  home: number;
  away: number;
  total: number;
}

/**
 * Team goals statistics
 */
export interface FootballTeamGoalsStats {
  for: FootballTeamGoalsDetail;
  against: FootballTeamGoalsDetail;
}

/**
 * Goals detail with minute breakdown
 */
export interface FootballTeamGoalsDetail {
  total: FootballTeamHomeAwayTotal;
  average: {
    home: string;
    away: string;
    total: string;
  };
  minute: Record<
    string,
    { total: Optional<number>; percentage: Optional<string> }
  >;
}

/**
 * Biggest wins/losses/streaks
 */
export interface FootballTeamBiggestStats {
  streak: {
    wins: number;
    draws: number;
    loses: number;
  };
  wins: {
    home: Optional<string>;
    away: Optional<string>;
  };
  loses: {
    home: Optional<string>;
    away: Optional<string>;
  };
  goals: {
    for: {
      home: number;
      away: number;
    };
    against: {
      home: number;
      away: number;
    };
  };
}

/**
 * Penalty statistics
 */
export interface FootballTeamPenaltyStats {
  scored: {
    total: number;
    percentage: string;
  };
  missed: {
    total: number;
    percentage: string;
  };
  total: number;
}

/**
 * Lineup formation used
 */
export interface FootballTeamLineup {
  formation: string;
  played: number;
}

/**
 * Cards statistics by minute
 */
export interface FootballTeamCardsStats {
  yellow: Record<
    string,
    { total: Optional<number>; percentage: Optional<string> }
  >;
  red: Record<
    string,
    { total: Optional<number>; percentage: Optional<string> }
  >;
}

/**
 * Parameters for team statistics endpoint
 */
export interface FootballTeamStatisticsParams {
  /** League ID (required) */
  league: number;
  /** Season year (required) */
  season: number;
  /** Team ID (required) */
  team: number;
  /** Filter by date */
  date?: Optional<string>;
}
