/**
 * Types for Leagues and Seasons endpoints
 */

import type { Optional } from "@sudobility/types";
import type { Country } from "./countries";

/**
 * League information
 */
export interface League {
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
export interface Season {
  /** Season year (e.g., 2023) */
  year: number;
  /** Season start date (YYYY-MM-DD) */
  start: string;
  /** Season end date (YYYY-MM-DD) */
  end: string;
  /** Whether this is the current season */
  current: boolean;
  /** Coverage information for this season */
  coverage: SeasonCoverage;
}

/**
 * Coverage information for a season
 */
export interface SeasonCoverage {
  /** Fixtures coverage */
  fixtures: FixturesCoverage;
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
export interface FixturesCoverage {
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
export interface LeagueResponse {
  /** League information */
  league: League;
  /** Country information */
  country: Country;
  /** Available seasons */
  seasons: Season[];
}

/**
 * Parameters for leagues endpoint
 */
export interface LeaguesParams {
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
