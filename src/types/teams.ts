/**
 * Types for Teams and Venues endpoints
 */

import type { Optional } from "@sudobility/types";

/**
 * Team information
 */
export interface Team {
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
export interface Venue {
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
export interface TeamResponse {
  /** Team information */
  team: Team;
  /** Venue information */
  venue: Venue;
}

/**
 * Parameters for teams endpoint
 */
export interface TeamsParams {
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
export interface VenuesParams {
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
export interface TeamStatistics {
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
  team: Team;
  /** Form string (e.g., "WWDLW") */
  form: Optional<string>;
  /** Fixtures statistics */
  fixtures: TeamFixturesStats;
  /** Goals statistics */
  goals: TeamGoalsStats;
  /** Biggest statistics */
  biggest: TeamBiggestStats;
  /** Clean sheet statistics */
  clean_sheet: TeamHomeAwayTotal;
  /** Failed to score statistics */
  failed_to_score: TeamHomeAwayTotal;
  /** Penalty statistics */
  penalty: TeamPenaltyStats;
  /** Lineups used */
  lineups: TeamLineup[];
  /** Cards statistics */
  cards: TeamCardsStats;
}

/**
 * Team fixtures statistics
 */
export interface TeamFixturesStats {
  played: TeamHomeAwayTotal;
  wins: TeamHomeAwayTotal;
  draws: TeamHomeAwayTotal;
  loses: TeamHomeAwayTotal;
}

/**
 * Home/Away/Total breakdown
 */
export interface TeamHomeAwayTotal {
  home: number;
  away: number;
  total: number;
}

/**
 * Team goals statistics
 */
export interface TeamGoalsStats {
  for: TeamGoalsDetail;
  against: TeamGoalsDetail;
}

/**
 * Goals detail with minute breakdown
 */
export interface TeamGoalsDetail {
  total: TeamHomeAwayTotal;
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
export interface TeamBiggestStats {
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
export interface TeamPenaltyStats {
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
export interface TeamLineup {
  formation: string;
  played: number;
}

/**
 * Cards statistics by minute
 */
export interface TeamCardsStats {
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
export interface TeamStatisticsParams {
  /** League ID (required) */
  league: number;
  /** Season year (required) */
  season: number;
  /** Team ID (required) */
  team: number;
  /** Filter by date */
  date?: Optional<string>;
}
