/**
 * @module mma/types/mma-common
 * @description Common types for API-MMA
 */

import type { BaseApiConfig, BaseApiResponse } from "../../common/base-types";

/**
 * API-MMA configuration
 */
export type ApiMmaConfig = BaseApiConfig;

/**
 * API-MMA response wrapper
 */
export interface ApiMmaResponse<T> extends BaseApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[] | Record<string, string>;
  results: number;
  response: T[];
}

/**
 * Parameters for seasons endpoint
 */
export interface MmaSeasonsParams {
  league?: number;
}

/**
 * Timezone type (string array from API)
 */
export type MmaTimezone = string;

/**
 * Country information
 */
export interface MmaCountry {
  id: number;
  name: string;
  code: string | null;
  flag: string | null;
}

/**
 * Parameters for countries endpoint
 */
export interface MmaCountriesParams {
  id?: number;
  name?: string;
  code?: string;
  search?: string;
}
