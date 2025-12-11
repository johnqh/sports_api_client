/**
 * @module mma/network/mma-endpoints
 * @description API-MMA endpoint definitions
 */

/**
 * Base URL for API-MMA
 */
export const MMA_API_BASE_URL = "https://v1.mma.api-sports.io";

/**
 * RapidAPI host for API-MMA
 */
export const MMA_RAPIDAPI_HOST = "api-mma.p.rapidapi.com";

/**
 * Default headers for API-MMA requests
 */
export const MMA_DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

/**
 * API-MMA endpoint paths
 * Note: MMA API does NOT have a /leagues endpoint
 */
export const MMA_ENDPOINTS = {
  // General
  TIMEZONE: "/timezone",
  COUNTRIES: "/countries",
  SEASONS: "/seasons",

  // Categories (weight classes)
  CATEGORIES: "/categories",

  // Fighters
  FIGHTERS: "/fighters",

  // Fights
  FIGHTS: "/fights",
} as const;
