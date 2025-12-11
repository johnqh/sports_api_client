/**
 * @module formula1/types/f1-races
 * @description Race types for API-Formula-1
 */

import type { F1Circuit } from "./f1-circuits";
import type { F1Competition } from "./f1-competitions";

/**
 * Race status
 */
export interface F1RaceStatus {
  short: string;
  long: string;
}

/**
 * Race information
 */
export interface F1Race {
  id: number;
  competition: F1Competition;
  circuit: F1Circuit;
  season: number;
  type: string;
  laps: {
    current: number | null;
    total: number | null;
  };
  fastest_lap: {
    driver: {
      id: number | null;
    };
    time: string | null;
  } | null;
  distance: string | null;
  timezone: string;
  date: string;
  weather: string | null;
  status: F1RaceStatus;
}

/**
 * Parameters for races endpoint
 */
export interface F1RacesParams {
  id?: number;
  date?: string;
  next?: number;
  last?: number;
  competition?: number;
  circuit?: number;
  season?: number;
  type?: string;
  timezone?: string;
}
