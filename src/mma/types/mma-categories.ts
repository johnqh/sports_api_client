/**
 * @module mma/types/mma-categories
 * @description Weight class/category types for API-MMA
 */

/**
 * Category (weight class) - returned as string from API
 */
export type MmaCategory = string;

/**
 * Parameters for categories endpoint
 */
export interface MmaCategoriesParams {
  id?: number;
  name?: string;
  search?: string;
}
