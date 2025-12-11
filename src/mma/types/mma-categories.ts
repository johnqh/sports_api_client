/**
 * @module mma/types/mma-categories
 * @description Weight class/category types for API-MMA
 */

/**
 * Category (weight class) information
 */
export interface MmaCategory {
  id: number;
  name: string;
  weight: string | null;
}

/**
 * Parameters for categories endpoint
 */
export interface MmaCategoriesParams {
  id?: number;
  name?: string;
  search?: string;
}
