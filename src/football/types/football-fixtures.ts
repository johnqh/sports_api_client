/**
 * Types for Fixtures endpoints
 */

import type { Optional } from "@sudobility/types";

/**
 * Fixture information
 */
export interface FootballFixture {
  /** Fixture ID */
  id: number;
  /** Referee name */
  referee: Optional<string>;
  /** Timezone of the fixture */
  timezone: string;
  /** Date and time in ISO format */
  date: string;
  /** Unix timestamp */
  timestamp: number;
  /** Match periods */
  periods: FootballFixturePeriods;
  /** Venue information */
  venue: FootballFixtureVenue;
  /** Match status */
  status: FootballFixtureStatus;
}

/**
 * Fixture periods (kickoff times)
 */
export interface FootballFixturePeriods {
  /** First half start timestamp */
  first: Optional<number>;
  /** Second half start timestamp */
  second: Optional<number>;
}

/**
 * Simplified venue for fixture
 */
export interface FootballFixtureVenue {
  /** Venue ID */
  id: Optional<number>;
  /** Venue name */
  name: Optional<string>;
  /** City */
  city: Optional<string>;
}

/**
 * Fixture status
 */
export interface FootballFixtureStatus {
  /** Long status description */
  long: string;
  /** Short status code */
  short: FootballFixtureStatusCode;
  /** Elapsed minutes */
  elapsed: Optional<number>;
}

/**
 * Fixture status codes
 */
export type FootballFixtureStatusCode =
  | "TBD" // Time To Be Defined
  | "NS" // Not Started
  | "1H" // First Half
  | "HT" // Halftime
  | "2H" // Second Half
  | "ET" // Extra Time
  | "P" // Penalty In Progress
  | "FT" // Match Finished
  | "AET" // Match Finished After Extra Time
  | "PEN" // Match Finished After Penalty
  | "BT" // Break Time
  | "SUSP" // Match Suspended
  | "INT" // Match Interrupted
  | "PST" // Match Postponed
  | "CANC" // Match Cancelled
  | "ABD" // Match Abandoned
  | "AWD" // Technical Loss
  | "WO" // WalkOver
  | "LIVE"; // Live

/**
 * League info in fixture context
 */
export interface FootballFixtureLeague {
  /** League ID */
  id: number;
  /** League name */
  name: string;
  /** Country */
  country: string;
  /** League logo URL */
  logo: string;
  /** Country flag URL */
  flag: Optional<string>;
  /** Season year */
  season: number;
  /** Round/matchday */
  round: string;
}

/**
 * Teams in a fixture
 */
export interface FootballFixtureTeams {
  /** Home team */
  home: FootballFixtureTeam;
  /** Away team */
  away: FootballFixtureTeam;
}

/**
 * Team in fixture context
 */
export interface FootballFixtureTeam {
  /** Team ID */
  id: number;
  /** Team name */
  name: string;
  /** Team logo URL */
  logo: string;
  /** Whether team won (null if draw or ongoing) */
  winner: Optional<boolean>;
}

/**
 * Goals in a fixture
 */
export interface FootballFixtureGoals {
  /** Home team goals */
  home: Optional<number>;
  /** Away team goals */
  away: Optional<number>;
}

/**
 * Score breakdown by period
 */
export interface FootballFixtureScore {
  /** Halftime score */
  halftime: FootballFixtureGoals;
  /** Fulltime score */
  fulltime: FootballFixtureGoals;
  /** Extra time score */
  extratime: FootballFixtureGoals;
  /** Penalty shootout score */
  penalty: FootballFixtureGoals;
}

/**
 * Complete fixture response
 */
export interface FootballFixtureResponse {
  /** Fixture information */
  fixture: FootballFixture;
  /** League information */
  league: FootballFixtureLeague;
  /** Teams */
  teams: FootballFixtureTeams;
  /** Goals */
  goals: FootballFixtureGoals;
  /** Score by period */
  score: FootballFixtureScore;
}

/**
 * Parameters for fixtures endpoint
 */
export interface FootballFixturesParams {
  /** Filter by fixture ID */
  id?: Optional<number>;
  /** Get live fixtures */
  live?: Optional<"all" | string>;
  /** Filter by date (YYYY-MM-DD) */
  date?: Optional<string>;
  /** Filter by league ID */
  league?: Optional<number>;
  /** Filter by season year */
  season?: Optional<number>;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Get last N fixtures */
  last?: Optional<number>;
  /** Get next N fixtures */
  next?: Optional<number>;
  /** Filter from date */
  from?: Optional<string>;
  /** Filter to date */
  to?: Optional<string>;
  /** Filter by round */
  round?: Optional<string>;
  /** Filter by status */
  status?: Optional<string>;
  /** Filter by venue ID */
  venue?: Optional<number>;
  /** Filter by timezone */
  timezone?: Optional<string>;
}

/**
 * Parameters for head to head endpoint
 */
