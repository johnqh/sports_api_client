/**
 * Common types for API-Basketball responses
 */

import type { Optional } from "@sudobility/types";
import type { BaseApiConfig, BaseApiResponse } from "../../common";

/**
 * Configuration for API-Basketball client
 */
export type ApiBasketballConfig = BaseApiConfig;

/**
 * Base response wrapper for all API-Basketball endpoints
 */
export type ApiBasketballResponse<T> = BaseApiResponse<T>;

/**
 * Basketball timezone (string representation)
 */
export type BasketballTimezone = string;

/**
 * Basketball country
 */
export interface BasketballCountry {
  /** Country ID */
  id: number;
  /** Country name */
  name: string;
  /** Country code (ISO 3166-1 alpha-2) */
  code: Optional<string>;
  /** Country flag URL */
  flag: Optional<string>;
}

/**
 * Parameters for countries endpoint
 */
export interface BasketballCountriesParams {
  /** Filter by country ID */
  id?: Optional<number>;
  /** Filter by country name */
  name?: Optional<string>;
  /** Filter by country code */
  code?: Optional<string>;
  /** Search by partial name (min 3 characters) */
  search?: Optional<string>;
}
