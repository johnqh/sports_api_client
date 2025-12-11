/**
 * Types for Leagues and Seasons endpoints
 */

import type { Optional } from "@sudobility/types";
import type { FootballCountry } from "./football-countries";

/**
 * League information
 */
export interface FootballLeague {
  /** League ID */
  id: number;
  /** League name */
  name: string;
  /** Type of competition */
  type: "League" | "Cup";
  /** URL to league logo */
  logo: string;
}

/**
 * Season information within a league
 */
export interface FootballSeason {
  /** Season year (e.g., 2023) */
  year: number;
  /** Season start date (YYYY-MM-DD) */
  start: string;
  /** Season end date (YYYY-MM-DD) */
  end: string;
  /** Whether this is the current season */
  current: boolean;
  /** Coverage information for this season */
  coverage: FootballSeasonCoverage;
}

/**
 * Coverage information for a season
 */
export interface FootballSeasonCoverage {
  /** Fixtures coverage */
  fixtures: FootballFixturesCoverage;
  /** Whether standings are available */
  standings: boolean;
  /** Whether players data is available */
  players: boolean;
  /** Whether top scorers are available */
  top_scorers: boolean;
  /** Whether top assists are available */
  top_assists: boolean;
  /** Whether top cards are available */
  top_cards: boolean;
  /** Whether injuries data is available */
  injuries: boolean;
  /** Whether predictions are available */
  predictions: boolean;
  /** Whether odds are available */
  odds: boolean;
}

/**
 * Fixtures coverage details
 */
export interface FootballFixturesCoverage {
  /** Whether events are available */
  events: boolean;
  /** Whether lineups are available */
  lineups: boolean;
  /** Whether statistics by fixture are available */
  statistics_fixtures: boolean;
  /** Whether statistics by players are available */
  statistics_players: boolean;
}

/**
 * Complete league response including country and seasons
 */
export interface FootballLeagueResponse {
  /** League information */
  league: FootballLeague;
  /** Country information */
  country: FootballCountry;
  /** Available seasons */
  seasons: FootballSeason[];
}

/**
 * Parameters for leagues endpoint
 */
export interface FootballLeaguesParams {
  /** Filter by league ID */
  id?: Optional<number>;
  /** Filter by league name */
  name?: Optional<string>;
  /** Filter by country name */
  country?: Optional<string>;
  /** Filter by country code */
  code?: Optional<string>;
  /** Filter by season year */
  season?: Optional<number>;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Filter by league type */
  type?: Optional<"league" | "cup">;
  /** Get current leagues only */
  current?: Optional<boolean>;
  /** Search by partial name (min 3 characters) */
  search?: Optional<string>;
  /** Return last N seasons */
  last?: Optional<number>;
}
