/**
 * @module volleyball/types/volleyball-common
 * @description Common types for API-Volleyball
 */

import type { BaseApiConfig, BaseApiResponse } from "../../common";

/**
 * Configuration for the API-Volleyball client
 */
export type ApiVolleyballConfig = BaseApiConfig;

/**
 * Standard API-Volleyball response wrapper
 */
export type ApiVolleyballResponse<T> = BaseApiResponse<T>;

/**
 * Volleyball timezone
 */
export type VolleyballTimezone = string;

/**
 * Volleyball country
 */
export interface VolleyballCountry {
  id: number;
  name: string;
  code: string | null;
  flag: string | null;
}

/**
 * Parameters for countries endpoint
 */
export interface VolleyballCountriesParams {
  id?: number;
  name?: string;
  code?: string;
  search?: string;
}

/**
 * Volleyball season
 */
export type VolleyballSeason = number;

/**
 * Parameters for seasons endpoint
 */
export interface VolleyballSeasonsParams {
  league?: number;
}
