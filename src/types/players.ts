/**
 * Types for Players endpoints
 */

import type { Optional } from "@sudobility/types";
import type { FootballBirth } from "./common";

/**
 * Player information
 */
export interface FootballPlayer {
  /** Player ID */
  id: number;
  /** Full name */
  name: string;
  /** First name */
  firstname: string;
  /** Last name */
  lastname: string;
  /** Age */
  age: number;
  /** Birth information */
  birth: FootballBirth;
  /** Nationality */
  nationality: string;
  /** Height (e.g., "180 cm") */
  height: Optional<string>;
  /** Weight (e.g., "75 kg") */
  weight: Optional<string>;
  /** Whether player is injured */
  injured: boolean;
  /** Photo URL */
  photo: string;
}

/**
 * Player statistics for a season
 */
export interface FootballPlayerStatistics {
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: string;
  };
  /** League information */
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: Optional<string>;
    season: number;
  };
  /** Games statistics */
  games: {
    appearences: Optional<number>;
    lineups: Optional<number>;
    minutes: Optional<number>;
    number: Optional<number>;
    position: string;
    rating: Optional<string>;
    captain: boolean;
  };
  /** Substitutes statistics */
  substitutes: {
    in: Optional<number>;
    out: Optional<number>;
    bench: Optional<number>;
  };
  /** Shots statistics */
  shots: {
    total: Optional<number>;
    on: Optional<number>;
  };
  /** Goals statistics */
  goals: {
    total: Optional<number>;
    conceded: Optional<number>;
    assists: Optional<number>;
    saves: Optional<number>;
  };
  /** Passes statistics */
  passes: {
    total: Optional<number>;
    key: Optional<number>;
    accuracy: Optional<number>;
  };
  /** Tackles statistics */
  tackles: {
    total: Optional<number>;
    blocks: Optional<number>;
    interceptions: Optional<number>;
  };
  /** Duels statistics */
  duels: {
    total: Optional<number>;
    won: Optional<number>;
  };
  /** Dribbles statistics */
  dribbles: {
    attempts: Optional<number>;
    success: Optional<number>;
    past: Optional<number>;
  };
  /** Fouls statistics */
  fouls: {
    drawn: Optional<number>;
    committed: Optional<number>;
  };
  /** Cards statistics */
  cards: {
    yellow: Optional<number>;
    yellowred: Optional<number>;
    red: Optional<number>;
  };
  /** Penalty statistics */
  penalty: {
    won: Optional<number>;
    commited: Optional<number>;
    scored: Optional<number>;
    missed: Optional<number>;
    saved: Optional<number>;
  };
}

/**
 * Complete player response with statistics
 */
export interface FootballPlayerResponse {
  /** Player information */
  player: FootballPlayer;
  /** Statistics by team/league/season */
  statistics: FootballPlayerStatistics[];
}

/**
 * Parameters for players endpoint
 */
export interface FootballPlayersParams {
  /** Filter by player ID */
  id?: Optional<number>;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Filter by league ID */
  league?: Optional<number>;
  /** Filter by season year (required if team or league provided) */
  season?: Optional<number>;
  /** Search by player name (min 3 characters) */
  search?: Optional<string>;
  /** Page number */
  page?: Optional<number>;
}

/**
 * Parameters for player seasons endpoint
 */
export interface FootballPlayersSeasonParams {
  /** Filter by player ID */
  player?: Optional<number>;
}

/**
 * Squad member (simplified player in squad context)
 */
export interface FootballSquadPlayer {
  /** Player ID */
  id: number;
  /** Player name */
  name: string;
  /** Age */
  age: number;
  /** Jersey number */
  number: Optional<number>;
  /** Position */
  position: string;
  /** Photo URL */
  photo: string;
}

/**
 * Squad response
 */
export interface FootballSquadResponse {
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: string;
  };
  /** Players in the squad */
  players: FootballSquadPlayer[];
}

/**
 * Parameters for squads endpoint
 */
export interface FootballSquadsParams {
  /** Team ID (required if player not provided) */
  team?: Optional<number>;
  /** Player ID (required if team not provided) */
  player?: Optional<number>;
}

/**
 * Parameters for top scorers endpoint
 */
export interface FootballTopScorersParams {
  /** League ID (required) */
  league: number;
  /** Season year (required) */
  season: number;
}

/**
 * Parameters for top assists endpoint
 */
export interface FootballTopAssistsParams {
  /** League ID (required) */
  league: number;
  /** Season year (required) */
  season: number;
}

/**
 * Parameters for top cards endpoint
 */
export interface FootballTopCardsParams {
  /** League ID (required) */
  league: number;
  /** Season year (required) */
  season: number;
}
