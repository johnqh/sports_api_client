/**
 * Common types for API-American-Football (NFL)
 */

import type { Optional } from "@sudobility/types";
import type { BaseApiConfig, BaseApiResponse } from "../../common";

/**
 * API-NFL configuration
 */
export type ApiNflConfig = BaseApiConfig;

/**
 * API-NFL response wrapper
 */
export type ApiNflResponse<T> = BaseApiResponse<T>;

/**
 * Timezone type (string)
 */
export type NflTimezone = string;

/**
 * NFL country
 */
export interface NflCountry {
  /** Country ID */
  id: number;
  /** Country name */
  name: string;
  /** Country code (ISO) */
  code: Optional<string>;
  /** Country flag URL */
  flag: Optional<string>;
}

/**
 * Parameters for countries endpoint
 */
export interface NflCountriesParams {
  /** Filter by country ID */
  id?: Optional<number>;
  /** Filter by country name */
  name?: Optional<string>;
  /** Filter by country code */
  code?: Optional<string>;
  /** Search by name */
  search?: Optional<string>;
}