export interface FootballHeadToHeadParams {
  /** Head to head teams (format: "team1-team2") */
  h2h: string;
  /** Filter by date */
  date?: Optional<string>;
  /** Filter by league ID */
  league?: Optional<number>;
  /** Filter by season */
  season?: Optional<number>;
  /** Get last N matches */
  last?: Optional<number>;
  /** Get next N matches */
  next?: Optional<number>;
  /** Filter from date */
  from?: Optional<string>;
  /** Filter to date */
  to?: Optional<string>;
  /** Filter by status */
  status?: Optional<string>;
  /** Filter by venue */
  venue?: Optional<number>;
  /** Filter by timezone */
  timezone?: Optional<string>;
}

/**
 * Fixture event (goal, card, substitution, etc.)
 */
export interface FootballFixtureEvent {
  /** Time of the event */
  time: {
    elapsed: number;
    extra: Optional<number>;
  };
  /** Team that the event belongs to */
  team: {
    id: number;
    name: string;
    logo: string;
  };
  /** Primary player */
  player: {
    id: Optional<number>;
    name: Optional<string>;
  };
  /** Assist/Secondary player */
  assist: {
    id: Optional<number>;
    name: Optional<string>;
  };
  /** Event type */
  type: "Goal" | "Card" | "subst" | "Var";
  /** Event detail */
  detail: string;
  /** Comments */
  comments: Optional<string>;
}

/**
 * Parameters for fixture events endpoint
 */
export interface FootballFixtureEventsParams {
  /** Fixture ID (required) */
  fixture: number;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Filter by player ID */
  player?: Optional<number>;
  /** Filter by event type */
  type?: Optional<"goal" | "card" | "subst" | "var">;
}

/**
 * Fixture lineup
 */
export interface FootballFixtureLineup {
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: string;
    colors: Optional<FootballTeamColors>;
  };
  /** Formation */
  formation: Optional<string>;
  /** Starting XI */
  startXI: FootballLineupPlayer[];
  /** Substitutes */
  substitutes: FootballLineupPlayer[];
  /** Coach */
  coach: {
    id: Optional<number>;
    name: Optional<string>;
    photo: Optional<string>;
  };
}

/**
 * Team colors for lineup
 */
export interface FootballTeamColors {
  player: FootballColorSet;
  goalkeeper: FootballColorSet;
}

/**
 * Color set (primary, number, border)
 */
export interface FootballColorSet {
  primary: string;
  number: string;
  border: string;
}

/**
 * Player in lineup
 */
export interface FootballLineupPlayer {
  player: {
    id: number;
    name: string;
    number: number;
    pos: Optional<string>;
    grid: Optional<string>;
  };
}

/**
 * Parameters for fixture lineups endpoint
 */
export interface FootballFixtureLineupsParams {
  /** Fixture ID (required) */
  fixture: number;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Filter by player ID */
  player?: Optional<number>;
  /** Filter by type */
  type?: Optional<string>;
}

/**
 * Fixture statistics
 */
export interface FootballFixtureStatistics {
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: string;
  };
  /** Statistics array */
  statistics: FootballStatisticItem[];
}

/**
 * Single statistic item
 */
export interface FootballStatisticItem {
  /** Statistic type */
  type: string;
  /** Statistic value */
  value: Optional<number | string>;
}

/**
 * Parameters for fixture statistics endpoint
 */
export interface FootballFixtureStatisticsParams {
  /** Fixture ID (required) */
  fixture: number;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Filter by statistic type */
  type?: Optional<string>;
}

/**
 * Player statistics in a fixture
 */
export interface FootballFixturePlayerStats {
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: string;
    update: string;
  };
  /** Players with their statistics */
  players: FootballPlayerFixtureStats[];
}

/**
 * Individual player's fixture statistics
 */
export interface FootballPlayerFixtureStats {
  /** Player information */
  player: {
    id: number;
    name: string;
    photo: string;
  };
  /** Statistics array (different for each position) */
  statistics: FootballPlayerStatDetail[];
}

/**
 * Player statistic detail
 */
export interface FootballPlayerStatDetail {
  games: {
    minutes: Optional<number>;
    number: number;
    position: string;
    rating: Optional<string>;
    captain: boolean;
    substitute: boolean;
  };
  offsides: Optional<number>;
  shots: {
    total: Optional<number>;
    on: Optional<number>;
  };
  goals: {
    total: Optional<number>;
    conceded: Optional<number>;
    assists: Optional<number>;
    saves: Optional<number>;
  };
  passes: {
    total: Optional<number>;
    key: Optional<number>;
    accuracy: Optional<string>;
  };
  tackles: {
    total: Optional<number>;
    blocks: Optional<number>;
    interceptions: Optional<number>;
  };
  duels: {
    total: Optional<number>;
    won: Optional<number>;
  };
  dribbles: {
    attempts: Optional<number>;
    success: Optional<number>;
    past: Optional<number>;
  };
  fouls: {
    drawn: Optional<number>;
    committed: Optional<number>;
  };
  cards: {
    yellow: number;
    red: number;
  };
  penalty: {
    won: Optional<number>;
    commited: Optional<number>;
    scored: Optional<number>;
    missed: Optional<number>;
    saved: Optional<number>;
  };
}

/**
 * Parameters for fixture players endpoint
 */
export interface FootballFixturePlayersParams {
  /** Fixture ID (required) */
  fixture: number;
  /** Filter by team ID */
  team?: Optional<number>;
}
