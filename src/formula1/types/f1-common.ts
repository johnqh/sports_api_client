/**
 * @module formula1/types/f1-common
 * @description Common types for API-Formula-1
 */

import type { BaseApiConfig, BaseApiResponse } from "../../common/base-types";

/**
 * API-Formula-1 configuration
 */
export type ApiF1Config = BaseApiConfig;

/**
 * API-Formula-1 response wrapper
 */
export interface ApiF1Response<T> extends BaseApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[] | Record<string, string>;
  results: number;
  response: T[];
}

/**
 * Parameters for seasons endpoint
 */
export interface F1SeasonsParams {
  search?: string;
}

/**
 * Timezone type (string array from API)
 */
export type F1Timezone = string;
