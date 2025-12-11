/**
 * @module formula1/types/f1-circuits
 * @description Circuit-related types for API-Formula-1
 */

/**
 * Circuit information
 */
export interface F1Circuit {
  id: number;
  name: string;
  image: string | null;
  competition: {
    id: number;
    name: string;
    location: {
      country: string;
      city: string;
    };
  };
  first_grand_prix: number | null;
  laps: number | null;
  length: string | null;
  race_distance: string | null;
  lap_record: {
    time: string | null;
    driver: string | null;
    year: string | null;
  } | null;
  capacity: number | null;
  opened: number | null;
  owner: string | null;
}

/**
 * Parameters for circuits endpoint
 */
export interface F1CircuitsParams {
  id?: number;
  name?: string;
  country?: string;
  city?: string;
  search?: string;
}
