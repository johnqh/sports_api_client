/**
 * @module formula1/types/f1-competitions
 * @description Competition/Race-related types for API-Formula-1
 */

/**
 * Competition (Grand Prix) information
 */
export interface F1Competition {
  id: number;
  name: string;
  location: {
    country: string;
    city: string;
  };
}

/**
 * Parameters for competitions endpoint
 */
export interface F1CompetitionsParams {
  id?: number;
  name?: string;
  country?: string;
  city?: string;
  search?: string;
}
