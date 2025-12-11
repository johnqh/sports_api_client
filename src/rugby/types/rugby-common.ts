/**
 * @module rugby/types/rugby-common
 * @description Common types for API-Rugby
 */

import type { BaseApiConfig, BaseApiResponse } from "../../common/base-types";

/**
 * API-Rugby configuration
 */
export type ApiRugbyConfig = BaseApiConfig;

/**
 * API-Rugby response wrapper
 */
export interface ApiRugbyResponse<T> extends BaseApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[] | Record<string, string>;
  results: number;
  response: T[];
}

/**
 * Country information
 */
export interface RugbyCountry {
  id: number;
  name: string;
  code: string | null;
  flag: string | null;
}

/**
 * Parameters for countries endpoint
 */
export interface RugbyCountriesParams {
  id?: number;
  name?: string;
  code?: string;
  search?: string;
}

/**
 * Parameters for seasons endpoint
 */
export interface RugbySeasonsParams {
  league?: number;
}

/**
 * Timezone type (string array from API)
 */
export type RugbyTimezone = string;
