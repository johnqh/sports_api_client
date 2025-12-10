/**
 * Types for Countries and Timezone endpoints
 */

import type { Optional } from "@sudobility/types";

/**
 * Country information
 */
export interface FootballCountry {
  /** Country name */
  name: string;
  /** ISO 3166-1 alpha-2 country code */
  code: Optional<string>;
  /** URL to country flag image */
  flag: Optional<string>;
}

/**
 * Parameters for countries endpoint
 */
export interface FootballCountriesParams {
  /** Filter by country name */
  name?: Optional<string>;
  /** Filter by country code */
  code?: Optional<string>;
  /** Search by partial name (min 3 characters) */
  search?: Optional<string>;
}

/**
 * Timezone is returned as a simple string
 */
export type FootballTimezone = string;
