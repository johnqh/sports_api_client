/**
 * @module baseball/types/baseball-common
 * @description Common types for API-Baseball
 */

import type { BaseApiConfig, BaseApiResponse } from "../../common/base-types";

/**
 * API-Baseball configuration
 */
export type ApiBaseballConfig = BaseApiConfig;

/**
 * API-Baseball response wrapper
 */
export interface ApiBaseballResponse<T> extends BaseApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[] | Record<string, string>;
  results: number;
  response: T[];
}

/**
 * Country information
 */
export interface BaseballCountry {
  id: number;
  name: string;
  code: string | null;
  flag: string | null;
}

/**
 * Parameters for countries endpoint
 */
export interface BaseballCountriesParams {
  id?: number;
  name?: string;
  code?: string;
  search?: string;
}

/**
 * Parameters for seasons endpoint
 */
export interface BaseballSeasonsParams {
  league?: number;
}

/**
 * Timezone type (string array from API)
 */
export type BaseballTimezone = string;
