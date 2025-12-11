/**
 * @module formula1/types/f1-pitstops
 * @description Pit stop types for API-Formula-1
 */

/**
 * Pit stop information
 */
export interface F1PitStop {
  id: number;
  race: {
    id: number;
  };
  driver: {
    id: number;
  };
  team: {
    id: number;
  };
  lap: number;
  stop: number;
  time: string;
  duration: string | null;
}

/**
 * Parameters for pit stops endpoint
 */
export interface F1PitStopsParams {
  race: number;
  driver?: number;
  team?: number;
}
