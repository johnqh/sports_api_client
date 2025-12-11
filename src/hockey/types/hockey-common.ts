/**
 * Common types for API-Hockey
 */

import type { Optional } from "@sudobility/types";
import type { BaseApiConfig, BaseApiResponse } from "../../common";

/**
 * API-Hockey configuration
 */
export type ApiHockeyConfig = BaseApiConfig;

/**
 * API-Hockey response wrapper
 */
export type ApiHockeyResponse<T> = BaseApiResponse<T>;

/**
 * Timezone type (string)
 */
export type HockeyTimezone = string;

/**
 * Hockey country
 */
export interface HockeyCountry {
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
export interface HockeyCountriesParams {
  /** Filter by country ID */
  id?: Optional<number>;
  /** Filter by country name */
  name?: Optional<string>;
  /** Filter by country code */
  code?: Optional<string>;
  /** Search by name */
  search?: Optional<string>;
}
