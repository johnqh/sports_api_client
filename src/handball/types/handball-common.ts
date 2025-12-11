/**
 * @module handball/types/handball-common
 * @description Common types for API-Handball
 */

import type { BaseApiConfig, BaseApiResponse } from "../../common";

/**
 * Configuration for the API-Handball client
 */
export type ApiHandballConfig = BaseApiConfig;

/**
 * Standard API-Handball response wrapper
 */
export type ApiHandballResponse<T> = BaseApiResponse<T>;

/**
 * Handball timezone
 */
export type HandballTimezone = string;

/**
 * Handball country
 */
export interface HandballCountry {
  id: number;
  name: string;
  code: string | null;
  flag: string | null;
}

/**
 * Parameters for countries endpoint
 */
export interface HandballCountriesParams {
  id?: number;
  name?: string;
  code?: string;
  search?: string;
}

/**
 * Handball season
 */
export type HandballSeason = number;

/**
 * Parameters for seasons endpoint
 */
export interface HandballSeasonsParams {
  league?: number;
}
