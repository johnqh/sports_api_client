/**
 * Types for Transfers, Trophies, Sidelined, and Coachs endpoints
 */

import type { Optional } from "@sudobility/types";
import type { Birth } from "./common";

/**
 * Transfer record
 */
export interface Transfer {
  /** Transfer date */
  date: string;
  /** Transfer type */
  type: string;
  /** Teams involved */
  teams: {
    /** Team player left */
    in: {
      id: Optional<number>;
      name: string;
      logo: Optional<string>;
    };
    /** Team player joined */
    out: {
      id: Optional<number>;
      name: string;
      logo: Optional<string>;
    };
  };
}

/**
 * Transfer response (player with transfers)
 */
export interface TransferResponse {
  /** Player information */
  player: {
    id: number;
    name: string;
  };
  /** Update timestamp */
  update: string;
  /** Transfer history */
  transfers: Transfer[];
}

/**
 * Parameters for transfers endpoint
 */
export interface TransfersParams {
  /** Filter by player ID */
  player?: Optional<number>;
  /** Filter by team ID */
  team?: Optional<number>;
}

/**
 * Trophy record
 */
export interface Trophy {
  /** League/Competition name */
  league: string;
  /** Country */
  country: string;
  /** Season */
  season: string;
  /** Place/Result */
  place: string;
}

/**
 * Parameters for trophies endpoint
 */
export interface TrophiesParams {
  /** Filter by player ID */
  player?: Optional<number>;
  /** Filter by coach ID */
  coach?: Optional<number>;
}

/**
 * Sidelined record (injury/suspension)
 */
export interface Sidelined {
  /** Type of absence */
  type: string;
  /** Start date */
  start: string;
  /** End date */
  end: Optional<string>;
}

/**
 * Parameters for sidelined endpoint
 */
export interface SidelinedParams {
  /** Filter by player ID */
  player?: Optional<number>;
  /** Filter by coach ID */
  coach?: Optional<number>;
}

/**
 * Coach information
 */
export interface Coach {
  /** Coach ID */
  id: number;
  /** Coach name */
  name: string;
  /** First name */
  firstname: string;
  /** Last name */
  lastname: string;
  /** Age */
  age: number;
  /** Birth information */
  birth: Birth;
  /** Nationality */
  nationality: string;
  /** Height */
  height: Optional<string>;
  /** Weight */
  weight: Optional<string>;
  /** Photo URL */
  photo: string;
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: string;
  };
  /** Career history */
  career: CoachCareer[];
}

/**
 * Coach career entry
 */
export interface CoachCareer {
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: string;
  };
  /** Start date */
  start: string;
  /** End date */
  end: Optional<string>;
}

/**
 * Parameters for coachs endpoint
 */
export interface CoachsParams {
  /** Filter by coach ID */
  id?: Optional<number>;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Search by name */
  search?: Optional<string>;
}

/**
 * Injury record
 */
export interface Injury {
  /** Player information */
  player: {
    id: number;
    name: string;
    photo: string;
    type: string;
    reason: string;
  };
  /** Team information */
  team: {
    id: number;
    name: string;
    logo: string;
  };
  /** Fixture information */
  fixture: {
    id: number;
    timezone: string;
    date: string;
    timestamp: number;
  };
  /** League information */
  league: {
    id: number;
    season: number;
    name: string;
    country: string;
    logo: string;
    flag: Optional<string>;
  };
}

/**
 * Parameters for injuries endpoint
 */
export interface InjuriesParams {
  /** Filter by league ID */
  league?: Optional<number>;
  /** Filter by season */
  season?: Optional<number>;
  /** Filter by fixture ID */
  fixture?: Optional<number>;
  /** Filter by team ID */
  team?: Optional<number>;
  /** Filter by player ID */
  player?: Optional<number>;
  /** Filter by date */
  date?: Optional<string>;
  /** Filter by timezone */
  timezone?: Optional<string>;
}
